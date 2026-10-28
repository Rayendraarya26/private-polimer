<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MasterKlasifikasiKalibrasi extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $klasifikasiList = [
            'SUHU DAN KELEMBABAN',
            'MASSA DAN BESARAN TERKAIT',
            'PANJANG DAN BESARAN TERKAIT',
            'KELISTRIKAN DAN KEMAGNETAN',
            'WAKTU DAN FREKUENSI',
            'AKUSTIK DAN GETARAN',
            'FOTOMETRI DAN RADIOMETRI',
            'INSTRUMEN PENGUJIAN',
            'RADIASI PENGIONAN',
            'PERALATAN KESEHATAN',
        ];

        foreach ($klasifikasiList as $klasifikasi) {
            DB::table('master_klasifikasi_kalibrasi')->updateOrInsert(
                ['klasifikasi' => $klasifikasi],
                [
                    'id' => (string) Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Update jenis_klasifikasi pada permohonan kalibrasi yang sudah ada jika belum terisi
        $defaultId = DB::table('master_klasifikasi_kalibrasi')
            ->where('klasifikasi', 'SUHU DAN KELEMBABAN')
            ->value('id') ?: DB::table('master_klasifikasi_kalibrasi')->value('id');

        if ($defaultId) {
            DB::table('form_kalibrasi')
                ->whereNull('jenis_klasifikasi')
                ->update(['jenis_klasifikasi' => $defaultId]);
        }
    }
}
