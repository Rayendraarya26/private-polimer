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
        $this->command->info('Configuring Marketing / Pegawai Role & Permissions...');

        // 1. Create or retrieve user marketing
        $user = SysUser::firstOrCreate(
            ['email' => 'marketing@mailinator.com'],
            [
                'name'              => 'Tim Marketing & Verifikasi',
                'password'          => bcrypt('password'),
                'email_verified_at' => now(),
                'nip'               => '199001012015011001',
            ]
        );

        // 2. Set user group strictly to PEGAWAI (remove ROOT/ADMIN)
        SysUserGroup::where('user_id', $user->id)->delete();
        SysUserGroup::create([
            'user_id'    => $user->id,
            'group_id'   => SysGroup::PEGAWAI,
            'is_default' => 'yes',
        ]);

        // 3. Ensure Pegawai Profile
        $user->pegawai()->firstOrCreate(
            ['user_id' => $user->id],
            ['nik' => '3271012345670009']
        );

        // 4. Remove System menu permissions from non-Root groups
        $systemActionIds = SysMenuAction::where('controller', 'LIKE', '%Modules\System%')->pluck('id');
        SysGroupPermission::where('group_id', '!=', SysGroup::ROOT)
            ->whereIn('action_id', $systemActionIds)
            ->delete();

        // 5. Assign Operational & Permohonan permissions to PEGAWAI group
        $operationalActions = SysMenuAction::where(function ($query) {
            $query->where('controller', 'LIKE', '%Modules\Permohonan%')
                  ->orWhere('controller', 'LIKE', '%Modules\Admin\Http\Controllers\DashboardController%')
                  ->orWhere('controller', 'LIKE', '%Modules\Admin\Http\Controllers\PertanyaanPelangganController%')
                  ->orWhere('controller', '#');
        })->get();

        foreach ($operationalActions as $action) {
            SysGroupPermission::firstOrCreate([
                'group_id'  => SysGroup::PEGAWAI,
                'action_id' => $action->id,
            ]);
        }

        $this->command->info('Marketing role configured strictly as PEGAWAI (Operational only, non-superadmin).');
    }
}
