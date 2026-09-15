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
        $menuId = 'a2b5a915-5fe1-4e55-9d1a-3fff7ade3529'; // Menu: Billing Pembayaran

        // 1. Actions to ensure in sys_menu_action
        $actions = [
            'index' => 'Modules\Permohonan\Http\Controllers\BillingPembayaranController@index',
            'create' => 'Modules\Permohonan\Http\Controllers\BillingPembayaranController@create',
            'store' => 'Modules\Permohonan\Http\Controllers\BillingPembayaranController@store',
        ];

        $actionIds = [];

        foreach ($actions as $name => $controller) {
            $existing = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('controller', $controller)
                ->first();

            if (!$existing) {
                $id = (string) Str::uuid();
                DB::table('sys_menu_action')->insert([
                    'id' => $id,
                    'menu_id' => $menuId,
                    'name' => $name,
                    'controller' => $controller,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $actionIds[] = $id;
            } else {
                $actionIds[] = $existing->id;
            }
        }

        // 2. Groups to grant permission
        $targetGroupNames = ['Bendahara', 'Admin', 'Root'];
        $groups = DB::table('sys_group')->whereIn('name', $targetGroupNames)->get();

        foreach ($groups as $group) {
            foreach ($actionIds as $actionId) {
                $hasPerm = DB::table('sys_group_permission')
                    ->where('group_id', $group->id)
                    ->where('action_id', $actionId)
                    ->exists();

                if (!$hasPerm) {
                    DB::table('sys_group_permission')->insert([
                        'id' => (string) Str::uuid(),
                        'group_id' => $group->id,
                        'action_id' => $actionId,
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
        $action = DB::table('sys_menu_action')
            ->where('controller', 'Modules\Permohonan\Http\Controllers\BillingPembayaranController@store')
            ->first();

        if ($action) {
            DB::table('sys_group_permission')->where('action_id', $action->id)->delete();
            DB::table('sys_menu_action')->where('id', $action->id)->delete();
        }
    }
};
