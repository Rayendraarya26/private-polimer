<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuMasterSertifikasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cari parent menu 'Master Permohonan' atau fallback ke 'Permohonan'
        $parentMenu = DB::table('sys_menu')
            ->where('name', 'Master Permohonan')
            ->first();

        if (!$parentMenu) {
            $parentMenu = DB::table('sys_menu')
                ->where('name', 'Permohonan')
                ->whereNull('parent_id')
                ->first();
        }

        // 2. Cek atau buat menu 'Master Sertifikasi'
        $menu = DB::table('sys_menu')
            ->where('name', 'Master Sertifikasi')
            ->first();

        $menuId = $menu?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $menuId],
            [
                'parent_id'  => $parentMenu?->id ?? null,
                'name'       => 'Master Sertifikasi',
                'desc'       => 'Manajemen data ruang lingkup & komoditas sertifikasi industri',
                'icon'       => 'fa-duotone fa-certificate',
                'order'      => 8,
                'is_active'  => 'yes',
                'updated_at' => now(),
            ]
        );

        // 3. Daftarkan action permission untuk MasterSertifikasiController
        $controller = 'Modules\Permohonan\Http\Controllers\MasterSertifikasiController';
        $actions = [
            'index' => "{$controller}@index",
            'ajax'  => "{$controller}@ajax",
        ];

        // 4. Role group yang diberikan akses: Developer (Root) & Marketing
        $targetGroups = [
            SysGroup::ROOT->value,      // Developer / Superadmin
            SysGroup::MARKETING->value, // Tim Pemasaran & Verifikasi
            SysGroup::ADMIN->value,     // Admin sistem
        ];

        // Pastikan parent menu action memiliki izin untuk target groups
        if ($parentMenu) {
            $parentAction = DB::table('sys_menu_action')
                ->where('menu_id', $parentMenu->id)
                ->where('name', 'index')
                ->first();

            if ($parentAction) {
                foreach ($targetGroups as $groupId) {
                    $hasGroup = DB::table('sys_group')->where('id', $groupId)->exists();
                    if ($hasGroup) {
                        $hasPerm = DB::table('sys_group_permission')
                            ->where('group_id', $groupId)
                            ->where('action_id', $parentAction->id)
                            ->exists();

                        if (!$hasPerm) {
                            DB::table('sys_group_permission')->insert([
                                'id'         => (string) Str::uuid(),
                                'group_id'   => $groupId,
                                'action_id'  => $parentAction->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }

        // 5. Daftarkan setiap action ke sys_menu_action dan assign ke sys_group_permission
        foreach ($actions as $actionName => $controllerAction) {
            $existingAction = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('name', $actionName)
                ->first();

            $actionId = $existingAction?->id ?? (string) Str::uuid();

            DB::table('sys_menu_action')->updateOrInsert(
                ['id' => $actionId],
                [
                    'menu_id'    => $menuId,
                    'name'       => $actionName,
                    'controller' => $controllerAction,
                    'updated_at' => now(),
                ]
            );

            foreach ($targetGroups as $groupId) {
                $hasGroup = DB::table('sys_group')->where('id', $groupId)->exists();
                if ($hasGroup) {
                    $hasPerm = DB::table('sys_group_permission')
                        ->where('group_id', $groupId)
                        ->where('action_id', $actionId)
                        ->exists();

                    if (!$hasPerm) {
                        DB::table('sys_group_permission')->insert([
                            'id'         => (string) Str::uuid(),
                            'group_id'   => $groupId,
                            'action_id'  => $actionId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}

