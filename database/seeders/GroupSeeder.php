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
            ['name' => 'Pelanggan', 'desc' => 'Pelanggan Layanan', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::PELANGGAN],
            ['name' => 'Pegawai', 'desc' => 'Pegawai', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::PEGAWAI],
            ['name' => 'Bendahara', 'desc' => 'Bendahara Penerimaan', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::BENDAHARA],
            ['name' => 'Marketing', 'desc' => 'Tim Pemasaran & Verifikasi Permohonan', 'is_active' => 'yes', 'id' => \App\Enums\SysGroup::MARKETING],
        ];

        foreach ($data_group as $group) {
            SysGroup::query()->firstOrCreate(
                ['id' => $group['id']],
                [
                    'name' => $group['name'],
                    'desc' => $group['desc'],
                    'is_active' => $group['is_active'],
                ]
            );
        }

        // Insert All Permission to root & admin user
        $data = SysMenuAction::all();
        foreach ($data as $d) {
            SysGroupPermission::query()->firstOrCreate([
                'group_id' => \App\Enums\SysGroup::ROOT,
                'action_id' => $d->id,
            ]);
            SysGroupPermission::query()->firstOrCreate([
                'group_id' => \App\Enums\SysGroup::ADMIN,
                'action_id' => $d->id,
            ]);
        }
        // Parent Permohonan menu action for both Marketing & Bendahara
        $permohonanParent = \App\Models\Db1\SysMenu::where('name', 'Permohonan')->whereNull('parent_id')->first();
        $parentAction = $permohonanParent ? SysMenuAction::where('menu_id', $permohonanParent->id)->where('name', 'index')->first() : null;

        // Clear existing permissions for Marketing & Bendahara
        SysGroupPermission::whereIn('group_id', [\App\Enums\SysGroup::BENDAHARA, \App\Enums\SysGroup::MARKETING])->delete();

        if ($parentAction) {
            SysGroupPermission::firstOrCreate([
                'group_id'  => \App\Enums\SysGroup::BENDAHARA,
                'action_id' => $parentAction->id,
            ]);
            SysGroupPermission::firstOrCreate([
                'group_id'  => \App\Enums\SysGroup::MARKETING,
                'action_id' => $parentAction->id,
            ]);
        }

        $modulePermohonan = 'Modules\Permohonan\Http\Controllers';

        // Bendahara: PermohonanController (index, ajax, detail), InvoiceController, and BillingPembayaranController
        $bendaharaActions = SysMenuAction::where(function ($query) use ($modulePermohonan) {
            $query->whereIn('controller', [
                $modulePermohonan . '\PermohonanController@index',
                $modulePermohonan . '\PermohonanController@ajax',
                $modulePermohonan . '\PermohonanController@detail',
            ])
            ->orWhere('controller', 'LIKE', $modulePermohonan . '\InvoiceController%')
            ->orWhere('controller', 'LIKE', $modulePermohonan . '\BillingPembayaranController%');
        })->get();

        foreach ($bendaharaActions as $action) {
            SysGroupPermission::firstOrCreate([
                'group_id'  => \App\Enums\SysGroup::BENDAHARA,
                'action_id' => $action->id,
            ]);
        }

        // Marketing: PermohonanController and TagihanBiayaController (NO Billing, NO Master, NO System)
        $marketingActions = SysMenuAction::where(function ($query) use ($modulePermohonan) {
            $query->where('controller', 'LIKE', $modulePermohonan . '\PermohonanController%')
                  ->orWhere('controller', 'LIKE', $modulePermohonan . '\TagihanBiayaController%');
        })->get();

        foreach ($marketingActions as $action) {
            SysGroupPermission::firstOrCreate([
                'group_id'  => \App\Enums\SysGroup::MARKETING,
                'action_id' => $action->id,
            ]);
        }
    }
}
