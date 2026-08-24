<?php

namespace Database\Seeders;

use App\Enums\PelangganGender;
use App\Enums\PelangganJenisPelanggan;
use App\Enums\SysGroup;
use App\Models\Db1\Pelanggan;
use App\Models\Db1\PelangganPerorangan;
use App\Models\Db1\PelangganPerusahaan;
use App\Models\Db1\PelangganInstansi;
use App\Models\Db1\PertanyaanPelanggan;
use App\Models\Db1\PertanyaanPelangganPesan;
use App\Models\Db1\SettingBanner;
use App\Models\Db1\SysUser;
use App\Models\Db1\SysUserGroup;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\FormLsp;
use App\Models\Db2\FormPelatihan;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\FormSertifikasiItem;
use App\Models\Db2\FormSertifikasiPabrik;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummyPolimerSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('=== Seeding Diverse Mock Data for Permohonan & Tanya Jawab ===');

        // 0. Seed Setting Banner
        $banners = [
            [
                'order' => 1,
                'description' => 'Layanan Pengujian & Kalibrasi Laboratorium Mutu Polimer, Karet, Kulit, dan Plastik Terakreditasi KAN (ISO/IEC 17025).',
                'link' => '/service-requests/input',
                'image_path' => 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
                'is_active' => true,
            ],
            [
                'order' => 2,
                'description' => 'Sertifikasi Produk Penggunaan Tanda SNI (SPPT-SNI) & Sertifikasi Sistem Manajemen Mutu ISO 9001:2015 oleh Lembaga Sertifikasi Produk BBKKP.',
                'link' => '/service-requests/input',
                'image_path' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
                'is_active' => true,
            ],
            [
                'order' => 3,
                'description' => 'Bimbingan Teknis & Pelatihan Industri 4.0: Formulasi Kompon Karet, Polimer Hijau, serta Sistem Jaminan Halal Industri.',
                'link' => '/service-requests/input',
                'image_path' => 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
                'is_active' => true,
            ],
            [
                'order' => 4,
                'description' => 'Uji Kompetensi & Asesmen Sertifikasi Profesi Lembaga Sertifikasi Profesi (LSP) Pihak Kedua Terlisensi BNSP.',
                'link' => '/service-requests/input',
                'image_path' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
                'is_active' => true,
            ],
        ];

        foreach ($banners as $b) {
            SettingBanner::firstOrCreate(
                ['description' => $b['description']],
                [
                    'order' => $b['order'],
                    'link' => $b['link'],
                    'image_path' => $b['image_path'],
                    'is_active' => $b['is_active'],
                    'start_at' => Carbon::now()->subMonths(1),
                    'end_at' => Carbon::now()->addMonths(12),
                ]
            );
        }

        // 1. Dapatkan atau siapkan Users
        $adminUser = SysUser::where('email', 'dolkode@mailinator.com')->first() 
            ?? SysUser::where('name', 'Developer')->first()
            ?? SysUser::first();

        $pelangganPerusahaanUser = SysUser::where('email', 'perusahaan@mailinator.com')->first();
        $pelangganInstansiUser   = SysUser::where('email', 'instansi@mailinator.com')->first();
        $pelangganPeroranganUser = SysUser::where('email', 'perorangan@mailinator.com')->first();

        if (!$pelangganPerusahaanUser) {
            $pelangganPerusahaanUser = SysUser::create([
                'name' => 'PT Indorubber Polymer Tech',
                'email' => 'perusahaan@mailinator.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            SysUserGroup::create(['user_id' => $pelangganPerusahaanUser->id, 'group_id' => SysGroup::PELANGGAN, 'is_default' => 'yes']);
            $pelanggan = Pelanggan::create(['user_id' => $pelangganPerusahaanUser->id, 'jenis_pelanggan' => PelangganJenisPelanggan::BADAN_USAHA]);
            $detail = PelangganPerusahaan::create([
                'pelanggan_id' => $pelanggan->id,
                'nama' => 'PT Indorubber Polymer Tech',
                'alamat' => 'Kawasan Industri Jababeka V, Cikarang',
                'badan_hukum' => 'PT',
                'jenis' => 'Swasta Nasional',
                'pimpinan' => 'Ir. Hendri Gunawan',
                'surel' => 'perusahaan@mailinator.com',
                'whatsapp' => '081234567890',
                'npwp' => '01.234.567.8-012.000',
                'nib' => '9120001234567',
                'no_akta_pendirian' => 'AHU-00123.AH.01.01.2020',
            ]);
            $pelanggan->detail()->associate($detail)->save();
        }

        if (!$pelangganInstansiUser) {
            $pelangganInstansiUser = SysUser::create([
                'name' => 'Dinas Perindustrian Provinsi Jawa Tengah',
                'email' => 'instansi@mailinator.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            SysUserGroup::create(['user_id' => $pelangganInstansiUser->id, 'group_id' => SysGroup::PELANGGAN, 'is_default' => 'yes']);
            $pelanggan = Pelanggan::create(['user_id' => $pelangganInstansiUser->id, 'jenis_pelanggan' => PelangganJenisPelanggan::INSTANSI_PEMERINTAH]);
            $detail = PelangganInstansi::create([
                'pelanggan_id' => $pelanggan->id,
                'nama' => 'Dinas Perindustrian Provinsi Jawa Tengah',
                'pimpinan' => 'Dra. Siti Nurhaliza, M.Si',
                'surel' => 'instansi@mailinator.com',
                'whatsapp' => '082345678901',
                'npwp' => '00.111.222.3-444.000',
                'nib' => '1234567890123',
            ]);
            $pelanggan->detail()->associate($detail)->save();
        }

        if (!$pelangganPeroranganUser) {
            $pelangganPeroranganUser = SysUser::create([
                'name' => 'Ahmad Zulfikar',
                'email' => 'perorangan@mailinator.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            SysUserGroup::create(['user_id' => $pelangganPeroranganUser->id, 'group_id' => SysGroup::PELANGGAN, 'is_default' => 'yes']);
            $pelanggan = Pelanggan::create(['user_id' => $pelangganPeroranganUser->id, 'jenis_pelanggan' => PelangganJenisPelanggan::PERORANGAN]);
            $detail = PelangganPerorangan::create([
                'pelanggan_id' => $pelanggan->id,
                'nama' => 'Ahmad Zulfikar',
                'alamat' => 'Jl. Ir. H. Juanda No. 45, Bandung',
                'jenis_kelamin' => PelangganGender::LAKI,
                'kewarganegaraan' => 'WNI',
                'nik' => '3273010101850001',
                'surel' => 'perorangan@mailinator.com',
                'whatsapp' => '085678901234',
                'npwp' => '09.876.543.2-123.000',
                'nib' => '0987654321098',
            ]);
            $pelanggan->detail()->associate($detail)->save();
        }

        // 2. Master Layanan & Lingkup
        $layananSertifikasi = MasterJenisLayanan::firstOrCreate(
            ['slug' => 'sertifikasi'],
            ['jenis_layanan' => 'Sertifikasi Produk & Sistem', 'is_active' => true]
        );
        $lingkupSni = MasterLingkupLayanan::firstOrCreate(
            ['jenis_layanan_id' => $layananSertifikasi->id, 'slug' => 'sppt-sni'],
            ['lingkup' => 'Sertifikasi Produk Penggunaan Tanda SNI (SPPT SNI)', 'kapabilitas' => true, 'is_active' => true]
        );
        $lingkupIso = MasterLingkupLayanan::firstOrCreate(
            ['jenis_layanan_id' => $layananSertifikasi->id, 'slug' => 'iso-9001'],
            ['lingkup' => 'Sertifikasi Sistem Manajemen Mutu (ISO 9001)', 'kapabilitas' => true, 'is_active' => true]
        );

        $layananLsp = MasterJenisLayanan::firstOrCreate(
            ['slug' => 'sertifikasi-profesi-lsp'],
            ['jenis_layanan' => 'Sertifikasi Profesi (LSP)', 'is_active' => true]
        );
        $lingkupLsp = MasterLingkupLayanan::firstOrCreate(
            ['jenis_layanan_id' => $layananLsp->id, 'slug' => 'transformasi-industri-40'],
            ['lingkup' => 'Transformasi Industri 4.0', 'kapabilitas' => false, 'is_active' => true]
        );

        $layananPelatihan = MasterJenisLayanan::firstOrCreate(
            ['slug' => 'pelatihan'],
            ['jenis_layanan' => 'Pelatihan', 'is_active' => true]
        );
        $lingkupPelatihanHalal = MasterLingkupLayanan::firstOrCreate(
            ['jenis_layanan_id' => $layananPelatihan->id, 'slug' => 'halal-reguler'],
            ['lingkup' => 'Halal Reguler', 'kapabilitas' => true, 'is_active' => true]
        );

        // 3. SEED PERMOHONAN DIVERSE MOCK DATA
        $mockPermohonans = [
            [
                'no' => 'CERT-202608-001',
                'user' => $pelangganPerusahaanUser,
                'status' => 'IN_REVIEW',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subDays(1),
                'type' => 'LSPro',
                'lingkup' => $lingkupSni,
                'produk' => 'SNI 0076:2008 Tali Rami & Karet Sintetis',
                'item_bayar' => 'Biaya Permohonan & Asesmen Tahap I LSPro',
                'harga' => 4500000,
            ],
            [
                'no' => 'CERT-202608-002',
                'user' => $pelangganPerusahaanUser,
                'status' => 'PROCESS',
                'status_bayar' => 'LUNAS',
                'tgl_order' => Carbon::now()->subDays(5),
                'type' => 'LSPro',
                'lingkup' => $lingkupIso,
                'produk' => 'ISO 9001:2015 Sistem Manajemen Mutu Industri Karet',
                'item_bayar' => 'Audit Sertifikasi Sistem Manajemen Mutu',
                'harga' => 12500000,
                'invoice' => 'INV/BBKKP/2026/08/002',
                'kuitansi' => 'KWT/BBKKP/2026/08/002',
            ],
            [
                'no' => 'CERT-202608-003',
                'user' => $pelangganPerusahaanUser,
                'status' => 'PEMBAYARAN',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subDays(2),
                'type' => 'LSPro',
                'lingkup' => $lingkupSni,
                'produk' => 'SNI 06-0101-2002 Ban Sepeda Motor Vulkanisir',
                'item_bayar' => 'Penerbitan Billing PNBP SPPT-SNI',
                'harga' => 7800000,
                'invoice' => 'INV/BBKKP/2026/08/003',
            ],
            [
                'no' => 'CERT-202607-004',
                'user' => $pelangganPerusahaanUser,
                'status' => 'DONE',
                'status_bayar' => 'LUNAS',
                'tgl_order' => Carbon::now()->subDays(25),
                'type' => 'LSPro',
                'lingkup' => $lingkupSni,
                'produk' => 'SNI ISO 4074:2014 Sarung Tangan & Alat Kesehatan Polimer',
                'item_bayar' => 'Paket Lengkap Sertifikasi SPPT-SNI',
                'harga' => 18000000,
                'invoice' => 'INV/BBKKP/2026/07/045',
                'kuitansi' => 'KWT/BBKKP/2026/07/045',
                'is_feedback' => true,
            ],
            [
                'no' => 'CERT-202608-005',
                'user' => $pelangganPerusahaanUser,
                'status' => 'REVISI',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subDays(3),
                'type' => 'LSPro',
                'lingkup' => $lingkupSni,
                'produk' => 'SNI 06-7031-2004 Kompon Karet Tapak Ban',
                'item_bayar' => 'Biaya Administrasi & Verifikasi Dokumen',
                'harga' => 3500000,
                'catatan' => 'Mohon lampirkan sertifikat kalibrasi mesin press vulkanisasi dan diagram alir produksi yang telah ditandatangani.',
            ],
            [
                'no' => 'CERT-202608-006',
                'user' => $pelangganPerusahaanUser,
                'status' => 'PERMOHONAN',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subHours(4),
                'type' => 'LSPro',
                'lingkup' => $lingkupSni,
                'produk' => 'SNI 06-4965-1999 Selang Karet LPG',
                'item_bayar' => 'Pendaftaran SPPT SNI Selang LPG',
                'harga' => 6000000,
            ],
            [
                'no' => 'CERT-202608-007',
                'user' => $pelangganPerusahaanUser,
                'status' => 'DITOLAK',
                'status_bayar' => 'BATAL',
                'tgl_order' => Carbon::now()->subDays(8),
                'type' => 'LSPro',
                'lingkup' => $lingkupSni,
                'produk' => 'Komoditas Plastik Kemasan Non-Standar',
                'item_bayar' => 'Biaya Registrasi Permohonan',
                'harga' => 2000000,
                'catatan' => 'Dokumen NIB dan izin edar tidak sesuai dengan peruntukan industri polimer berstandar nasional.',
            ],
            // LSP (Sertifikasi Profesi)
            [
                'no' => 'LSP-202608-001',
                'user' => $pelangganPeroranganUser,
                'status' => 'IN_REVIEW',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subDays(2),
                'type' => 'LSP',
                'lingkup' => $lingkupLsp,
                'produk' => 'Skema Transformasi Industri 4.0 - Operator Smart Factory Polimer',
                'item_bayar' => 'Uji Kompetensi LSP Transformasi Industri 4.0',
                'harga' => 1500000,
            ],
            [
                'no' => 'LSP-202608-002',
                'user' => $pelangganPeroranganUser,
                'status' => 'PROCESS',
                'status_bayar' => 'LUNAS',
                'tgl_order' => Carbon::now()->subDays(7),
                'type' => 'LSP',
                'lingkup' => $lingkupLsp,
                'produk' => 'Skema Asesmen Kompetensi Teknisi Vulkanisasi Karet',
                'item_bayar' => 'Asesmen & Penerbitan Sertifikat BNSP',
                'harga' => 1750000,
                'invoice' => 'INV/LSP/2026/08/011',
                'kuitansi' => 'KWT/LSP/2026/08/011',
            ],
            [
                'no' => 'LSP-202607-003',
                'user' => $pelangganPeroranganUser,
                'status' => 'DONE',
                'status_bayar' => 'LUNAS',
                'tgl_order' => Carbon::now()->subDays(30),
                'type' => 'LSP',
                'lingkup' => $lingkupLsp,
                'produk' => 'Skema Manajer Pengendalian Mutu Laboratorium Polimer',
                'item_bayar' => 'Uji Sertifikasi Profesi Level 6',
                'harga' => 2500000,
                'invoice' => 'INV/LSP/2026/07/005',
                'kuitansi' => 'KWT/LSP/2026/07/005',
                'is_feedback' => true,
            ],
            // Pelatihan / Bimtek
            [
                'no' => 'TRN-202608-001',
                'user' => $pelangganInstansiUser,
                'status' => 'PERMOHONAN',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subHours(8),
                'type' => 'Pelatihan',
                'lingkup' => $lingkupPelatihanHalal,
                'produk' => 'Bimtek Penyelia Halal Industri Pengolahan Karet & Plastik',
                'item_bayar' => 'Paket Pelatihan Bimtek Halal 3 Hari (5 Peserta)',
                'harga' => 7500000,
            ],
            [
                'no' => 'TRN-202608-002',
                'user' => $pelangganInstansiUser,
                'status' => 'PEMBAYARAN',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subDays(4),
                'type' => 'Pelatihan',
                'lingkup' => $lingkupPelatihanHalal,
                'produk' => 'Pelatihan Uji Karakterisasi Material Polimer & FTIR',
                'item_bayar' => 'Biaya Pelatihan Teknis Laboratorium',
                'harga' => 5000000,
                'invoice' => 'INV/TRN/2026/08/009',
            ],
            [
                'no' => 'TRN-202607-003',
                'user' => $pelangganInstansiUser,
                'status' => 'DONE',
                'status_bayar' => 'LUNAS',
                'tgl_order' => Carbon::now()->subDays(20),
                'type' => 'Pelatihan',
                'lingkup' => $lingkupPelatihanHalal,
                'produk' => 'Bimtek Penerapan Standar Industri Hijau Sektor Polimer',
                'item_bayar' => 'Bimtek Industri Hijau Angkatan I',
                'harga' => 10000000,
                'invoice' => 'INV/TRN/2026/07/021',
                'kuitansi' => 'KWT/TRN/2026/07/021',
                'is_feedback' => true,
            ],
            // Additional permohonan for Admin / Developer User (testing portal)
            [
                'no' => 'CERT-202608-008',
                'user' => $adminUser,
                'status' => 'PROCESS',
                'status_bayar' => 'LUNAS',
                'tgl_order' => Carbon::now()->subDays(3),
                'type' => 'LSPro',
                'lingkup' => $lingkupSni,
                'produk' => 'SNI 06-0101-2002 Uji Kompon Polimer Elastomer',
                'item_bayar' => 'Sertifikasi Mutu Laboratorium Terpadu',
                'harga' => 8500000,
                'invoice' => 'INV/DEV/2026/08/001',
                'kuitansi' => 'KWT/DEV/2026/08/001',
            ],
            [
                'no' => 'LSP-202608-004',
                'user' => $adminUser,
                'status' => 'IN_REVIEW',
                'status_bayar' => 'BELUM',
                'tgl_order' => Carbon::now()->subDays(1),
                'type' => 'LSP',
                'lingkup' => $lingkupLsp,
                'produk' => 'Skema Asesor Kompetensi Bidang Material Polimer',
                'item_bayar' => 'Asesmen Sertifikasi Profesi Level 7',
                'harga' => 3000000,
            ],
        ];

        foreach ($mockPermohonans as $item) {
            $permohonan = Permohonan::firstOrCreate(
                ['no_permohonan' => $item['no']],
                [
                    'status_workflow' => $item['status'],
                    'status_bayar' => $item['status_bayar'],
                    'tgl_order' => $item['tgl_order'],
                    'catatan_admin' => $item['catatan'] ?? null,
                    'invoice_number' => $item['invoice'] ?? null,
                    'invoice_file' => isset($item['invoice']) ? 'invoices/' . $item['no'] . '.pdf' : null,
                    'invoice_generated_at' => isset($item['invoice']) ? $item['tgl_order']->copy()->addHours(2) : null,
                    'kuitansi_number' => $item['kuitansi'] ?? null,
                    'kuitansi_file' => isset($item['kuitansi']) ? 'kuitansi/' . $item['no'] . '.pdf' : null,
                    'kuitansi_generated_at' => isset($item['kuitansi']) ? $item['tgl_order']->copy()->addHours(6) : null,
                    'is_given_feedback' => $item['is_feedback'] ?? false,
                    'feedback_json' => ($item['is_feedback'] ?? false) ? ['rating' => 5, 'testimoni' => 'Proses sangat profesional dan tepat waktu.'] : null,
                    'feedback_at' => ($item['is_feedback'] ?? false) ? $item['tgl_order']->copy()->addDays(3) : null,
                    'created_by' => $item['user']->id,
                ]
            );

            // Buat Detail Pembayaran
            DetailPembayaran::firstOrCreate(
                ['permohonan_id' => $permohonan->id],
                [
                    'item_bayar' => $item['item_bayar'],
                    'harga_satuan' => $item['harga'],
                    'kuantitas' => 1,
                    'subtotal' => $item['harga'],
                    'tgl_bayar' => $item['status_bayar'] === 'LUNAS' ? $item['tgl_order']->copy()->addHours(4) : null,
                ]
            );

            // Form Spesifik sesuai jenis
            if ($item['type'] === 'LSPro') {
                $form = FormSertifikasi::firstOrCreate(
                    ['permohonan_id' => $permohonan->id],
                    [
                        'tipe_pengajuan' => 'BARU',
                        'nama_perusahaan' => 'PT Indorubber Polymer Tech',
                        'alamat_kantor' => 'Kawasan Industri Jababeka V, Cikarang',
                        'kontak_person' => 'Ir. Hendri Gunawan',
                        'no_telp' => '021-89831234',
                        'no_whatsapp' => '081234567890',
                        'email' => 'perusahaan@mailinator.com',
                        'kuesioner_kelayakan' => [
                            'nomor_akta_pendirian' => 'AHU-00123.AH.01.01.2020',
                            'nama_pemilik' => 'Hendri Gunawan',
                            'nama_pimpinan' => 'Hendri Gunawan',
                        ],
                        'dokumen_persyaratan' => [
                            ['label' => 'NIB', 'file' => 'dummy/nib.pdf'],
                            ['label' => 'NPWP Perusahaan', 'file' => 'dummy/npwp.pdf'],
                        ],
                    ]
                );

                FormSertifikasiItem::firstOrCreate(
                    ['form_sertifikasi_id' => $form->id],
                    [
                        'nama_produk' => $item['produk'],
                        'merk_dagang' => 'INDORUBBER',
                        'tipe_jenis' => 'Grade Industri Premium',
                        'standar_sni_iso' => $item['produk'],
                        'ruang_lingkup' => 'Pabrikasi Kompon & Barang Jadi Karet',
                        'estimasi_tarif' => $item['harga'],
                    ]
                );

                FormSertifikasiPabrik::firstOrCreate(
                    ['form_sertifikasi_id' => $form->id],
                    [
                        'nama_pabrik' => 'Pabrik Utama Cikarang',
                        'alamat_pabrik' => 'Kawasan Industri Jababeka Blok C-12, Cikarang',
                    ]
                );

                DetailPermohonan::firstOrCreate(
                    ['permohonan_id' => $permohonan->id],
                    [
                        'lingkup_layanan_id' => $item['lingkup']->id,
                        'formable_id' => $form->id,
                        'formable_type' => FormSertifikasi::class,
                    ]
                );
            } elseif ($item['type'] === 'LSP') {
                $form = FormLsp::firstOrCreate(
                    ['permohonan_id' => $permohonan->id],
                    [
                        'nama_lengkap' => 'Ahmad Zulfikar',
                        'gender' => 'Laki-Laki',
                        'tempat_lahir' => 'Bandung',
                        'nik_peserta' => '3273010101850001',
                        'tanggal_lahir' => '1985-01-01',
                        'kewarganegaraan' => 'WNI',
                        'kode_pos' => '40132',
                        'pendidikan' => 'S1 Teknik Kimia',
                        'whatsapp' => '085678901234',
                        'email' => 'perorangan@mailinator.com',
                        'alamat_peserta' => 'Jl. Ir. H. Juanda No. 45, Bandung',
                        'ktp_peserta' => 'dummy/ktp.pdf',
                        'nama_instansi' => 'PT Polimer Solusi Mandiri',
                        'alamat_instansi' => 'Jl. Soekarno Hatta No. 500, Bandung',
                        'jenis_produk' => 'Peralatan Polimer & Plastik',
                        'jabatan' => 'Senior Quality Engineer',
                        'pengalaman_kerja' => '7 Tahun',
                        'setuju_syarat' => true,
                    ]
                );

                DetailPermohonan::firstOrCreate(
                    ['permohonan_id' => $permohonan->id],
                    [
                        'lingkup_layanan_id' => $item['lingkup']->id,
                        'formable_id' => $form->id,
                        'formable_type' => FormLsp::class,
                    ]
                );
            } elseif ($item['type'] === 'Pelatihan') {
                $form = FormPelatihan::firstOrCreate(
                    ['permohonan_id' => $permohonan->id],
                    [
                        'nama_lengkap' => 'Dra. Siti Nurhaliza, M.Si',
                        'gender' => 'Perempuan',
                        'tempat_lahir' => 'Semarang',
                        'tanggal_lahir' => '1980-05-12',
                        'pendidikan' => 'S2 Magister Manajemen Lingkungan',
                        'whatsapp' => '082345678901',
                        'email' => 'instansi@mailinator.com',
                        'agama' => 'Islam',
                        'alamat_peserta' => 'Jl. Pahlawan No. 10, Semarang',
                        'nik_peserta' => '3374010505800002',
                        'ktp_peserta' => 'dummy/ktp_dinas.pdf',
                        'foto_peserta' => 'dummy/foto.jpg',
                        'nama_instansi' => 'Dinas Perindustrian Provinsi Jawa Tengah',
                        'alamat_instansi' => 'Jl. Pemuda No. 120, Semarang',
                        'jenis_produk' => 'Bimbingan & Fasilitasi IKM Karet',
                        'masalah_materi' => 'Penguatan sertifikasi halal dan kompetensi teknis pada sentra IKM polimer',
                        'hal_dipelajari' => 'Audit sistem jaminan produk halal dan SNI ISO/IEC 17065',
                        'setuju_syarat' => true,
                    ]
                );

                DetailPermohonan::firstOrCreate(
                    ['permohonan_id' => $permohonan->id],
                    [
                        'lingkup_layanan_id' => $item['lingkup']->id,
                        'formable_id' => $form->id,
                        'formable_type' => FormPelatihan::class,
                    ]
                );
            }
        }

        // 4. SEED TANYA JAWAB (TIKET HELPDESK) DIVERSE MOCK DATA
        $pelangganPerusahaan = Pelanggan::where('user_id', $pelangganPerusahaanUser->id)->first();
        $pelangganInstansi   = Pelanggan::where('user_id', $pelangganInstansiUser->id)->first();
        $pelangganPerorangan = Pelanggan::where('user_id', $pelangganPeroranganUser->id)->first();

        $ticketsData = [
            [
                'pelanggan' => $pelangganPerusahaan,
                'user' => $pelangganPerusahaanUser,
                'layanan' => 'CERT-202608-001',
                'topik' => 'Pengujian',
                'status' => 'opened',
                'chats' => [
                    [
                        'sender' => $pelangganPerusahaanUser,
                        'pesan' => 'Selamat pagi tim Balai BBKKP, kami ingin menanyakan apakah untuk uji tarik dan ketahanan ozon karet pada permohonan CERT-202608-001 dapat diajukan skema percepatan (fast-track)?',
                        'created_at' => Carbon::now()->subDays(1)->subHours(3),
                    ],
                    [
                        'sender' => $adminUser,
                        'pesan' => 'Selamat siang Ir. Hendri, skema percepatan (fast-track) tersedia dengan penyesuaian tarif PNBP sesuai PP No. 54. Estimasi pengujian dapat diselesaikan dalam 3 hari kerja setelah sampel diterima laboratorium.',
                        'created_at' => Carbon::now()->subDays(1)->subHours(1),
                    ],
                    [
                        'sender' => $pelangganPerusahaanUser,
                        'pesan' => 'Baik terima kasih atas konfirmasinya. Sampel fisik akan kami kirimkan via kurir ekspres hari ini.',
                        'created_at' => Carbon::now()->subHours(5),
                    ],
                ],
            ],
            [
                'pelanggan' => $pelangganInstansi,
                'user' => $pelangganInstansiUser,
                'layanan' => 'TRN-202608-001',
                'topik' => 'Pelatihan',
                'status' => 'closed',
                'closed_by' => $adminUser->id,
                'is_review' => 'yes',
                'rating' => 5,
                'testimoni' => 'Respon admin helpdesk sangat cepat dan penjelasan teknisnya sangat memuaskan!',
                'chats' => [
                    [
                        'sender' => $pelangganInstansiUser,
                        'pesan' => 'Apakah masih tersedia kuota untuk 15 orang peserta dari dinas kami pada Bimtek Penyelia Halal batch Agustus ini?',
                        'created_at' => Carbon::now()->subDays(4),
                    ],
                    [
                        'sender' => $adminUser,
                        'pesan' => 'Selamat siang Ibu Siti, kuota untuk batch Agustus masih tersedia 20 slot. Silakan melanjutkan proses pengajuan pendaftaran melalui portal.',
                        'created_at' => Carbon::now()->subDays(4)->addHours(2),
                    ],
                    [
                        'sender' => $pelangganInstansiUser,
                        'pesan' => 'Terima kasih atas informasinya, kuota telah kami konfirmasi dan seluruh peserta telah kami daftarkan.',
                        'created_at' => Carbon::now()->subDays(3),
                    ],
                ],
            ],
            [
                'pelanggan' => $pelangganPerusahaan,
                'user' => $pelangganPerusahaanUser,
                'layanan' => 'CERT-202608-005',
                'topik' => 'Sertifikasi Produk',
                'status' => 'opened',
                'chats' => [
                    [
                        'sender' => $pelangganPerusahaanUser,
                        'pesan' => 'Terkait catatan revisi pada permohonan CERT-202608-005, apakah sertifikat kalibrasi mesin vulkanisasi yang diterbitkan laboratorium eksternal terakreditasi KAN dapat diterima?',
                        'created_at' => Carbon::now()->subHours(6),
                    ],
                    [
                        'sender' => $adminUser,
                        'pesan' => 'Tentu bisa Bapak Hendri, sepanjang sertifikat kalibrasi masih berlaku (masa kalibrasi maks 1 tahun) dan mencantumkan logo KAN / nomor akreditasi LK-XXX-IDN.',
                        'created_at' => Carbon::now()->subHours(3),
                    ],
                ],
            ],
            [
                'pelanggan' => $pelangganPerorangan,
                'user' => $pelangganPeroranganUser,
                'layanan' => 'LSP-202608-001',
                'topik' => 'Sertifikasi Profesi',
                'status' => 'opened',
                'chats' => [
                    [
                        'sender' => $pelangganPeroranganUser,
                        'pesan' => 'Halo tim LSP BBKKP, apakah pelaksanaan uji asesmen kompetensi skema Transformasi Industri 4.0 dilakukan secara luring atau daring (online)?',
                        'created_at' => Carbon::now()->subHours(2),
                    ],
                ],
            ],
            [
                'pelanggan' => $pelangganPerusahaan,
                'user' => $pelangganPerusahaanUser,
                'layanan' => 'CERT-202608-003',
                'topik' => 'Pembayaran',
                'status' => 'opened',
                'chats' => [
                    [
                        'sender' => $pelangganPerusahaanUser,
                        'pesan' => 'Mohon bantuan untuk batas waktu masa aktif Virtual Account BNI pada invoice INV/BBKKP/2026/08/003 karena sistem keuangan kami membutuhkan waktu approval 2 hari kerja.',
                        'created_at' => Carbon::now()->subDays(1),
                    ],
                    [
                        'sender' => $adminUser,
                        'pesan' => 'Masa berlaku VA Simponi / BNI secara default aktif selama 7x24 jam. Jika melewati batas waktu tersebut, kode billing baru dapat diterbitkan kembali secara otomatis melalui portal.',
                        'created_at' => Carbon::now()->subDays(1)->addHours(1),
                    ],
                ],
            ],
            [
                'pelanggan' => $pelangganInstansi,
                'user' => $pelangganInstansiUser,
                'layanan' => null,
                'topik' => 'Umum',
                'status' => 'closed',
                'closed_by' => $adminUser->id,
                'is_review' => 'yes',
                'rating' => 5,
                'testimoni' => 'Informasi jam operasional dan penerimaan sampel sangat jelas dan ramah.',
                'chats' => [
                    [
                        'sender' => $pelangganInstansiUser,
                        'pesan' => 'Selamat pagi, mohon informasi jam penerimaan sampel fisik di Pelayanan Terpadu Satu Pintu (PTSP) Balai BBKKP Yogyakarta.',
                        'created_at' => Carbon::now()->subDays(10),
                    ],
                    [
                        'sender' => $adminUser,
                        'pesan' => 'Selamat pagi, loket PTSP BBKKP buka Senin - Kamis pukul 08.00 - 15.30 WIB dan Jumat pukul 08.00 - 15.00 WIB. Istirahat pukul 12.00 - 13.00 WIB.',
                        'created_at' => Carbon::now()->subDays(10)->addHour(),
                    ],
                ],
            ],
            [
                'pelanggan' => $pelangganPerorangan,
                'user' => $pelangganPeroranganUser,
                'layanan' => 'LSP-202607-003',
                'topik' => 'Sertifikasi Profesi',
                'status' => 'closed',
                'closed_by' => $adminUser->id,
                'is_review' => 'yes',
                'rating' => 5,
                'testimoni' => 'Sertifikat kompetensi BNSP sudah diterima dengan baik via pos. Terima kasih BBKKP!',
                'chats' => [
                    [
                        'sender' => $pelangganPeroranganUser,
                        'pesan' => 'Selamat sore, sertifikat BNSP saya atas nama Ahmad Zulfikar apakah sudah dikirimkan nomor resi kurirnya?',
                        'created_at' => Carbon::now()->subDays(15),
                    ],
                    [
                        'sender' => $adminUser,
                        'pesan' => 'Selamat sore Mas Ahmad, paket sertifikat telah dikirim via Pos Indonesia dengan No Resi: POS-BBKKP-992182.',
                        'created_at' => Carbon::now()->subDays(15)->addHours(2),
                    ],
                ],
            ],
        ];

        foreach ($ticketsData as $td) {
            $pertanyaan = PertanyaanPelanggan::create([
                'pelanggan_id' => $td['pelanggan']->id,
                'layanan' => $td['layanan'],
                'topik' => $td['topik'],
                'status' => $td['status'],
                'closed_by' => $td['closed_by'] ?? null,
                'is_review' => $td['is_review'] ?? 'no',
                'rating' => $td['rating'] ?? null,
                'testimoni' => $td['testimoni'] ?? null,
            ]);

            foreach ($td['chats'] as $chat) {
                PertanyaanPelangganPesan::create([
                    'pertanyaan_id' => $pertanyaan->id,
                    'created_by' => $chat['sender']->id,
                    'pesan' => $chat['pesan'],
                    'is_replied' => $td['status'] === 'closed' ? 'yes' : 'no',
                    'created_at' => $chat['created_at'],
                    'updated_at' => $chat['created_at'],
                ]);
            }
        }

        $this->command->info('=== Dummy Data Permohonan & Tanya Jawab Successfully Seeded! ===');
    }
}
