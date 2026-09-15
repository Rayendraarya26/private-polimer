<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuSuratTagihanBiayaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cari parent menu 'Management Permohonan'
        $parentMenu = DB::table('sys_menu')
            ->where('name', 'like', '%Permohonan%')
            ->whereNull('parent_id')
            ->first();

        // 2. Cek apakah menu Tagihan Biaya sudah ada
        $menu = DB::table('sys_menu')
            ->where('name', 'Tagihan Biaya')
            ->orWhere('name', 'Surat Tagihan Biaya')
            ->first();

        $menuId = $menu?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $menuId],
            [
                'parent_id'  => $parentMenu?->id ?? null,
                'name'       => 'Surat Tagihan Biaya',
                'desc'       => 'Menu membuat penawaran tagihan harga sertifikasi',
                'icon'       => 'fa-duotone fa-file-invoice-dollar',
                'order'      => 5,
                'is_active'  => 'yes',
                'updated_at' => now(),
            ]
        );

        // 3. Daftarkan action permission untuk semua action TagihanBiayaController
        $actions = [
            'index' => 'Modules\Permohonan\Http\Controllers\TagihanBiayaController@index',
            'ajax'  => 'Modules\Permohonan\Http\Controllers\TagihanBiayaController@ajax',
            'edit'  => 'Modules\Permohonan\Http\Controllers\TagihanBiayaController@edit',
            'kirim' => 'Modules\Permohonan\Http\Controllers\TagihanBiayaController@kirim',
        ];

        // 4. Berikan akses ke group role Marketing dan Admin
        $groups = DB::table('sys_group')
            ->where('name', 'like', '%Marketing%')
            ->orWhere('name', 'like', '%Admin%')
            ->get();

        foreach ($actions as $actionName => $controllerAction) {
            $existingAction = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('controller', $controllerAction)
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

            foreach ($groups as $g) {
                DB::table('sys_group_permission')->updateOrInsert(
                    [
                        'group_id'  => $g->id,
                        'action_id' => $actionId,
                    ],
                    [
                        'id'         => (string) Str::uuid(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}