<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Db2\MasterKomoditasPengujian;
use App\Models\Db2\MasterParameterPengujian;

class MasterPengujianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Mengisi data tabel master_komoditas_pengujian dan master_parameter_pengujian.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/master_pengujian_sil.json');

        if (file_exists($jsonPath)) {
            $this->command->info("Mengimpor data dari {$jsonPath}...");
            $data = json_decode(file_get_contents($jsonPath), true);

            if (!empty($data) && is_array($data)) {
                DB::beginTransaction();
                try {
                    $totalKomoditas = 0;
                    $totalParameter = 0;

                    foreach ($data as $komoditi) {
                        $komoditas = MasterKomoditasPengujian::updateOrCreate(
                            ['id' => $komoditi['id']],
                            [
                                'kode'          => $komoditi['kode'] ?? null,
                                'nama'          => $komoditi['nama'] ?? 'Tanpa Nama',
                                'ruang_lingkup' => $komoditi['ruang_lingkup'] ?? null,
                                'waktu_jam'     => $komoditi['waktu_jam'] ?? null,
                                'spm'           => $komoditi['spm'] ?? null,
                                'is_active'     => $komoditi['is_active'] ?? true,
                            ]
                        );
                        $totalKomoditas++;

                        if (!empty($komoditi['parameters']) && is_array($komoditi['parameters'])) {
                            foreach ($komoditi['parameters'] as $param) {
                                MasterParameterPengujian::updateOrCreate(
                                    ['id' => $param['id']],
                                    [
                                        'komoditas_id'    => $komoditas->id,
                                        'kode'            => $param['kode'] ?? null,
                                        'nama'            => $param['nama'] ?? 'Tanpa Nama Parameter',
                                        'metode_uji'      => $param['metode_uji'] ?? 'SNI / Standar Metode Uji Lab',
                                        'satuan'          => $param['satuan'] ?? 'Per Parameter',
                                        'waktu_jam'       => $param['waktu_jam'] ?? null,
                                        'tarif_umum'      => $param['tarif_umum'] ?? 0,
                                        'tarif_mahasiswa' => $param['tarif_mahasiswa'] ?? 0,
                                        'deskripsi'       => $param['deskripsi'] ?? null,
                                        'is_active'       => $param['is_active'] ?? true,
                                    ]
                                );
                                $totalParameter++;
                            }
                        }
                    }

                    DB::commit();
                    $this->command->info("Berhasil mengimpor {$totalKomoditas} komoditas dan {$totalParameter} parameter pengujian!");
                    return;
                } catch (\Throwable $e) {
                    DB::rollBack();
                    $this->command->error("Gagal mengimpor dari JSON: " . $e->getMessage());
                }
            }
        }

        // Fallback default sample data jika file JSON tidak tersedia
        $this->command->info("Menggunakan data fallback default...");

        $defaultKomoditas = [
            [
                'id' => 1,
                'kode' => 'KMD-KRT',
                'nama' => 'Karet dan Barang Karet',
                'ruang_lingkup' => 'Pengujian Sifat Fisika, Mekanik, & Kimia Karet Alami / Sintetik',
                'is_active' => true,
            ],
            [
                'id' => 2,
                'kode' => 'KMD-PLS',
                'nama' => 'Plastik dan Polimer Komposit',
                'ruang_lingkup' => 'Pengujian Karakterisasi Termal, Reologi, Mekanik, & Degradasi Plastik',
                'is_active' => true,
            ],
            [
                'id' => 3,
                'kode' => 'KMD-KLT',
                'nama' => 'Kulit dan Produk Olahan Kulit',
                'ruang_lingkup' => 'Pengujian Fisika, Ketahanan Bending, Penyamakan, & Kimiawi Kulit',
                'is_active' => true,
            ],
            [
                'id' => 4,
                'kode' => 'KMD-SEPATU',
                'nama' => 'Alas Kaki dan Sepatu Pengaman',
                'ruang_lingkup' => 'Pengujian Keselamatan Kerja Sol, Ketahanan Tekuk, & Daya Rekat Alas Kaki',
                'is_active' => true,
            ],
            [
                'id' => 5,
                'kode' => 'KMD-TKS',
                'nama' => 'Tekstil dan Barang Industri',
                'ruang_lingkup' => 'Pengujian Kuat Tarik Serat, Komposisi Bahan, & Ketahanan Luntur Warna',
                'is_active' => true,
            ],
        ];

        foreach ($defaultKomoditas as $kmd) {
            MasterKomoditasPengujian::updateOrCreate(
                ['id' => $kmd['id']],
                $kmd
            );
        }

        $this->command->info("Data fallback berhasil ditambahkan.");
    }
}
