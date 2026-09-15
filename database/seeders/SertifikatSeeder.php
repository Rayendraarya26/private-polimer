<?php

namespace Database\Seeders;

use App\Models\Db1\SysUser;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SertifikatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Cari user akun perusahaan@mailinator.com
        $user = SysUser::where('email', 'perusahaan@mailinator.com')->first();

        if (!$user) {
            $this->command->error("User perusahaan@mailinator.com tidak ditemukan. Jalankan UserSeeder terlebih dahulu.");
            return;
        }

        // Ambil ID pelanggan perusahaan jika ada
        $pelangganId = $user->pelanggan?->detail?->id ?? null;

        // 2. Pastikan Master Jenis Layanan "Sertifikasi" tersedia
        $masterJenis = MasterJenisLayanan::firstOrCreate(
            ['jenis_layanan' => 'Sertifikasi'],
            [
                'slug'      => Str::slug('Sertifikasi'),
                'is_active' => true,
            ]
        );

        // 3. Pastikan Master Lingkup Layanan Sertifikasi tersedia
        $lingkupData = [
            'smm' => [
                'lingkup'     => 'Sistem Manajemen Mutu (SNI ISO 9001:2015)',
                'slug'        => Str::slug('Sistem Manajemen Mutu (SNI ISO 9001:2015)'),
                'kapabilitas' => false,
                'is_active'   => true,
            ],
            'sml' => [
                'lingkup'     => 'Sistem Manajemen Lingkungan (SNI ISO 14001:2015)',
                'slug'        => Str::slug('Sistem Manajemen Lingkungan (SNI ISO 14001:2015)'),
                'kapabilitas' => false,
                'is_active'   => true,
            ],
            'sppt' => [
                'lingkup'     => 'Sertifikasi Produk Penggunaan Tanda SNI (SPPT SNI)',
                'slug'        => Str::slug('Sertifikasi Produk Penggunaan Tanda SNI (SPPT SNI)'),
                'kapabilitas' => false,
                'is_active'   => true,
            ],
            'hijau' => [
                'lingkup'     => 'Industri Hijau',
                'slug'        => Str::slug('Industri Hijau'),
                'kapabilitas' => false,
                'is_active'   => true,
            ],
        ];

        $lingkupModels = [];
        foreach ($lingkupData as $key => $item) {
            $lingkupModels[$key] = MasterLingkupLayanan::firstOrCreate(
                [
                    'jenis_layanan_id' => $masterJenis->id,
                    'lingkup'          => $item['lingkup'],
                ],
                [
                    'slug'        => $item['slug'],
                    'kapabilitas' => $item['kapabilitas'],
                    'is_active'   => $item['is_active'],
                ]
            );
        }

        // 4. Data Dummy Sertifikat Aktif untuk perusahaan@mailinator.com
        $riwayatSertifikat = [
            [
                'no_permohonan'          => 'SRT-2023-08001',
                'nomor_sertifikat'       => '081/BBKKP/ISO-9001/XI/2023',
                'lingkup'                => $lingkupModels['smm'],
                'tgl_order'              => now()->subMonths(10),
                'komoditi'               => 'Industri Barang dari Kulit dan Alas Kaki',
                'sni'                    => 'SNI ISO 9001:2015',
                'jumlah_karyawan_total'  => 120,
            ],
            [
                'no_permohonan'          => 'SRT-2023-11002',
                'nomor_sertifikat'       => '112/BBKKP/ISO-14001/XII/2023',
                'lingkup'                => $lingkupModels['sml'],
                'tgl_order'              => now()->subMonths(8),
                'komoditi'               => 'Pengolahan Karet dan Barang Karet',
                'sni'                    => 'SNI ISO 14001:2015',
                'jumlah_karyawan_total'  => 85,
            ],
            [
                'no_permohonan'          => 'SRT-2024-03003',
                'nomor_sertifikat'       => '035/BBKKP/SPPT-SNI/III/2024',
                'lingkup'                => $lingkupModels['sppt'],
                'tgl_order'              => now()->subMonths(5),
                'komoditi'               => 'Sepatu Pengaman dari Kulit dengan Sol Karet Cetak Vulkanisasi',
                'sni'                    => 'SNI 7079:2009',
                'jumlah_karyawan_total'  => 150,
            ],
            [
                'no_permohonan'          => 'SRT-2024-06004',
                'nomor_sertifikat'       => '062/BBKKP/SIH/VI/2024',
                'lingkup'                => $lingkupModels['hijau'],
                'tgl_order'              => now()->subMonths(2),
                'komoditi'               => 'Industri Penyamakan Kulit Ramah Lingkungan',
                'sni'                    => 'Standar Industri Hijau (SIH)',
                'jumlah_karyawan_total'  => 95,
            ],
        ];

        foreach ($riwayatSertifikat as $data) {
            // Hindari duplikasi jika seeder dijalankan berulang
            $existingPermohonan = Permohonan::where('no_permohonan', $data['no_permohonan'])->first();
            if ($existingPermohonan) {
                continue;
            }

            // A. Buat Header Permohonan dengan status DONE
            $permohonan = Permohonan::create([
                'id_pt_ins'        => $pelangganId,
                'no_permohonan'    => $data['no_permohonan'],
                'is_split_bill'    => false,
                'status_workflow'  => 'DONE',
                'status_bayar'     => 'LUNAS',
                'catatan_admin'    => 'Permohonan sertifikasi telah selesai dan sertifikat telah terbit.',
                'tgl_order'        => $data['tgl_order'],
                'created_by'       => $user->id,
                'updated_by'       => $user->id,
            ]);

            // B. Buat Form Sertifikasi
            $form = FormSertifikasi::create([
                'permohonan_id'         => $permohonan->id,
                'jenis_pengajuan'       => 'baru',
                'sertifikat_lama_nomor' => $data['nomor_sertifikat'],
                'komoditas_json'        => [
                    [
                        'nama' => $data['komoditi'],
                        'sni'  => $data['sni'],
                    ]
                ],
                'jumlah_karyawan_total' => $data['jumlah_karyawan_total'],
                'jumlah_manajemen'      => 10,
                'jumlah_administrasi'   => 15,
                'jumlah_operasional'    => $data['jumlah_karyawan_total'] - 25,
                'setuju_pernyataan'     => true,
            ]);

            // C. Buat Detail Permohonan (Menghubungkan Permohonan ke Lingkup & Form)
            DetailPermohonan::create([
                'permohonan_id'      => $permohonan->id,
                'lingkup_layanan_id' => $data['lingkup']->id,
                'formable_id'        => $form->id,
                'formable_type'      => FormSertifikasi::class,
            ]);
        }

        $this->command->info("Seeder riwayat sertifikat untuk perusahaan@mailinator.com berhasil dijalankan!");
    }
}
