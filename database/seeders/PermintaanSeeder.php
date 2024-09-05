<?php

namespace Database\Seeders;

use App\Enums\DataIntegrasiLayananStatusOrder;
use App\Enums\Layanan;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use App\Models\Db1\SysUser;
use Faker\Factory;
use Illuminate\Database\Seeder;

class PermintaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userPerorangan = SysUser::where('email', 'perorangan@mailinator.com')->first();
        $dtLayanan      = MasterLayanan::where('id', Layanan::UJI)->first();


        $faker = Factory::create();
        for ($i = 0; $i < 10; $i++) {
            DataIntegrasiLayanan::create([
                'user_id'           => $userPerorangan->id,
                'layanan_id'        => $dtLayanan->id,
                'id_order'          => $userPerorangan->id,
                'kode_order'        => $faker->unique()->regexify('UJI-' . date('ym') . '-[0-9]{8}'),
                'tanggal_order'     => $faker->dateTimeThisMonth()->format('Y-m-d H:i:s'),
                'status_order'      => DataIntegrasiLayananStatusOrder::randomValue(),
                'file_attachment'   => null,
                'feedback_json'     => [],
                'is_given_feedback' => 0
            ]);
        }
    }
}
