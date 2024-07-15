<?php

namespace Database\Seeders;

use App\Models\Db1\SysGroup;
use App\Models\Db1\SysGroupPermission;
use App\Models\Db1\SysMenuAction;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data_group = [
            ['name' => 'Root', 'desc' => 'Root Super Access', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::ROOT],
            ['name' => 'Admin', 'desc' => 'Manage Setting', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::ADMIN],
            ['name' => 'Pelanggan', 'desc' => 'Pelanggan', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::PELANGGAN],
            ['name' => 'Pegawai', 'desc' => 'Pelanggan', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::PEGAWAI],
        ];

        foreach ($data_group as $group) {
            SysGroup::query()->create([
                'id' => $group['id'],
                'name' => $group['name'],
                'desc' => $group['desc'],
                'is_active' => $group['is_active'],
            ]);
        }

        // Insert All Permission to root user
        $data = SysMenuAction::all();
        foreach ($data as $d) {
            SysGroupPermission::query()->create([
                'group_id' => \App\Enums\SysGroup::ROOT,
                'action_id' => $d->id,
            ]);
        }
    }
}
