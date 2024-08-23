<?php

namespace Database\Seeders;

use App\Models\Db1\MasterTopikPertanyaan;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Enums\SysGroup;
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
            ['name' => 'Umum', 'layanan_id' => NULL, 'layanan_nama' => '','desc' => 'Topik Pertanyaan Umum'],
        ];
		
		$masterLayanan = MasterLayanan::get();
		
        foreach ($masterLayanan as $dat) {
			$data_topik[] = ['layanan_nama' => $dat->name, 'name' => 'Keluhan Layanan '.$dat->name , 'layanan_id' => $dat->id ,'desc' => 'Topik Pertanyaan Layanan'.$dat->name];
		}
		
		$userPerorangan = Pelanggan::where('jenis_pelanggan', 'Perorangan')->first();
		$userUser = SysUserGroup::where('group_id', SysGroup::ROOT)->first();
		
		$i = 0;
		$faker = Factory::create();
        foreach ($data_topik as $dat) {
			$topik                     = new MasterTopikPertanyaan();
			$topik->name      = $dat['name'];
			$topik->layanan_id      = $dat['layanan_id'];
			$topik->desc      = $dat['desc'];
			$topik->save();
			
			$pertanyaan                     = new PertanyaanPelanggan();
			if($i == 1){
				$pertanyaan->pelanggan_id               = $userPerorangan->id;
				$pertanyaan->layanan      = $dat['layanan_nama'];
				$pertanyaan->topik    = $dat['name'];
				$pertanyaan->closed_by    = NULL;
				$pertanyaan->status    = 'opened';
				$pertanyaan->is_review    = 'no';
				$pertanyaan->testimoni    = NULL;
				$pertanyaan->rating    = NULL;
				$pertanyaan->save();
			}
			else{
				$pertanyaan->pelanggan_id               = $userPerorangan->id;
				$pertanyaan->layanan      = $dat['layanan_nama'];
				$pertanyaan->topik    = $dat['name'];
				$pertanyaan->closed_by    = $userPerorangan->user_id;
				$pertanyaan->status    = 'closed';
				$pertanyaan->is_review    = 'yes';
				$pertanyaan->testimoni    = $faker->sentence;
				$pertanyaan->rating    = 5;
				$pertanyaan->save();
			}
			
			for ($j = 0; $j <= 2; $j++) {
				$data_pesan = [
						'pertanyaan_id'   => $pertanyaan->id,
						'pesan' => $faker->paragraph,
						'is_replied' => 'yes',
					];
				
				if ( $j % 2 == 0 ){
					$data_pesan['created_by'] = $userPerorangan->user_id;
				}
				else{
					$data_pesan['created_by'] = $userUser->user_id;
				}
				
				if($i == 1 && $j == 2){
					$data_pesan['is_replied'] = 'no';
				}
				PertanyaanPelangganPesan::create($data_pesan);
			}
			$i++;
        }
		
    }
}
