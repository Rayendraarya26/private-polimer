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
        $marketingGroupId = SysGroup::MARKETING->value;

        // Ambil semua aksi controller TkdnController
        $actions = DB::table('sys_menu_action')
            ->where('controller', 'LIKE', '%TkdnController%')
            ->get();

        foreach ($actions as $act) {
            $hasPerm = DB::table('sys_group_permission')
                ->where('group_id', $marketingGroupId)
                ->where('action_id', $act->id)
                ->exists();

            if (!$hasPerm) {
                DB::table('sys_group_permission')->insert([
                    'id'         => (string) Str::uuid(),
                    'group_id'   => $marketingGroupId,
                    'action_id'  => $act->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $marketingGroupId = SysGroup::MARKETING->value;

        $actions = DB::table('sys_menu_action')
            ->where('controller', 'LIKE', '%TkdnController%')
            ->pluck('id')
            ->toArray();

        if (!empty($actions)) {
            DB::table('sys_group_permission')
                ->where('group_id', $marketingGroupId)
                ->whereIn('action_id', $actions)
                ->delete();
        }
    }
};
