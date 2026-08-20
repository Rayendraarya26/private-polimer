<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Db1\OauthClient;
use App\Models\Db1\SettingBanner;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function slider()
    {
        $today = date('Y-m-d');
        $cacheKey = "dashboard_slider_active_{$today}";

        $result = Cache::remember($cacheKey, 3600, function () use ($today) {
            $slider = SettingBanner::query()->where('is_active', 1)
                ->where(function ($query) use ($today) {
                    $query->where('start_at', '<=', $today)
                        ->orWhereNull('start_at');
                })
                ->where(function ($query) use ($today) {
                    $query->where('end_at', '>=', $today)
                        ->orWhereNull('end_at');
                })
                ->orderBy('order')
                ->get();

            return $slider->map(function ($item) {
                $imageUrl = null;
                if (!empty($item->image_path)) {
                    try {
                        $imageUrl = Storage::disk('s3')->temporaryUrl($item->image_path, now()->addHour());
                    } catch (\Throwable $e) {
                        $imageUrl = asset('storage/' . $item->image_path);
                    }
                }

                return [
                    'description' => $item->description,
                    'order'       => $item->order,
                    'url'         => $item->link,
                    'image'       => $imageUrl,
                ];
            })->toArray();
        });

        return responseJSON('Data Found', $result);
    }

    public function ssoHub()
    {
        $cacheKey = 'dashboard_sso_hub_list';

        $apps = Cache::remember($cacheKey, 3600, function () {
            $listSso = OauthClient::query()
                ->orderBy('name')
                ->where('revoked', 0)
                ->get();

            $items = $listSso->map(function ($item) {
                return [
                    'id'            => $item->id,
                    'name'          => $item->name,
                    'name_full'     => $item->name_full,
                    'url'           => $item->login_url,
                    'accessibility' => $item->accessibility,
                ];
            })->toArray();

            // Tambahkan PNBP Monitoring Capaian
            $items[] = [
                'id'            => 'pnbp',
                'name'          => 'PNBP',
                'name_full'     => 'Monitoring Capaian PNBP',
                'url'           => 'https://lookerstudio.google.com/u/0/reporting/413af404-7305-44e6-9914-b3d2ef0e0ab7/page/JAy8D',
                'accessibility' => 'private',
            ];

            return $items;
        });

        return responseJSON('Data Found', $apps);
    }
}
