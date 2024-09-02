<?php

namespace Database\Seeders;

use App\Enums\Option;
use App\Models\Db1\SysUser;
use App\Models\Db1\DataIntegrasiLayanan;
use App\Models\Db1\MasterLayanan;
use App\Enums\Layanan;
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
        $layananMaster = MasterLayanan::where('id', 'b0f688a8-af58-40a5-95c9-f4d497878ed5')->get();

        // seed 40 notifications
        $faker = Factory::create();
        foreach($layananMaster as $dtLayanan) {
            DataIntegrasiLayanan::create([
                'user_id' => $userPerorangan->id,
                'layanan_id' => $dtLayanan->id,
                'id_order' => $userPerorangan->id,
                'kode_order'   => $faker->unique()->regexify("/^SER-[a-z]{3}"),
                'tanggal_order' => $faker->dateTimeThisMonth()->format('Y-m-d H:i:s'),
                'status_order'    => 'permohonan',
                'file_attachment'    => null,
                'feedback_json'    => null,
                'is_given_feedback'    => 0
            ]);
        }
    }
}
