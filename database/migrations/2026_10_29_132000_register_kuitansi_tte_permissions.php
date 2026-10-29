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
        $menu = DB::table('sys_menu')->where('name', 'Data Permohonan Layanan')->first();
        if (!$menu) {
            return;
        }

        $menuId = $menu->id;
        $module = 'Modules\\Permohonan\\Http\\Controllers\\InvoiceController';

        $actions = [
            'approvalKuitansiTte' => $module . '@approvalKuitansiTte',
            'downloadKuitansiTte' => $module . '@downloadKuitansiTte',
            'streamKuitansiTte'   => $module . '@streamKuitansiTte',
            'previewKuitansi'     => $module . '@previewKuitansi',
        ];

        $targetGroupIds = [
            SysGroup::BENDAHARA->value,
            SysGroup::ADMIN->value,
            SysGroup::ROOT->value,
            SysGroup::MARKETING->value,
        ];

        $groups = DB::table('sys_group')
            ->whereIn('id', $targetGroupIds)
            ->orWhereIn('name', ['Bendahara', 'Admin', 'Root', 'Marketing'])
            ->get();

        foreach ($actions as $actName => $controllerAction) {
            $existing = DB::table('sys_menu_action')
                ->where('menu_id', $menuId)
                ->where('controller', $controllerAction)
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
        $module = 'Modules\\Permohonan\\Http\\Controllers\\InvoiceController';
        $controllers = [
            $module . '@approvalKuitansiTte',
            $module . '@downloadKuitansiTte',
            $module . '@streamKuitansiTte',
        ];

        $actionIds = DB::table('sys_menu_action')
            ->whereIn('controller', $controllers)
            ->pluck('id');

        DB::table('sys_group_permission')->whereIn('action_id', $actionIds)->delete();
        DB::table('sys_menu_action')->whereIn('id', $actionIds)->delete();
    }
};

