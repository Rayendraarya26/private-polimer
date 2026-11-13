<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuPortalLayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Menu 'Portal Layanan Balai'
        $menu = DB::table('sys_menu')
            ->where('name', 'Portal Layanan Balai')
            ->first();

        $menuId = $menu?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $menuId],
            [
                'parent_id'  => null,
                'name'       => 'Portal Layanan Balai',
                'desc'       => 'Portal Permohonan Layanan BBKKP',
                'icon'       => 'fa-duotone fa-compass-drafting',
                'order'      => 98,
                'is_active'  => 'yes',
                'updated_at' => now(),
            ]
        );

        // 2. Action 'index'
        $controller = 'Modules\Eksternal\Http\Controllers\AppController@index';
        $action = DB::table('sys_menu_action')
            ->where('menu_id', $menuId)
            ->where('name', 'index')
            ->first();

        $actionId = $action?->id ?? (string) Str::uuid();

        DB::table('sys_menu_action')->updateOrInsert(
            ['id' => $actionId],
            [
                'menu_id'    => $menuId,
                'name'       => 'index',
                'controller' => $controller,
                'updated_at' => now(),
            ]
        );

        // 3. Hak akses HANYA untuk role Root dan Admin
        $targetGroupIds = [
            SysGroup::ROOT->value,
            SysGroup::ADMIN->value,
        ];

        // Hapus akses dari grup selain Root dan Admin jika sebelumnya ada
        DB::table('sys_group_permission')
            ->where('action_id', $actionId)
            ->whereNotIn('group_id', $targetGroupIds)
            ->delete();

        foreach ($targetGroupIds as $gId) {
            $hasGroup = DB::table('sys_group')->where('id', $gId)->exists();
            if ($hasGroup) {
                $hasPerm = DB::table('sys_group_permission')
                    ->where('group_id', $gId)
                    ->where('action_id', $actionId)
                    ->exists();

                if (!$hasPerm) {
                    DB::table('sys_group_permission')->insert([
                        'id'         => (string) Str::uuid(),
                        'group_id'   => $gId,
                        'action_id'  => $actionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}

