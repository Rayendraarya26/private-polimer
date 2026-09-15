<?php

namespace Database\Seeders;

use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SertifikasiMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('===== Seeding Master Data Sertifikasi =====');

        // 1. Ensure Jenis Layanan Sertifikasi exists
        $sertifikasi = MasterJenisLayanan::firstOrCreate(
            ['slug' => 'sertifikasi'],
            [
                'jenis_layanan' => 'Sertifikasi Produk & Sistem',
                'is_active'     => true,
            ]
        );

        // 2. Ensure Lingkup Layanan Sertifikasi
        $lingkupItems = [
            [
                'lingkup'     => 'Sertifikasi Produk Penggunaan Tanda SNI (SPPT SNI)',
                'slug'        => Str::slug('Sertifikasi Produk Penggunaan Tanda SNI (SPPT SNI)'),
                'kapabilitas' => true,
                'is_active'   => true,
            ],
            [
                'lingkup'     => 'Sertifikasi Sistem Manajemen Mutu (ISO 9001)',
                'slug'        => Str::slug('Sertifikasi Sistem Manajemen Mutu (ISO 9001)'),
                'kapabilitas' => true,
                'is_active'   => true,
            ],
            [
                'lingkup'     => 'Sertifikasi Sistem Manajemen Lingkungan (ISO 14001)',
                'slug'        => Str::slug('Sertifikasi Sistem Manajemen Lingkungan (ISO 14001)'),
                'kapabilitas' => true,
                'is_active'   => true,
            ],
            [
                'lingkup'     => 'Sertifikasi Industri Hijau',
                'slug'        => Str::slug('Sertifikasi Industri Hijau'),
                'kapabilitas' => true,
                'is_active'   => true,
            ],
        ];

        foreach ($lingkupItems as $item) {
            MasterLingkupLayanan::firstOrCreate(
                [
                    'jenis_layanan_id' => $sertifikasi->id,
                    'slug'             => $item['slug'],
                ],
                [
                    'lingkup'     => $item['lingkup'],
                    'kapabilitas' => $item['kapabilitas'],
                    'is_active'   => $item['is_active'],
                ]
            );
        }

        // 3. Import or Sync Master Data from SIS if connection available
        try {
            if (config('database.connections.sis')) {
                $komoditiSis = DB::connection('sis')->table('master_komoditi')->get();
                $this->command->info('Found ' . count($komoditiSis) . ' commodities from SIS database.');
            }
        } catch (Exception $e) {
            $this->command->warn('Notice: Connection to SIS database not active during seeding. Default master records applied.');
        }

        $this->command->info('Master Data Sertifikasi successfully seeded.');
    }
}
