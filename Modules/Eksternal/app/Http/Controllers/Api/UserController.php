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
        $cacheKey = 'user_' . $request->user()->id;

        return Cache::remember($cacheKey, 5 * 60, function () use ($request) {
            // selected Group
            $groupData = $request->user()->sys_user_groups->where('is_default', 'yes')->first();

            $isPelanggan = $groupData->group_id === SysGroup::PELANGGAN->value;
            $detail = $isPelanggan ? $this->extractDetailPelanggan($request->user()->pelanggan) : $this->extractDetailPegawai($request->user()->pegawai ?? Pegawai::create(['user_id' => $request->user()->id]));

            return responseJSON("success", [
                'id'                    => $request->user()->id,
                'name'                  => $request->user()->name,
                'email'                 => $request->user()->email,
                'nip'                   => $request->user()->nip,
                'force_update_password' => $request->user()->force_update_password,
                'picture'               => Storage::disk('s3')->temporaryUrl($request->user()->picture, now()->addWeek()),
                'last_login'            => $request->user()->last_login,
                'group'                 => [
                    'id'   => $groupData->group_id,
                    'name' => $groupData->sys_group->name,
                ],
                'detail'                => $detail,
            ]);
        });
    }

    private function extractDetailPegawai(Pegawai $pegawai)
    {
        return [
            'nik'      => $pegawai->nik,
            'whatsapp' => $pegawai->whatsapp,
        ];
    }

    private function extractDetailPelanggan(Pelanggan $pelanggan)
    {
        $detail = [
            'type' => $pelanggan->jenis_pelanggan,
        ];

        $d      = $pelanggan->detail->toArray();
        $detail = array_merge($detail, $d);
        Arr::forget($detail, ['id', 'pelanggan_id', 'created_at', 'updated_at']);

        $documents = [
            'dok_npwp',
            'dok_nib',
            'dok_lainnya'
        ];

        // Add document types based on pelanggan type
        switch (PelangganJenisPelanggan::tryFrom($pelanggan->jenis_pelanggan)) {
            case PelangganJenisPelanggan::PERORANGAN:
            case PelangganJenisPelanggan::INSTANSI_PEMERINTAH:
                $documents = array_merge($documents, ['dok_sk_nomenklatur']);
                break;
            case PelangganJenisPelanggan::BADAN_USAHA:
                $documents = array_merge($documents, ['dok_akta_pendirian', 'dok_iup']);
                break;
        }

        // Generate temporary URLs for documents
        foreach ($documents as $document) {
            if (!empty($d[$document])) {
                $detail[$document] = Storage::disk('s3')->temporaryUrl($d[$document], now()->addWeek());
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
            match ($request->user()->pelanggan->jenis_pelanggan) {
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

        $pelanggan->nama                = $input['nama'];
        $pelanggan->alamat              = $input['alamat'];
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

        $pelanggan->nama           = $input['nama'];
        $pelanggan->alamat         = $input['alamat'];
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

        $pelanggan->nama              = $input['nama'];
        $pelanggan->alamat            = $input['alamat'];
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
