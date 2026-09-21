<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SilPengujianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Mengimpor master komoditas & parameter pengujian laboratorium dari SQL dump SIL.
     */
    public function run(): void
    {
        $sqlPath = base_path('database/param_dan_komoditas.sql');
        if (!file_exists($sqlPath)) {
            $userDownload = 'C:/Users/User/Downloads/param dan komoditas.sql';
            if (file_exists($userDownload)) {
                copy($userDownload, $sqlPath);
            } else {
                $this->command->error("File SQL tidak ditemukan di $sqlPath maupun Downloads.");
                return;
            }
        }

        $this->command->info("Membuat schema tabel pada database SIL (bbkkp_sil)...");

        // Pastikan database bbkkp_sil ada
        DB::statement("CREATE DATABASE IF NOT EXISTS `bbkkp_sil` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        $sil = DB::connection('sil');

        $sil->statement("
            CREATE TABLE IF NOT EXISTS `master_komoditas` (
              `id_komoditas` int NOT NULL,
              `bahasas_id` int DEFAULT '1',
              `no_id_komoditas` int DEFAULT NULL,
              `kategori_komoditas_id` int DEFAULT NULL,
              `laboratoriums_id` int DEFAULT NULL,
              `satuan_tarifs_id` int DEFAULT NULL,
              `kode_komoditas` varchar(50) DEFAULT NULL,
              `nama_komoditas` varchar(255) DEFAULT NULL,
              `waktu_jam_komoditas` int DEFAULT NULL,
              `spm` int DEFAULT NULL,
              PRIMARY KEY (`id_komoditas`),
              KEY `bahasa_idx` (`bahasas_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $sil->statement("
            CREATE TABLE IF NOT EXISTS `master_parameters` (
              `id_parameters` int NOT NULL,
              `no_id_parameters` int DEFAULT NULL,
              `bahasas_id` int DEFAULT '1',
              `kategori_komoditas_id` int DEFAULT NULL,
              `laboratoriums_id` int DEFAULT NULL,
              `satuan_tarifs_id` int DEFAULT NULL,
              `kode_parameters` varchar(50) DEFAULT NULL,
              `nama_parameters` varchar(255) DEFAULT NULL,
              `waktu_jam_parameters` int DEFAULT NULL,
              PRIMARY KEY (`id_parameters`),
              KEY `bahasa_idx` (`bahasas_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $sil->statement("
            CREATE TABLE IF NOT EXISTS `master_parameter_komoditas` (
              `id` bigint AUTO_INCREMENT PRIMARY KEY,
              `parameters_id` int NOT NULL,
              `komoditas_id` int NOT NULL,
              KEY `kmd_idx` (`komoditas_id`),
              KEY `param_idx` (`parameters_id`),
              KEY `kmd_param_idx` (`komoditas_id`, `parameters_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $this->command->info("Mengosongkan tabel lama sebelum re-seed...");
        $sil->statement("SET FOREIGN_KEY_CHECKS=0");
        $sil->table('master_parameter_komoditas')->truncate();
        $sil->table('master_parameters')->truncate();
        $sil->table('master_komoditas')->truncate();
        $sil->statement("SET FOREIGN_KEY_CHECKS=1");

        $this->command->info("Mengekstrak dan mengimpor data SQL ke bbkkp_sil...");
        $content = file_get_contents($sqlPath);

        preg_match_all('/insert\s+into\s+[`]?([a-zA-Z0-9_]+)[`]?\s*\((.*?)\)\s*values\s*(\(.*?\));/is', $content, $matches, PREG_SET_ORDER);

        foreach ($matches as $m) {
            $table = $m[1];
            $columns = $m[2];
            $values = $m[3];

            if ($table === 'master_parameter_komoditas') {
                $query = "INSERT INTO `master_parameter_komoditas` (`parameters_id`, `komoditas_id`) VALUES " . $values;
            } else {
                $query = $m[0];
            }

            try {
                $sil->unprepared($query);
                $this->command->info("Data berhasil diimpor ke tabel `$table`.");
            } catch (\Throwable $e) {
                $this->command->error("Gagal mengimpor `$table`: " . $e->getMessage());
            }
        }

        $countKmd = $sil->table('master_komoditas')->where('bahasas_id', 1)->count();
        $countParam = $sil->table('master_parameters')->where('bahasas_id', 1)->count();
        $countRel = $sil->table('master_parameter_komoditas')->count();

        $this->command->info("==========================================");
        $this->command->info("SELESAI! Master SIL Pengujian Terpasang:");
        $this->command->info("- Komoditas Pengujian (ID): $countKmd komoditas");
        $this->command->info("- Parameter Uji Lab (ID)  : $countParam parameter");
        $this->command->info("- Relasi Parameter-Komoditas: $countRel pemetaan");
        $this->command->info("==========================================");
    }
}
