<?php

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

        // 1. Cek atau Buat Menu "Pencatatan Jasa Lainnya"
        $menu = DB::table('sys_menu')
            ->where('parent_id', $parent->id)
            ->where('name', 'Pencatatan Jasa Lainnya')
            ->first();

        if (!$menu) {
            $menuId = (string) Str::uuid();
            DB::table('sys_menu')->insert([
                'id' => $menuId,
                'parent_id' => $parent->id,
                'name' => 'Pencatatan Jasa Lainnya',
                'desc' => 'Pencatatan pendapatan jasa lainnya non-layanan utama (Bendahara)',
                'icon' => 'fa-duotone fa-hand-holding-dollar',
                'is_active' => 'yes',
                'order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $menuId = $menu->id;
        }

        // 2. Actions untuk JasaLainnyaController
        $module = 'Modules\\Permohonan\\Http\\Controllers\\JasaLainnyaController';
        $actions = [
            'index'   => $module . '@index',
            'ajax'    => $module . '@ajax',
            'create'  => $module . '@create',
            'store'   => $module . '@store',
            'show'    => $module . '@show',
            'edit'    => $module . '@edit',
            'update'  => $module . '@update',
            'destroy' => $module . '@destroy',
        ];

        $actionIds = [];

        foreach ($actions as $actName => $controllerAction) {
            $existing = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('controller', $controllerAction)
                ->first();

            if (!$existing) {
                $actId = (string) Str::uuid();
                DB::table('sys_menu_action')->insert([
                    'id' => $actId,
                    'menu_id' => $menuId,
                    'name' => $actName,
                    'controller' => $controllerAction,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $actionIds[] = $actId;
            } else {
                $actionIds[] = $existing->id;
            }
        }

        // 3. Berikan permission ke group Bendahara & Root
        $targetGroupNames = ['Bendahara', 'Root'];
        $groups = DB::table('sys_group')->whereIn('name', $targetGroupNames)->get();

        foreach ($groups as $group) {
            foreach ($actionIds as $actId) {
                $hasPerm = DB::table('sys_group_permission')
                    ->where('group_id', $group->id)
                    ->where('action_id', $actId)
                    ->exists();

                if (!$hasPerm) {
                    DB::table('sys_group_permission')->insert([
                        'id' => (string) Str::uuid(),
                        'group_id' => $group->id,
                        'action_id' => $actId,
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
        $actions = DB::table('sys_menu_action')
            ->where('controller', 'LIKE', 'Modules\\Permohonan\\Http\\Controllers\\JasaLainnyaController%')
            ->get();

        foreach ($actions as $action) {
            DB::table('sys_group_permission')->where('action_id', $action->id)->delete();
            DB::table('sys_menu_action')->where('id', $action->id)->delete();
        }

        DB::table('sys_menu')->where('name', 'Pencatatan Jasa Lainnya')->delete();
    }
};
