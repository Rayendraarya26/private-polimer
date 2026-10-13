<?php


namespace App\Helpers;


use App\Models\Db1\SysUserNotif;
use App\Models\Db1\SysUserGroup;
use App\Enums\SysGroup;


class NotifHelper
{
    public static function getAdminUserIds(): array
    {
        return SysUserGroup::whereIn('group_id', [
                SysGroup::ROOT->value,
                SysGroup::ADMIN->value,
                SysGroup::MARKETING->value,
                SysGroup::PEGAWAI->value,
            ])
            ->pluck('user_id')
            ->unique()
            ->values()
            ->toArray();
    }


    public static function notify(string $userId, string $title, string $content, string $link): void
    {
        SysUserNotif::create([
            'user_id' => $userId,
            'title'   => $title,
            'content' => $content,
            'link'    => $link,
            'is_read' => 'no',
        ]);
    }

    public static function notifyMany(array $userIds, string $title, string $content, string $link): void
    {
        foreach ($userIds as $uid) {
            SysUserNotif::create([
                'user_id' => $uid,
                'title'   => $title,
                'content' => $content,
                'link'    => $link,
                'is_read' => 'no',
            ]);
        }
    }

    public static function customerPermohonanDetailUrl(int|string $permohonanId): string
    {
        return url('/app/#/permohonan/detail/' . $permohonanId);
    }

    public static function customerPembayaranUrl(): string
    {
        return url('/app/#/pembayaran');
    }

    public static function customerPermohonanListUrl(): string
    {
        return url('/app/#/permohonan');
    }

    public static function resolveCustomerUrl(?string $url): string
    {
        if (empty($url)) {
            return url('/app/#/dashboard');
        }

        // Jika sudah mengarah ke rute HashRouter portal pelanggan, pertahankan
        if (str_contains($url, '/app/#/')) {
            return $url;
        }

        // Tangani link detail permohonan admin: /permohonan/layanan/{id}/detail atau /permohonan/layanan/{id}
        if (preg_match('#/permohonan/layanan/(\d+)(/detail)?#', $url, $matches)) {
            return url('/app/#/permohonan/detail/' . $matches[1]);
        }

        // Tangani link daftar permohonan admin: /permohonan/layanan
        if (str_contains($url, '/permohonan/layanan')) {
            return url('/app/#/permohonan');
        }

        // Tangani link tagihan / invoice / pembayaran
        if (str_contains($url, 'tagihan') || str_contains($url, 'invoice') || str_contains($url, 'pembayaran')) {
            return url('/app/#/pembayaran');
        }

        return $url;
    }
}
