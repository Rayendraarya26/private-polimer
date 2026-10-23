<?php

use App\Enums\SysGroup;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $parent = DB::table('sys_menu')
            ->where('name', 'Permohonan')
            ->whereNull('parent_id')
            ->first();

        if (!$parent) {
            return;
        }

        // 1. Cek atau Buat Menu "Produsen Bahan Acuan"
        $menu = DB::table('sys_menu')
            ->where('parent_id', $parent->id)
            ->where(function ($query) {
                $query->where('name', 'Produsen Bahan Acuan')
                    ->orWhere('name', 'Produsen Bahan Acuan (PBA)')
                    ->orWhere('name', 'PBA');
            })
            ->first();

        $menuId = $menu?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $menuId],
            [
                'parent_id'  => $parent->id,
                'name'       => 'Produsen Bahan Acuan',
                'desc'       => 'Formulir input dan pemesanan Produsen Bahan Acuan (PBA)',
                'icon'       => 'fa-duotone fa-flask',
                'is_active'  => 'yes',
                'order'      => 8,
                'updated_at' => now(),
            ]
        );

        // 2. Actions untuk PbaController
        $module = 'Modules\\Permohonan\\Http\\Controllers\\PbaController';
        $actions = [
            'index'  => $module . '@index',
            'create' => $module . '@create',
            'store'  => $module . '@store',
        ];

        $targetGroupIds = [
            SysGroup::MARKETING->value,
            SysGroup::ADMIN->value,
            SysGroup::ROOT->value,
        ];

        $groups = DB::table('sys_group')
            ->whereIn('id', $targetGroupIds)
            ->orWhereIn('name', ['Marketing', 'Admin', 'Root'])
            ->get();

        foreach ($actions as $actName => $controllerAction) {
            $existing = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('name', $actName)
                ->first();

            $actId = $existing?->id ?? (string) Str::uuid();

            DB::table('sys_menu_action')->updateOrInsert(
                ['id' => $actId],
                [
                    'menu_id'    => $menuId,
                    'name'       => $actName,
                    'controller' => $controllerAction,
                    'updated_at' => now(),
                ]
            );

            foreach ($groups as $group) {
                $hasPerm = DB::table('sys_group_permission')
                    ->where('group_id', $group->id)
                    ->where('action_id', $actId)
                    ->exists();

                if (!$hasPerm) {
                    DB::table('sys_group_permission')->insert([
                        'id'         => (string) Str::uuid(),
                        'group_id'   => $group->id,
                        'action_id'  => $actId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tetap pertahankan rollback aman
        DB::table('sys_menu')
            ->where('name', 'Produsen Bahan Acuan')
            ->update([
                'name' => 'Produsen Bahan Acuan (PBA)',
            ]);
    }
};
