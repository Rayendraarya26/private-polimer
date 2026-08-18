<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Db1\OauthClient;
use App\Models\Db1\SettingBanner;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function slider()
    {
        $slider = SettingBanner::query()->where('is_active', 1)
            ->where(function ($query) {
                $query->where('start_at', '<=', date('Y-m-d'))
                    ->orWhereNull('start_at');
            })
            ->where(function ($query) {
                $query->where('end_at', '>=', date('Y-m-d'))
                    ->orWhereNull('end_at');
            })
            ->orderBy('order')
            ->get();

        return responseJSON('Data Found', $slider->map(function ($item) {
            return [
                'description' => $item->description,
                'order'       => $item->order,
                'url'         => $item->link,
                'image'       => Storage::disk('s3')->temporaryUrl($item->image_path, now()->addHour()),
            ];
        }));
    }

    public function ssoHub()
    {
        $listSso = OauthClient::query()
            ->orderBy('name')
            ->where('revoked', 0)
            ->get();

        $apps = $listSso->map(function ($item) {
            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'name_full'     => $item->name_full,
                'url'           => $item->login_url,
                'accessibility' => $item->accessibility,
            ];
        })->toArray();

        // Tambahkan PNBP Monitoring Capaian
        $apps[] = [
            'id'            => 'pnbp',
            'name'          => 'PNBP',
            'name_full'     => 'Monitoring Capaian PNBP',
            'url'           => 'https://lookerstudio.google.com/u/0/reporting/413af404-7305-44e6-9914-b3d2ef0e0ab7/page/JAy8D',
            'accessibility' => 'private',
        ];

        return responseJSON('Data Found', $apps);
    }
}
