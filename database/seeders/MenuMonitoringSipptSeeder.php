<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuMonitoringSipptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cari parent menu 'System'
        $parent = DB::table('sys_menu')
            ->where('name', 'System')
            ->whereNull('parent_id')
            ->first();

        // 2. Cek apakah menu sudah ada
        $menu = DB::table('sys_menu')
            ->where('name', 'Monitoring Integrasi SIPPT')
            ->first();

        $menuId = $menu?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $menuId],
            [
                'parent_id'  => $parent?->id ?? null,
                'name'       => 'Monitoring Integrasi SIPPT',
                'desc'       => 'Monitoring integrasi data dan log pengiriman ke SIPPT BSKJI',
                'icon'       => 'fa-duotone fa-network-wired',
                'order'      => 5,
                'is_active'  => 'yes',
                'updated_at' => now(),
            ]
        );

        // 3. Actions untuk SipptAdminController
        $controller = 'Modules\Integration\Http\Controllers\SipptAdminController';
        $actions = [
            'index'          => "{$controller}@index",
            'detail'         => "{$controller}@detail",
            'retry'          => "{$controller}@retry",
            'retryAll'       => "{$controller}@retryAll",
            'proyeksi'       => "{$controller}@proyeksiForm",
            'proyeksiSubmit' => "{$controller}@proyeksiSubmit",
        ];

        // 4. Hak akses untuk role Root
        $targetGroupIds = [
            SysGroup::ROOT->value,
            SysGroup::ADMIN->value,
        ];

        // Pastikan parent menu 'System' aktif untuk Root
        if ($parent) {
            $parentAction = DB::table('sys_menu_action')
                ->where('menu_id', $parent->id)
                ->where('name', 'index')
                ->first();

            if ($parentAction) {
                foreach ($targetGroupIds as $gId) {
                    if (DB::table('sys_group')->where('id', $gId)->exists()) {
                        DB::table('sys_group_permission')->updateOrInsert(
                            ['group_id' => $gId, 'action_id' => $parentAction->id],
                            ['id' => (string) Str::uuid(), 'updated_at' => now()]
                        );
                    }
                }
            }
        }

        foreach ($actions as $actName => $ctrlAction) {
            $existing = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('name', $actName)
                ->first();

            $actionId = $existing?->id ?? (string) Str::uuid();

            DB::table('sys_menu_action')->updateOrInsert(
                ['id' => $actionId],
                [
                    'menu_id'    => $menuId,
                    'name'       => $actName,
                    'controller' => $ctrlAction,
                    'updated_at' => now(),
                ]
            );

            foreach ($targetGroupIds as $gId) {
                if (DB::table('sys_group')->where('id', $gId)->exists()) {
                    DB::table('sys_group_permission')->updateOrInsert(
                        ['group_id' => $gId, 'action_id' => $actionId],
                        ['id' => (string) Str::uuid(), 'updated_at' => now()]
                    );
                }
            }
        }
    }
}

