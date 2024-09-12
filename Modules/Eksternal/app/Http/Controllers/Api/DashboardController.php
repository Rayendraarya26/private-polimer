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

    public function layanan()
    {
        $listSso = OauthClient::query()
            ->orderBy('name')
            ->where('revoked', 0)
            ->where('display', 1)
            ->where('accessibility', 'public')
            ->get();

        return responseJSON('Data Found', $listSso->map(function ($item) {
            return [
                'nama_layanan' => $item->name_full,
                'url'          => $item->login_url,
            ];
        }));
    }
}
