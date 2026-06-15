<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $dataProvinces = fopen(storage_path("db_migration/districts.csv"), 'r');
        $loop = 1;
        $now = Carbon::now();
        while (($data = fgetcsv($dataProvinces, 0, ",")) !== FALSE) {
            if ($loop > 1) {
                DB::table('master_kecamatan')
                    ->insert([
                        "kec_id" => $data[0],
                        "kab_id" => $data[1],
                        "kec_nama" => $data[2],
                        "created_at" => $now
                    ]);
            }
            $loop++;
        }
    }
}
