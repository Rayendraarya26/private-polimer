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
        
        $lsp = MasterJenisLayanan::firstOrCreate(
            ['slug' => Str::slug('Sertifikasi Profesi (LSP)')],
            [
                'jenis_layanan' => 'Sertifikasi Profesi (LSP)',
                'is_active'     => true,
            ]
        );
        $pelatihan = MasterJenisLayanan::firstOrCreate(
            ['slug' => Str::slug('Pelatihan')],
            [
                'jenis_layanan' => 'Pelatihan',
                'is_active'     => true,
            ]
        );
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
            MasterLingkupLayanan::firstOrCreate(
                ['jenis_layanan_id' => $item['jenis_layanan_id'], 'slug' => $item['slug']],
                $item
            );
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
            MasterLingkupLayanan::firstOrCreate(
                ['jenis_layanan_id' => $item['jenis_layanan_id'], 'slug' => $item['slug']],
                $item
            );
        }
    }
}