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

    public function layanan()
    {
        $cacheKey = 'dashboard_layanan_list';

        $result = Cache::remember($cacheKey, 3600, function () {
            $layanan = \App\Models\Db2\MasterJenisLayanan::query()
                ->where('is_active', 1)
                ->orderBy('jenis_layanan')
                ->get();

            if ($layanan->isEmpty()) {
                return [
                    ['nama_layanan' => 'Pengujian & Kalibrasi Laboratorium', 'url' => '/permohonan'],
                    ['nama_layanan' => 'Sertifikasi Produk & Sistem (LSPro)', 'url' => '/permohonan/sertifikasi'],
                    ['nama_layanan' => 'Sertifikasi Profesi (LSP)', 'url' => '/permohonan/sertifikasi-profesi'],
                    ['nama_layanan' => 'Bimbingan Teknis & Pelatihan Industri', 'url' => '/permohonan/pelatihan'],
                ];
            }

            return $layanan->map(function ($item) {
                $url = match ($item->slug) {
                    'sertifikasi', 'sertifikasi-produk-sistem' => '/permohonan/sertifikasi',
                    'sertifikasi-profesi-lsp', 'lsp'           => '/permohonan/sertifikasi-profesi',
                    'pelatihan', 'bimtek'                     => '/permohonan/pelatihan',
                    default                                   => '/permohonan',
                };

                return [
                    'id'           => $item->id,
                    'nama_layanan' => $item->jenis_layanan,
                    'url'          => $url,
                ];
            })->toArray();
        });

        return responseJSON('Data Found', $result);
    }

    public function sidebarCounts()
    {
        $permohonanCount = \App\Models\Db2\Permohonan::query()
            ->whereIn('status_workflow', ['PERMOHONAN', 'IN_REVIEW', 'PEMBAYARAN', 'PROCESS', 'REVISI'])
            ->count();

        $pertanyaanCount = \App\Models\Db1\PertanyaanPelanggan::query()
            ->where('status', 'opened')
            ->count();

        return responseJSON('Counts Found', [
            'permohonan' => $permohonanCount,
            'pertanyaan' => $pertanyaanCount,
        ]);
    }
}

