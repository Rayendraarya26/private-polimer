<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use App\Models\Db1\SysGroupPermission;
use App\Models\Db1\SysMenuAction;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarketingUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Configuring Marketing Role & User Account...');

        // 1. Ensure Marketing Group exists
        $marketingGroup = \App\Models\Db1\SysGroup::firstOrCreate(
            ['id' => SysGroup::MARKETING->value],
            [
                'name'      => 'Marketing',
                'desc'      => 'Tim Pemasaran, Verifikasi & Penetapan Biaya Layanan',
                'is_active' => 'yes',
            ]
        );

        // 2. Create or retrieve user marketing
        $marketingUsers = [
            [
                'email' => 'marketing@mailinator.com',
                'name'  => 'Tim Marketing & Verifikasi',
                'nip'   => '199001012015011001',
            ],
        ];

        foreach ($marketingUsers as $userData) {
            $user = SysUser::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name'              => $userData['name'],
                    'password'          => bcrypt('password'),
                    'email_verified_at' => now(),
                    'nip'               => $userData['nip'],
                ]
            );

            // Update password if already exists
            $user->update([
                'password'          => bcrypt('password'),
                'email_verified_at' => now(),
            ]);

            // Assign group to MARKETING
            SysUserGroup::where('user_id', $user->id)->delete();
            SysUserGroup::create([
                'user_id'    => $user->id,
                'group_id'   => SysGroup::MARKETING->value,
                'is_default' => 'yes',
            ]);

            // Ensure Pegawai Profile
            $user->pegawai()->firstOrCreate(
                ['user_id' => $user->id],
                ['nik' => '3271012345670009']
            );
        }

        // 3. Assign Permohonan permissions to MARKETING group (ONLY Permohonan & Data Permohonan Layanan)
        SysGroupPermission::where('group_id', SysGroup::MARKETING->value)->delete();

        $permohonanParent = \App\Models\Db1\SysMenu::where('name', 'Permohonan')->whereNull('parent_id')->first();
        if ($permohonanParent) {
            $parentAction = SysMenuAction::where('menu_id', $permohonanParent->id)->where('name', 'index')->first();
            if ($parentAction) {
                SysGroupPermission::firstOrCreate([
                    'group_id'  => SysGroup::MARKETING->value,
                    'action_id' => $parentAction->id,
                ]);
            }
        }

        $modulePermohonan = 'Modules\Permohonan\Http\Controllers';
        $marketingActions = SysMenuAction::where(function ($query) use ($modulePermohonan) {
            $query->where('controller', 'LIKE', $modulePermohonan . '\PermohonanController%')
                  ->orWhere('controller', 'LIKE', $modulePermohonan . '\TagihanBiayaController%');
        })->get();

        foreach ($marketingActions as $action) {
            SysGroupPermission::firstOrCreate([
                'group_id'  => SysGroup::MARKETING->value,
                'action_id' => $action->id,
            ]);
        }

        $this->command->info('Marketing role & user account seeded successfully (marketing@bbkkp.go.id / password).');
    }
}
