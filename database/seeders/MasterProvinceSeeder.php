<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $dataProvinces = fopen(storage_path("db_migration/provinces.csv"), 'r');
        $loop = 1;
        $now = Carbon::now();
        while (($data = fgetcsv($dataProvinces, 0, ",")) !== FALSE) {
            if ($loop > 1) {
                DB::table('master_provinsi')
                    ->insert([
                        "prov_id" => $data[0],
                        "prov_nama" => $data[1],
                        "created_at" => $now
                    ]);
            }
            $loop++;
        }
    }
}
