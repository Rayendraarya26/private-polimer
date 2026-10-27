<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuMasterPermohonanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cari atau buat parent menu 'Master Permohonan'
        $masterPermohonan = DB::table('sys_menu')
            ->where('name', 'Master Permohonan')
            ->first();

        $masterPermohonanId = $masterPermohonan?->id ?? (string) Str::uuid();

        DB::table('sys_menu')->updateOrInsert(
            ['id' => $masterPermohonanId],
            [
                'parent_id'  => null,
                'name'       => 'Master Permohonan',
                'desc'       => 'Manajemen data master permohonan',
                'icon'       => 'fa-regular fa-database',
                'order'      => 100,
                'is_active'  => 'yes',
                'updated_at' => now(),
            ]
        );

        // 2. Action 'index' '#' wajib ada untuk setiap parent menu agar terbaca di AuthTrait
        $parentAction = DB::table('sys_menu_action')
            ->where('menu_id', $masterPermohonanId)
            ->where('name', 'index')
            ->first();

        $parentActionId = $parentAction?->id ?? (string) Str::uuid();

        DB::table('sys_menu_action')->updateOrInsert(
            ['id' => $parentActionId],
            [
                'menu_id'    => $masterPermohonanId,
                'name'       => 'index',
                'controller' => '#',
                'updated_at' => now(),
            ]
        );

        // 3. Grup yang memiliki akses ke Master Permohonan
        $targetGroups = [
            SysGroup::ROOT->value,
            SysGroup::ADMIN->value,
            SysGroup::PEGAWAI->value,
            SysGroup::MARKETING->value,
            SysGroup::BENDAHARA->value,
        ];

        foreach ($targetGroups as $groupId) {
            $hasGroup = DB::table('sys_group')->where('id', $groupId)->exists();
            if ($hasGroup) {
                $hasPerm = DB::table('sys_group_permission')
                    ->where('group_id', $groupId)
                    ->where('action_id', $parentActionId)
                    ->exists();

                if (!$hasPerm) {
                    DB::table('sys_group_permission')->insert([
                        'id'         => (string) Str::uuid(),
                        'group_id'   => $groupId,
                        'action_id'  => $parentActionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // 4. Pastikan Master Kalibrasi adalah anak dari Master Permohonan
        $kalibrasi = DB::table('sys_menu')
            ->where('name', 'Master Kalibrasi')
            ->first();

        if ($kalibrasi) {
            DB::table('sys_menu')->where('id', $kalibrasi->id)->update([
                'parent_id'  => $masterPermohonanId,
                'is_active'  => 'yes',
                'updated_at' => now(),
            ]);

            // Pastikan seluruh action Master Kalibrasi diberikan permission
            $kalibrasiActions = DB::table('sys_menu_action')
                ->where('menu_id', $kalibrasi->id)
                ->get();

            foreach ($kalibrasiActions as $action) {
                foreach ($targetGroups as $groupId) {
                    $hasGroup = DB::table('sys_group')->where('id', $groupId)->exists();
                    if ($hasGroup) {
                        $hasPerm = DB::table('sys_group_permission')
                            ->where('group_id', $groupId)
                            ->where('action_id', $action->id)
                            ->exists();

                        if (!$hasPerm) {
                            DB::table('sys_group_permission')->insert([
                                'id'         => (string) Str::uuid(),
                                'group_id'   => $groupId,
                                'action_id'  => $action->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }
    }
}
