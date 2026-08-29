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
                SysGroup::ADMIN->value,   // ← pakai ADMIN, bukan PEGAWAI
            ])
            ->pluck('user_id')
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
}
