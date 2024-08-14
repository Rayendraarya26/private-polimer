<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganInstansi;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\PelangganPerusahaan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'user_' . $request->user()->id;

        return Cache::remember($cacheKey, 5 * 60, function () use ($request) {
            // selected Group
            $groupData = $request->user()->sys_user_groups->where('is_default', 'yes')->first();

            $isPelanggan = $groupData->group_id === SysGroup::PELANGGAN->value;

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
                'detail'                => $isPelanggan ? $this->extractDetailPelanggan($request->user()->pelanggan) : null,
            ]);
        });
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
            'old_password' => 'required',
            'new_password' => 'required|confirmed|min:8|different:old_password',
        ]);

        $user = $request->user();

        if (!password_verify($request->old_password, $user->password)) {
            return responseJSON('error', 'Password lama tidak sesuai.', 400);
        }

        $user->password              = bcrypt($request->new_password);
        $user->force_update_password = false;
        $user->save();

        return responseJSON('success', 'Password berhasil diubah.');
    }

    public function updateProfile(Request $request)
    {
        return match ($request->user()->pelanggan->jenis_pelanggan) {
            PelangganJenisPelanggan::PERORANGAN->value => $this->updateProfilePerorangan($request),
            PelangganJenisPelanggan::INSTANSI_PEMERINTAH->value => $this->updateProfileInstansi($request),
            PelangganJenisPelanggan::BADAN_USAHA->value => $this->updateProfileBadanUsaha($request),
            default => responseJSON('error', 'Jenis pelanggan tidak dikenal.', 400),
        };
    }

    private function updateProfilePerorangan(Request $request): JsonResponse
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
            'whatsapp'            => 'required|numeric|digits_between:10,15|regex:/^62[0-9]*$/',
            'pendidikan_terakhir' => 'required|string',
            'npwp'                => 'required|numeric|digits:16',
            'nib'                 => 'nullable|numeric|digits:13',
            'dok_npwp'            => 'required|file|mimes:pdf|max:5120',
            'dok_nib'             => 'nullable|file|mimes:pdf|max:5120',
            'dok_lainnya'         => 'nullable|file|mimes:pdf,zip|max:5120',
        ]);

        $pelanggan                      = PelangganPerorangan::where('pelanggan_id', $request->user()->pelanggan->id)->first();
        $pelanggan->nama                = $input['nama'];
        $pelanggan->alamat              = $input['alamat'];
        $pelanggan->tempat_lahir        = $input['tempat_lahir'];
        $pelanggan->tanggal_lahir       = $input['tanggal_lahir'];
        $pelanggan->jenis_kelamin       = $input['jenis_kelamin'];
        $pelanggan->kewarganegaraan     = $input['kewarganegaraan'];
        $pelanggan->nik                 = $input['nik'];
        $pelanggan->surel               = $input['surel'];
        $pelanggan->whatsapp            = $input['whatsapp'];
        $pelanggan->pendidikan_terakhir = $input['pendidikan_terakhir'];
        $pelanggan->npwp                = $input['npwp'];
        $pelanggan->nib                 = $input['nib'];

        $dokumen = [
            'dok_npwp'    => 'NPWP',
            'dok_nib'     => 'NIB',
            'dok_lainnya' => 'Dokumen Lainnya',
        ];

        foreach ($dokumen as $key => $value) {
            if ($request->hasFile($key)) {
                $file            = $request->file($key);
                $path            = $file->store('pelanggan/' . $request->user()->id . '/dokumen', 's3');
                $pelanggan->$key = $path;
            }
        }

        $pelanggan->save();

        return responseJSON('success', 'Profil berhasil diperbarui.');
    }

    private function updateProfileInstansi(Request $request)
    {
        $input = $request->validate([
            'nama'               => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'alamat'             => 'required|string',
            'pimpinan'           => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'telepon'            => 'required',
            'fax'                => 'required',
            'surel'              => 'required|email:rfc,dns',
            'whatsapp'           => 'required|numeric|digits_between:10,15|regex:/^62[0-9]*$/',
            'npwp'               => 'required|numeric|digits:16',
            'nib'                => 'nullable|numeric|digits:13',
            'sk_nomenklatur'     => 'required|string',
            'pj_nama'            => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'pj_whatsapp'        => 'required|numeric|digits_between:10,15|regex:/^62[0-9]*$/',
            'pj_surel'           => 'required|email:rfc,dns',
            'dok_npwp'           => 'nullable|file|mimes:pdf|max:5120',
            'dok_nib'            => 'nullable|file|mimes:pdf|max:5120',
            'dok_sk_nomenklatur' => 'nullable|file|mimes:pdf|max:5120',
            'dok_lainnya'        => 'nullable|file|mimes:pdf,zip|max:5120',
        ]);

        $pelanggan                 = PelangganInstansi::where('pelanggan_id', $request->user()->pelanggan->id)->first();
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

        foreach ($dokumen as $key => $value) {
            if ($request->hasFile($key)) {
                $file            = $request->file($key);
                $path            = $file->store('pelanggan/' . $request->user()->id . '/dokumen', 's3');
                $pelanggan->$key = $path;
            }
        }

        $pelanggan->save();

        return responseJSON('success', 'Profil berhasil diperbarui.');
    }

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
            'whatsapp'           => 'required|numeric|digits_between:10,15|regex:/^62[0-9]*$/',
            'npwp'               => 'required|numeric|digits:16',
            'nib'                => 'required|numeric|digits:13',
            'no_akta_pendirian'  => 'nullable|string',
            'iup'                => 'nullable|string',
            'pj_nama'            => 'required|string|max:255|regex:/^[a-zA-Z\s]*$/',
            'pj_whatsapp'        => 'required|numeric|digits_between:10,15|regex:/^62[0-9]*$/',
            'pj_surel'           => 'required|email:rfc,dns',
            'dok_npwp'           => 'required|file|mimes:pdf|max:5120',
            'dok_nib'            => 'required|file|mimes:pdf|max:5120',
            'dok_akta_pendirian' => 'nullable|file|mimes:pdf|max:5120',
            'dok_iup'            => 'nullable|file|mimes:pdf|max:5120',
            'dok_lainnya'        => 'nullable|file|mimes:pdf,zip|max:5120',
        ]);

        $pelanggan                    = PelangganPerusahaan::where('pelanggan_id', $request->user()->pelanggan->id)->first();
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
        $pelanggan->no_akta_pendirian = $input['no_akta_pendirian'];
        $pelanggan->iup               = $input['iup'];
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

        foreach ($dokumen as $key => $value) {
            if ($request->hasFile($key)) {
                $file            = $request->file($key);
                $path            = $file->store('pelanggan/' . $request->user()->id . '/dokumen', 's3');
                $pelanggan->$key = $path;
            }
        }

        $pelanggan->save();

        return responseJSON('success', 'Profil berhasil diperbarui.');
    }
}
