<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use Illuminate\Support\Str;

class MasterJenisLayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $lsp = MasterJenisLayanan::create([
            'jenis_layanan' => 'Sertifikasi Profesi (LSP)',
            'slug'          => Str::slug('Sertifikasi Profesi (LSP)'),
            'is_active'     => true,
        ]);
        $pelatihan = MasterJenisLayanan::create([
            'jenis_layanan' => 'Pelatihan',
            'slug'          => Str::slug('Pelatihan'),
            'is_active'     => true,
        ]);
        $lingkupLsp = [
            [
                'jenis_layanan_id' => $lsp->id,
                'lingkup'          => 'Transformasi Industri 4.0',
                'kapabilitas'      => false,
                'slug'             => Str::slug('Transformasi Industri 4.0'),
                'is_active'        => true,
            ],
        ];

        foreach ($lingkupLsp as $item) {
            MasterLingkupLayanan::create($item);
        }
        $lingkupPelatihan = [
            [
                'jenis_layanan_id' => $pelatihan->id,
                'lingkup'          => 'Halal Reguler',
                'kapabilitas'      => true,
                'slug'             => Str::slug('Halal Reguler'),
                'is_active'        => true,
            ],
            [
                'jenis_layanan_id' => $pelatihan->id,
                'lingkup'          => 'Halal UMK',
                'kapabilitas'      => true,
                'slug'             => Str::slug('Halal UMK'),
                'is_active'        => true,
            ],
        ];
        foreach ($lingkupPelatihan as $item) {
            MasterLingkupLayanan::create($item);
        }
    }
}