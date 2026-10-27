<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuMasterKalibrasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cari parent menu 'Permohonan'
        $parentMenu = DB::table('sys_menu')
            ->where('name', 'Permohonan')
            ->whereNull('parent_id')
            ->first();

        // 2. Cek apakah menu Master Kalibrasi sudah ada
        $menu = DB::table('sys_menu')
            ->where('name', 'Master Kalibrasi')
            ->first();

        $menuId = $menu?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $menuId],
            [
                'parent_id' => $parentMenu?->id ?? null,
                'name' => 'Master Kalibrasi',
                'desc' => 'Manajemen data tarif & instrumen master kalibrasi',
                'icon' => 'fa-duotone fa-ruler-combined',
                'order' => 6,
                'is_active' => 'yes',
                'updated_at' => now(),
            ]
        );

        // 3. Daftarkan action permission untuk MasterKalibrasiController
        $controller = 'Modules\Permohonan\Http\Controllers\MasterKalibrasiController';
        $actions = [
            'index' => "{$controller}@index",
            'ajax' => "{$controller}@ajax",
            'store' => "{$controller}@store",
            'update' => "{$controller}@update",
            'destroy' => "{$controller}@destroy",
        ];

        // 4. Role group yang diberikan akses: Root, Admin, Pegawai, dan Marketing
        $targetGroups = [
            SysGroup::ROOT,
            SysGroup::ADMIN,
            SysGroup::PEGAWAI,
            SysGroup::MARKETING,
        ];

        // Pastikan parent menu action permohonan aktif untuk target groups
        if ($parentMenu) {
            $parentAction = DB::table('sys_menu_action')
                ->where('menu_id', $parentMenu->id)
                ->where('name', 'index')
                ->first();

            if ($parentAction) {
                foreach ($targetGroups as $groupId) {
                    $hasGroup = DB::table('sys_group')->where('id', $groupId)->exists();
                    if ($hasGroup) {
                        $existingGroupPerm = DB::table('sys_group_permission')
                            ->where('group_id', $groupId)
                            ->where('action_id', $parentAction->id)
                            ->first();

                        if (!$existingGroupPerm) {
                            DB::table('sys_group_permission')->insert([
                                'id' => (string) Str::uuid(),
                                'group_id' => $groupId,
                                'action_id' => $parentAction->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }

        // 5. Daftarkan setiap action ke sys_menu_action dan sys_group_permission
        foreach ($actions as $actionName => $controllerAction) {
            $existingAction = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('name', $actionName)
                ->first();

            $actionId = $existingAction?->id ?? (string) Str::uuid();

            DB::table('sys_menu_action')->updateOrInsert(
                ['id' => $actionId],
                [
                    'menu_id' => $menuId,
                    'name' => $actionName,
                    'controller' => $controllerAction,
                    'updated_at' => now(),
                ]
            );

            foreach ($targetGroups as $groupId) {
                $hasGroup = DB::table('sys_group')->where('id', $groupId)->exists();
                if ($hasGroup) {
                    $existingPermission = DB::table('sys_group_permission')
                        ->where('group_id', $groupId)
                        ->where('action_id', $actionId)
                        ->first();

                    if (!$existingPermission) {
                        DB::table('sys_group_permission')->insert([
                            'id' => (string) Str::uuid(),
                            'group_id' => $groupId,
                            'action_id' => $actionId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}
