<?php

namespace Database\Seeders;

use App\Enums\SysGroup;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => 'Aldino Kemal', 'email' => 'kemal@mailinator.com', 'password' => 'password', 'group' => SysGroup::ROOT],
            ['name' => 'Adam Smith', 'email' => 'adam@mailinator.com', 'password' => 'password', 'group' => SysGroup::PELANGGAN],
            ['name' => 'Ariel', 'email' => 'ariel@mailinator.com', 'password' => 'password', 'group' => SysGroup::PEGAWAI, 'nip' => '1234567890'],
        ];

        foreach ($data as $item) {
            $user = SysUser::query()->create([
                'name' => $item['name'],
                'email' => $item['email'],
                'password' => bcrypt($item['password']),
                'is_active' => 'yes',
                'active_at' => now(),
                'nip' => $item['nip'] ?? null,
            ]);

            SysUserGroup::query()->create([
                'user_id' => $user->id,
                'group_id' => $item['group'],
                'is_default' => 'yes',
            ]);
        }
    }
}
