<?php

namespace Modules\Eksternal\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Enums\SysGroup;
use App\Models\Db1\MasterTopikPertanyaan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;

class PertanyaanController extends Controller
{
    private string $module = __CLASS__;
    private string $url = '/pertanyaan';
    private string $view = 'eksternal::pertanyaan';

    public function listTopic()
    {
        $parser = [
            'listLayanan' => MasterTopikPertanyaan::query()->get(),
        ];
		
		return responseJSON("Success", [
            'data'   => MasterTopikPertanyaan::query()->get()
        ]);
    }
	
	public function listPertanyaan(Request $request)
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
}
