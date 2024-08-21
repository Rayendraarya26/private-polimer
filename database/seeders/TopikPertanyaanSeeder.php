<?php

namespace Database\Seeders;

use App\Models\Db1\MasterTopikPertanyaan;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;
use Faker\Factory;
use Illuminate\Database\Seeder;

class TopikPertanyaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data_topik = [
            ['name' => 'Umum', 'desc' => 'Topik Pertanyaan Umum'],
            ['name' => 'Layanan SIS', 'desc' => 'Topik Pertanyaan Layanan Sys']
        ];

        foreach ($data_topik as $dat) {
            MasterTopikPertanyaan::query()->create([
                'name' => $dat['name'],
                'desc' => $dat['desc']
            ]);
        }
		
		$userPerorangan = Pelanggan::where('jenis_pelanggan', 'Perorangan')->first();

		$pertanyaan                     = new PertanyaanPelanggan();
		$pertanyaan->pelanggan_id               = $userPerorangan->id;
		$pertanyaan->pertanyaan      = 'Saya ingin bertanya tentang transaksi saya yang masih ke hold untuk No #1';
		$pertanyaan->topik    = 'Umum';
		$pertanyaan->save();
		
		$faker = Factory::create();
		PertanyaanPelangganPesan::create([
                'created_by' => $userPerorangan->user_id,
                'pertanyaan_id'   => $pertanyaan->id,
                'pesan' => $faker->paragraph,
                'is_replied' => 'no',
            ]);
    }
}
