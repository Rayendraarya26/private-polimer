<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Enums\Option;
use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use App\Libraries\WhatsappService;
use App\Models\Db1\Pegawai;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganInstansi;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\PelangganPerusahaan;
use App\Traits\CaptchaTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    use CaptchaTrait;

    public function index(Request $request)
    {
        $user = $request->user();
        $userGroups = $user->sys_user_groups;

        // Resolve active group: check session first, then default group, then first available group
        $sessionGroupId = session('group_selected');
        $groupData = null;

        if ($sessionGroupId) {
            $groupData = $userGroups->where('group_id', $sessionGroupId)->first();
        }

        if (!$groupData) {
            // Prioritize highest administrative group if exists
            $adminGroup = $userGroups->first(function ($g) {
                $name = strtolower($g->sys_group->name ?? '');
                return in_array($g->group_id, [SysGroup::ROOT->value, SysGroup::ADMIN->value])
                    || str_contains($name, 'super')
                    || str_contains($name, 'admin')
                    || str_contains($name, 'root');
            });

            $groupData = $adminGroup 
                ?: ($userGroups->where('is_default', 'yes')->first() ?: $userGroups->first());
        }

        $activeGroupId = $groupData?->group_id ?? SysGroup::PELANGGAN->value;
        $activeGroupName = $groupData?->sys_group->name ?? (session('group_selected_name') ?? 'Pelanggan');

        $isPelanggan = $activeGroupId === SysGroup::PELANGGAN->value;
        $detail = $isPelanggan 
            ? $this->extractDetailPelanggan($user->pelanggan) 
            : $this->extractDetailPegawai($user->pegawai);

        $pictureUrl = null;
        if (!empty($user->picture)) {
            $pictureUrl = rescue(fn() => Storage::disk('s3')->temporaryUrl($user->picture, now()->addWeek()), null, false);
        }

        // Map all available groups for multi-role switching
        $availableGroups = $userGroups->map(function ($g) use ($activeGroupId) {
            return [
                'group_id'   => $g->group_id,
                'group_name' => $g->sys_group->name ?? 'Grup',
                'is_default' => $g->group_id === $activeGroupId || $g->is_default === 'yes',
            ];
        })->values()->toArray();

        return responseJSON("success", [
            'id'                    => $user->id,
            'name'                  => $user->name,
            'email'                 => $user->email,
            'nip'                   => $user->nip,
            'force_update_password' => $user->force_update_password,
            'picture'               => $pictureUrl,
            'last_login'            => $user->last_login,
            'group'                 => [
                'id'   => $activeGroupId,
                'name' => $activeGroupName,
            ],
            'available_groups'      => $availableGroups,
            'permissions'           => session('permission', []),
            'menu'                  => session('menu', []),
            'detail'                => $detail,
        ]);
    }

    private function extractDetailPegawai(?Pegawai $pegawai)
    {
        if (!$pegawai) {
            return [
                'nik'      => null,
                'whatsapp' => null,
            ];
        }

        return [
            'nik'      => $pegawai->nik,
            'whatsapp' => $pegawai->whatsapp,
        ];
    }

    private function extractDetailPelanggan(?Pelanggan $pelanggan)
    {
        if (!$pelanggan) {
            return [
                'type' => PelangganJenisPelanggan::PERORANGAN->value,
            ];
        }

        $rawJenis = $pelanggan->jenis_pelanggan;
        $jenisValue = $rawJenis instanceof PelangganJenisPelanggan 
            ? $rawJenis->value 
            : (string) ($rawJenis ?? PelangganJenisPelanggan::PERORANGAN->value);

        $detail = [
            'type' => $jenisValue,
        ];

        $d = rescue(fn() => $pelanggan->detail ? $pelanggan->detail->toArray() : [], [], false);
        if (is_array($d)) {
            $detail = array_merge($detail, $d);
            Arr::forget($detail, ['id', 'pelanggan_id', 'created_at', 'updated_at']);
        }

        $documents = [
            'dok_npwp',
            'dok_nib',
            'dok_lainnya'
        ];

        $jenisEnum = $rawJenis instanceof PelangganJenisPelanggan 
            ? $rawJenis 
            : PelangganJenisPelanggan::tryFrom($jenisValue);

        // Add document types based on pelanggan type
        switch ($jenisEnum) {
            case PelangganJenisPelanggan::PERORANGAN:
            case PelangganJenisPelanggan::INSTANSI_PEMERINTAH:
                $documents = array_merge($documents, ['dok_sk_nomenklatur']);
                break;
            case PelangganJenisPelanggan::BADAN_USAHA:
                $documents = array_merge($documents, ['dok_akta_pendirian', 'dok_iup']);
                break;
        }

        // Generate temporary URLs for documents safely
        foreach ($documents as $document) {
            if (!empty($d[$document])) {
                $detail[$document] = rescue(fn() => Storage::disk('s3')->temporaryUrl($d[$document], now()->addWeek()), null, false);
            }
        }

        return $detail;
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'recaptcha'    => 'required',
            'old_password' => 'required',
            'new_password' => 'required|confirmed|min:8|different:old_password',
        ]);

        if (!$this->validateCaptcha($request->input('recaptcha'))) {
            return responseJSON('Captcha tidak valid.', [], 400);
        }

        $user = $request->user();

        if (!password_verify($request->old_password, $user->password)) {
            return responseJSON('Password lama tidak sesuai.', null, 400);
        }

        $user->password              = bcrypt($request->new_password);
        $user->force_update_password = false;
        $user->save();

        return responseJSON('Password berhasil diubah.', null);
    }

    public function updateAccount(Request $request)
    {
        $request->validate([
            'recaptcha' => 'required',
            'name'      => 'required|string|max:255',
        ]);

        if (!$this->validateCaptcha($request->input('recaptcha'))) {
            return responseJSON('Captcha tidak valid.', [], 400);
        }

        $user       = $request->user();
        $user->name = $request->name;
        $user->save();

        Cache::forget('user_' . $user->id);

        return responseJSON('Nama berhasil diperbarui.');
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'recaptcha' => 'sometimes',
        ]);

        if (!$this->validateCaptcha($request->input('recaptcha'))) {
            return responseJSON('Captcha tidak valid.', [], 400);
        }

        try {
            $pelanggan = $request->user()->pelanggan;
            if (!$pelanggan) {
                return responseJSON('error', 'Profil pelanggan tidak ditemukan.', 404);
            }

            match ($pelanggan->jenis_pelanggan) {
                PelangganJenisPelanggan::PERORANGAN->value => $this->updateProfilePerorangan($request),
                PelangganJenisPelanggan::INSTANSI_PEMERINTAH->value => $this->updateProfileInstansi($request),
                PelangganJenisPelanggan::BADAN_USAHA->value => $this->updateProfileBadanUsaha($request),
                default => responseJSON('error', 'Jenis pelanggan tidak dikenal.', 400),
            };

            Cache::forget('user_' . $request->user()->id);
            return responseJSON('success', 'Profil berhasil diperbarui.');
        } catch (Exception $e) {
            Log::withContext($request->except('recaptcha'))->error($e);
            return responseJSON($e->getMessage(), [], 500);
        }
    }

    /**
     * @throws Exception
     */
    private function updateProfilePerorangan(Request $request)
    {
        $input = $request->validate([
            'nama'                => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'alamat'              => 'required|string',
            'prov_id'             => 'required|exists:master_provinsi,prov_id',
            'kab_id'              => 'required|exists:master_kabupaten,kab_id',
            'kec_id'              => 'required|exists:master_kecamatan,kec_id',
            'tempat_lahir'        => 'required|string',
            'tanggal_lahir'       => 'required|date:Y-m-d',
            'jenis_kelamin'       => 'required|in:' . implode(',', PelangganGender::toArray()),
            'kewarganegaraan'     => 'required|string',
            'nik'                 => 'required|numeric|digits:16',
            'surel'               => 'required|email:rfc,dns',
            'whatsapp'            => 'required|numeric|digits_between:10,15',
            'whatsapp_otp'        => 'nullable',
            'pendidikan_terakhir' => 'required|string',
            'npwp'                => 'required|numeric|digits:16',
            'nib'                 => 'nullable|numeric|digits:13',
            'dok_npwp'            => 'nullable|file|mimes:pdf|max:5120',
            'dok_nib'             => 'nullable|file|mimes:pdf|max:5120',
            'dok_lainnya'         => 'nullable|file|mimes:pdf,zip|max:5120',
        ]);

        $pelanggan = PelangganPerorangan::where('pelanggan_id', $request->user()->pelanggan->id)->firstOrNew();

        // if dok_npwp empty and no file uploaded, throw error
        if (empty($pelanggan->dok_npwp) && !$request->hasFile('dok_npwp')) {
            throw new Exception('NPWP wajib diunggah.');
        }

        // check WhatsApp otp should be required if any changes
        if (config('services.whatsapp.enabled') && ($pelanggan->whatsapp != $input['whatsapp'] || $pelanggan->whatsapp_verified == Option::NO->value)) {
            if (empty($input['whatsapp_otp'])) {
                throw new Exception('OTP tidak boleh kosong');
            }

            $otp = Cache::get($this->getCacheName($input['whatsapp']));
            if ($otp != $input['whatsapp_otp']) {
                throw new Exception('OTP tidak valid');
            }

            $pelanggan->whatsapp_verified = Option::YES;
        }
        // logika concate alamat
        $provinsi = \DB::table('master_provinsi')->where('prov_id',$input['prov_id'])->first();
        $kabupaten = \DB::table('master_kabupaten')->where('kab_id',$input['kab_id'])->first();
        $kecamatan = \DB::table('master_kecamatan')->where('kec_id',$input['kec_id'])->first();

       $rawAlamat = $input['alamat'];
        if (str_contains($rawAlamat, ' KEC. ')) {
            $rawAlamat = explode(' KEC. ', $rawAlamat)[0];
        }

        $alamatLengkap = sprintf(
            "%s, KEC. %s, %s, PROV. %s",
            $rawAlamat, 
            $kecamatan->kec_nama,
            $kabupaten->kab_nama,
            $provinsi->prov_nama
        );

        $pelanggan->nama                = $input['nama'];
        $pelanggan->alamat              = $alamatLengkap;
        $pelanggan->tempat_lahir        = $input['tempat_lahir'];
        $pelanggan->tanggal_lahir       = $input['tanggal_lahir'];
        $pelanggan->jenis_kelamin       = $input['jenis_kelamin'];
        $pelanggan->kewarganegaraan     = $input['kewarganegaraan'];
        $pelanggan->nik                 = $input['nik'];
        $pelanggan->surel               = $input['surel'];
        $pelanggan->pendidikan_terakhir = $input['pendidikan_terakhir'];
        $pelanggan->whatsapp            = $input['whatsapp'];
        $pelanggan->npwp                = $input['npwp'];
        $pelanggan->nib                 = $input['nib'];

        // Input Id Alamat
        $pelanggan->prov_id          = $input['prov_id'];
        $pelanggan->kab_id           = $input['kab_id'];
        $pelanggan->kec_id           = $input['kec_id'];

        $dokumen = [
            'dok_npwp'    => 'NPWP',
            'dok_nib'     => 'NIB',
            'dok_lainnya' => 'Dokumen Lainnya',
        ];

        return $this->saveAndUploadFileToStorage($dokumen, $request, $pelanggan);
    }

    /**
     * @throws Exception
     */
    private function updateProfileInstansi(Request $request)
    {
        $input = $request->validate([
            'nama'               => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'alamat'             => 'required|string',
            'prov_id'            => 'required|exists:master_provinsi,prov_id',
            'kab_id'             => 'required|exists:master_kabupaten,kab_id',
            'kec_id'             => 'required|exists:master_kecamatan,kec_id',
            'pimpinan'           => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'telepon'            => 'required',
            'fax'                => 'required',
            'surel'              => 'required|email:rfc,dns',
            'whatsapp'           => 'required|numeric|digits_between:10,15',
            'npwp'               => 'required|numeric|digits:16',
            'nib'                => 'nullable|numeric|digits:13',
            'sk_nomenklatur'     => 'required|string',
            'pj_nama'            => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'pj_whatsapp'        => 'required|numeric|digits_between:10,15',
            'pj_whatsapp_otp'    => 'nullable',
            'pj_surel'           => 'required|email:rfc,dns',
            'dok_npwp'           => 'nullable|file|mimes:pdf|max:5120',
            'dok_nib'            => 'nullable|file|mimes:pdf|max:5120',
            'dok_sk_nomenklatur' => 'nullable|file|mimes:pdf|max:5120',
            'dok_lainnya'        => 'nullable|file|mimes:pdf,zip|max:5120',
        ]);

        $pelanggan = PelangganInstansi::where('pelanggan_id', $request->user()->pelanggan->id)->first();

        if (config('services.whatsapp.enabled') && ($pelanggan->pj_whatsapp != $input['pj_whatsapp'] || $pelanggan->pj_whatsapp_verified == Option::NO->value)) {
            if (empty($input['pj_whatsapp_otp'])) {
                throw new Exception('OTP tidak boleh kosong');
            }

            $otp = Cache::get($this->getCacheName($input['pj_whatsapp']));
            if ($otp != $input['pj_whatsapp_otp']) {
                throw new Exception('OTP tidak valid');
            }

            $pelanggan->pj_whatsapp_verified = Option::YES;
        }

        $provinsi = \DB::table('master_provinsi')->where('prov_id',$input['prov_id'])->first();
        $kabupaten = \DB::table('master_kabupaten')->where('kab_id',$input['kab_id'])->first();
        $kecamatan = \DB::table('master_kecamatan')->where('kec_id',$input['kec_id'])->first();

       $rawAlamat = $input['alamat'];
        if (str_contains($rawAlamat, ' KEC. ')) {
            $rawAlamat = explode(' KEC. ', $rawAlamat)[0];
        }

        $alamatLengkap = sprintf(
            "%s, KEC. %s, %s, PROV. %s",
            $rawAlamat, 
            $kecamatan->kec_nama,
            $kabupaten->kab_nama,
            $provinsi->prov_nama
        );

        $pelanggan->nama           = $input['nama'];
        $pelanggan->alamat         = $alamatLengkap;
        $pelanggan->pimpinan       = $input['pimpinan'];
        $pelanggan->telepon        = $input['telepon'];
        $pelanggan->fax            = $input['fax'];
        $pelanggan->surel          = $input['surel'];
        $pelanggan->whatsapp       = $input['whatsapp'];
        $pelanggan->npwp           = $input['npwp'];
        $pelanggan->nib            = $input['nib'];
        $pelanggan->sk_nomenklatur = $input['sk_nomenklatur'];
        $pelanggan->pj_nama        = $input['pj_nama'];
        $pelanggan->pj_whatsapp    = $input['pj_whatsapp'];
        $pelanggan->pj_surel       = $input['pj_surel'];
        $pelanggan->prov_id          = $input['prov_id'];
        $pelanggan->kab_id           = $input['kab_id'];
        $pelanggan->kec_id           = $input['kec_id'];

        $dokumen = [
            'dok_npwp'           => 'NPWP',
            'dok_nib'            => 'NIB',
            'dok_sk_nomenklatur' => 'SK Nomenklatur',
            'dok_lainnya'        => 'Dokumen Lainnya',
        ];

        return $this->saveAndUploadFileToStorage($dokumen, $request, $pelanggan);
    }

    /**
     * @throws Exception
     */
    private function updateProfileBadanUsaha(Request $request)
    {
        $input = $request->validate([
            'nama'               => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'alamat'             => 'required|string',
            'prov_id'            => 'required|exists:master_provinsi,prov_id',
            'kab_id'             => 'required|exists:master_kabupaten,kab_id',
            'kec_id'             => 'required|exists:master_kecamatan,kec_id',
            'badan_hukum'        => 'required|string',
            'jenis'              => 'required|string',
            'pemilik'            => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'pimpinan'           => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'telepon'            => 'required',
            'fax'                => 'required',
            'surel'              => 'required|email:rfc,dns',
            'whatsapp'           => 'required|numeric|digits_between:10,15',
            'npwp'               => 'required|numeric|digits:16',
            'nib'                => 'required|numeric|digits:13',
            'no_akta_pendirian'  => 'nullable|string',
            'iup'                => 'nullable|string',
            'pj_nama'            => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'pj_whatsapp'        => 'required|numeric|digits_between:10,15',
            'pj_whatsapp_otp'    => 'nullable',
            'pj_surel'           => 'required|email:rfc,dns',
            'dok_npwp'           => 'nullable|file|mimes:pdf|max:5120',
            'dok_nib'            => 'nullable|file|mimes:pdf|max:5120',
            'dok_akta_pendirian' => 'nullable|file|mimes:pdf|max:5120',
            'dok_iup'            => 'nullable|file|mimes:pdf|max:5120',
            'dok_lainnya'        => 'nullable|file|mimes:pdf,zip|max:5120',
        ]);

        $pelanggan = PelangganPerusahaan::where('pelanggan_id', $request->user()->pelanggan->id)->first();

        if (empty($pelanggan->dok_npwp) && !$request->hasFile('dok_npwp')) {
            throw new Exception('NPWP wajib diunggah.');
        }

        if (empty($pelanggan->dok_nib) && !$request->hasFile('dok_nib')) {
            throw new Exception('NIB wajib diunggah.');
        }

        if (config('services.whatsapp.enabled') && ($pelanggan->pj_whatsapp != $input['pj_whatsapp'] || $pelanggan->pj_whatsapp_verified == Option::NO->value)) {
            if (empty($input['pj_whatsapp_otp'])) {
                throw new Exception('OTP tidak boleh kosong');
            }

            $otp = Cache::get($this->getCacheName($input['pj_whatsapp']));
            if ($otp != $input['pj_whatsapp_otp']) {
                throw new Exception('OTP tidak valid');
            }

            $pelanggan->pj_whatsapp_verified = Option::YES;
        }


        $provinsi = \DB::table('master_provinsi')->where('prov_id',$input['prov_id'])->first();
        $kabupaten = \DB::table('master_kabupaten')->where('kab_id',$input['kab_id'])->first();
        $kecamatan = \DB::table('master_kecamatan')->where('kec_id',$input['kec_id'])->first();

       $rawAlamat = $input['alamat'];
        if (str_contains($rawAlamat, ' KEC. ')) {
            $rawAlamat = explode(' KEC. ', $rawAlamat)[0];
        }

        $alamatLengkap = sprintf(
            "%s, KEC. %s, %s, PROV. %s",
            $rawAlamat, 
            $kecamatan->kec_nama,
            $kabupaten->kab_nama,
            $provinsi->prov_nama
        );

        $pelanggan->nama              = $input['nama'];
        $pelanggan->alamat            = $alamatLengkap;
        $pelanggan->badan_hukum       = $input['badan_hukum'];
        $pelanggan->jenis             = $input['jenis'];
        $pelanggan->pemilik           = $input['pemilik'];
        $pelanggan->pimpinan          = $input['pimpinan'];
        $pelanggan->telepon           = $input['telepon'];
        $pelanggan->fax               = $input['fax'];
        $pelanggan->surel             = $input['surel'];
        $pelanggan->whatsapp          = $input['whatsapp'];
        $pelanggan->npwp              = $input['npwp'];
        $pelanggan->nib               = $input['nib'];
        $pelanggan->no_akta_pendirian = $input['no_akta_pendirian'] ?? null;
        $pelanggan->iup               = $input['iup'] ?? null;
        $pelanggan->pj_nama           = $input['pj_nama'];
        $pelanggan->pj_whatsapp       = $input['pj_whatsapp'];
        $pelanggan->pj_surel          = $input['pj_surel'];

        $pelanggan->prov_id          = $input['prov_id'];
        $pelanggan->kab_id           = $input['kab_id'];
        $pelanggan->kec_id           = $input['kec_id'];

        $dokumen = [
            'dok_npwp'           => 'NPWP',
            'dok_nib'            => 'NIB',
            'dok_akta_pendirian' => 'Akta Pendirian',
            'dok_iup'            => 'IUP',
            'dok_lainnya'        => 'Dokumen Lainnya',
        ];

        return $this->saveAndUploadFileToStorage($dokumen, $request, $pelanggan);
    }

    public function reqWhatsappOtp(Request $request)
    {
        $request->validate([
            'whatsapp'  => ['required', 'numeric', 'digits_between:10,15'],
            'recaptcha' => ['nullable'],
        ]);

        if (!$this->validateCaptcha($request->input('recaptcha'))) {
            return responseJSON('Captcha tidak valid.', [], 400);
        }

        // Send OTP to WhatsApp
        $otp = rand(100000, 999999);
        WhatsappService::sendMessage($request->whatsapp, "OTP anda: *$otp*. Kode ini bersifat rahasia dan aktif selama 5 menit")->sendInBackground();

        // cache 5 minutes OTP
        Cache::put($this->getCacheName($request->whatsapp), $otp, now()->addMinutes(5));

        return responseJSON(sprintf('OTP berhasil dikirim ke %s', $request->whatsapp));
    }

    private function getCacheName($waNumber)
    {
        return 'whatsapp_otp_update_profile_' . auth()->user()->id . $waNumber;
    }

    /**
     * @param array $dokumen
     * @param Request $request
     * @param mixed $pelanggan
     * @return mixed
     */
    private function saveAndUploadFileToStorage(array $dokumen, Request $request, mixed $pelanggan)
    {
        foreach ($dokumen as $key => $value) {
            if ($request->hasFile($key)) {
                // delete old file if exists
                if (!empty($pelanggan->$key)) {
                    Storage::disk('s3')->delete($pelanggan->$key);
                }

                $file            = $request->file($key);
                $path            = $file->store('pelanggan/' . $request->user()->id . '/dokumen', 's3');
                $pelanggan->$key = $path;
            }
        }

        $pelanggan->save();

        return $pelanggan;
    }
}
