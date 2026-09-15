<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterJenisPerusahaanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id' => 1, 'nama' => 'Produsen / Pabrikan', 'deskripsi' => 'Perusahaan yang memproduksi barang secara langsung di fasilitas produksi/pabrik'],
            ['id' => 2, 'nama' => 'Distributor / Penyalur', 'deskripsi' => 'Perusahaan yang mendistribusikan barang dari produsen ke pengecer atau konsumen'],
            ['id' => 3, 'nama' => 'Importir', 'deskripsi' => 'Perusahaan yang melakukan kegiatan memasukkan barang dari luar negeri ke dalam wilayah pabean'],
            ['id' => 4, 'nama' => 'Eksportir', 'deskripsi' => 'Perusahaan yang melakukan kegiatan mengeluarkan barang dari dalam wilayah pabean ke luar negeri'],
            ['id' => 5, 'nama' => 'Perdagangan Umum', 'deskripsi' => 'Perusahaan yang bergerak dalam aktivitas jual beli barang dan komoditas'],
            ['id' => 6, 'nama' => 'Jasa', 'deskripsi' => 'Perusahaan yang menyediakan layanan atau jasa profesional dan operasional'],
            ['id' => 7, 'nama' => 'Agen / Perwakilan Resmi', 'deskripsi' => 'Perusahaan yang bertindak sebagai perwakilan resmi pemegang merk atau prinsipal'],
        ];

        foreach ($data as $row) {
            DB::table('master_jenis_perusahaan')->updateOrInsert(
                ['id' => $row['id']],
                [
                    'nama' => $row['nama'],
                    'deskripsi' => $row['deskripsi'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
