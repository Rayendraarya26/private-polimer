<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Http\Controllers\Controller;
use App\Models\Db1\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function user(Request $request)
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
}
