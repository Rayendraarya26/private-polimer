<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuMasterPengujianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cari parent menu 'Master Permohonan', atau fallback ke 'Permohonan'
        $parentMenu = DB::table('sys_menu')
            ->where('name', 'Master Permohonan')
            ->first();

        if (!$parentMenu) {
            $parentMenu = DB::table('sys_menu')
                ->where('name', 'Permohonan')
                ->whereNull('parent_id')
                ->first();
        }

        // 2. Cek atau buat menu Master Pengujian
        $menu = DB::table('sys_menu')
            ->where('name', 'Master Pengujian')
            ->first();

        $menuId = $menu?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $menuId],
            [
                'parent_id'  => $parentMenu?->id ?? null,
                'name'       => 'Master Pengujian',
                'desc'       => 'Manajemen data komoditas & parameter pengujian laboratorium',
                'icon'       => 'fa-duotone fa-vial',
                'order'      => 7,
                'is_active'  => 'yes',
                'updated_at' => now(),
            ]
        );

        // 3. Daftarkan action permission untuk MasterPengujianController
        $controller = 'Modules\Permohonan\Http\Controllers\MasterPengujianController';
        $actions = [
            'index'            => "{$controller}@index",
            'ajax'             => "{$controller}@ajax",
            'storeParameter'   => "{$controller}@storeParameter",
            'updateParameter'  => "{$controller}@updateParameter",
            'destroyParameter' => "{$controller}@destroyParameter",
            'storeKomoditas'   => "{$controller}@storeKomoditas",
            'updateKomoditas'  => "{$controller}@updateKomoditas",
            'destroyKomoditas' => "{$controller}@destroyKomoditas",
        ];

        // 4. Role group yang diberikan akses
        $targetGroups = [
            SysGroup::ROOT,
            SysGroup::ADMIN,
            SysGroup::PEGAWAI,
            SysGroup::MARKETING,
        ];

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
                    'menu_id'    => $menuId,
                    'name'       => $actionName,
                    'controller' => $controllerAction,
                    'updated_at' => now(),
                ]
            );

            foreach ($targetGroups as $groupEnum) {
                $groupId = $groupEnum->value;
                $hasGroup = DB::table('sys_group')->where('id', $groupId)->exists();

                if ($hasGroup) {
                    $hasPerm = DB::table('sys_group_permission')
                        ->where('group_id', $groupId)
                        ->where('action_id', $actionId)
                        ->first();

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

        $this->command->info("Menu Master Pengujian & permissions berhasil didaftarkan!");
    }
}
