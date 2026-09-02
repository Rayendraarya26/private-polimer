<?php

namespace Database\Seeders;

use App\Models\Db2\MasterKomoditi;
use App\Models\Db2\MasterLingkupLayanan;
use Illuminate\Database\Seeder;

class MasterKomoditiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua lingkup layanan yang ada
        $lingkups = MasterLingkupLayanan::all();

        $getLingkupId = function (array $keywords) use ($lingkups) {
            foreach ($keywords as $kw) {
                $found = $lingkups->first(function ($item) use ($kw) {
                    return stripos($item->lingkup, $kw) !== false || stripos($item->slug ?? '', $kw) !== false;
                });
                if ($found) {
                    return $found->id;
                }
            }
            return null;
        };

        $spptId          = $getLingkupId(['SPPT', 'tanda sni', 'produk']);
        $halalRegId      = $getLingkupId(['Halal Reguler', 'halal-reguler']);
        $halalUmkId      = $getLingkupId(['Halal UMK', 'halal-umk']);
        $iso9001Id       = $getLingkupId(['ISO 9001', 'Manajemen Mutu']);
        $iso14001Id      = $getLingkupId(['ISO 14001', 'Lingkungan']);
        $industriHijauId = $getLingkupId(['Industri Hijau', 'hijau']);
        $industri4Id     = $getLingkupId(['Industri 4.0', 'Transformasi']);

        $dataByLingkup = [
            // 1. SPPT SNI
            $spptId => [
                ['nama_komoditi' => 'Sepatu Kulit Kasual / Formal', 'nomor_sni' => 'SNI 0111:2009', 'deskripsi' => 'Sepatu berbahan dasar kulit untuk penggunaan umum dan formal.'],
                ['nama_komoditi' => 'Sepatu Pengaman (Safety Shoes)', 'nomor_sni' => 'SNI 7079:2009', 'deskripsi' => 'Sepatu pengaman kerja dengan pelindung jari kaki baja / komposit.'],
                ['nama_komoditi' => 'Kulit Tersamak (Bahan Baku Kulit)', 'nomor_sni' => 'SNI 0234:1989', 'deskripsi' => 'Kulit hasil proses penyamakan krom / nabati sebagai bahan baku industri.'],
                ['nama_komoditi' => 'Jaket Kulit', 'nomor_sni' => 'SNI 4500:2001', 'deskripsi' => 'Pakaian pelindung / kasual berbahan kulit tersamak.'],
                ['nama_komoditi' => 'Ban Kendaraan Bermotor', 'nomor_sni' => 'SNI 0101:2012', 'deskripsi' => 'Ban luar untuk kendaraan bermotor roda dua maupun roda empat.'],
                ['nama_komoditi' => 'Ban Dalam Kendaraan Bermotor', 'nomor_sni' => 'SNI 0181:2001', 'deskripsi' => 'Ban dalam karet untuk kendaraan bermotor.'],
                ['nama_komoditi' => 'Sarung Tangan Karet Medis / Pemeriksaan', 'nomor_sni' => 'SNI 16-1672-1989', 'deskripsi' => 'Sarung tangan lateks/nitril sekali pakai untuk keperluan medis.'],
                ['nama_komoditi' => 'Bantalan Karet Jembatan (Elastomeric Bearing Pad)', 'nomor_sni' => 'SNI 3967:2014', 'deskripsi' => 'Bantalan karet penahan beban dan getaran untuk konstruksi jembatan.'],
                ['nama_komoditi' => 'Pipa PVC / Polimer untuk Air Minum', 'nomor_sni' => 'SNI 0084:2002', 'deskripsi' => 'Pipa termoplastik polivinil klorida untuk saluran distribusi air minum.'],
                ['nama_komoditi' => 'Barang Plastik / Kemasan Pangan Polimer', 'nomor_sni' => 'SNI 7615:2010', 'deskripsi' => 'Kemasan makanan dan minuman berbahan polimer aman pangan (food grade).'],
                ['nama_komoditi' => 'Helm Pengendara Kendaraan Bermotor', 'nomor_sni' => 'SNI 1811:2007', 'deskripsi' => 'Pelindung kepala pengendara sepeda motor standar nasional.'],
            ],

            // 2. Halal Reguler
            $halalRegId => [
                ['nama_komoditi' => 'Kemasan Pangan Berbasis Polimer / Plastik', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Kemasan pangan plastik bersertifikasi halal.'],
                ['nama_komoditi' => 'Gelatin dan Kolagen Berbahan Baku Kulit', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Bahan penolong/tambahan pangan berbasis gelatin halal.'],
                ['nama_komoditi' => 'Barang Konsumsi Karet & Lateks (Peralatan Makan/Bayi)', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Peralatan makan, dot, dan perlengkapan bayi berbahan silikon/karet.'],
                ['nama_komoditi' => 'Produk Perawatan & Kosmetik Berbasis Polimer', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Komponen wadah dan aplikator kosmetik bersertifikasi halal.'],
            ],

            // 3. Halal UMK
            $halalUmkId => [
                ['nama_komoditi' => 'Kemasan Makanan / Minuman Plastik Skala UMK', 'nomor_sni' => 'SJPH Halal Self-Declare', 'deskripsi' => 'Kemasan kantong, pouch, atau cup polimer untuk pelaku UMK.'],
                ['nama_komoditi' => 'Kerajinan & Aksesoris Kulit Skala Kecil', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Produk kerajinan dan dompet/sepatu kulit skala mikro dan kecil.'],
                ['nama_komoditi' => 'Peralatan Dapur Plastik Rumah Tangga UMK', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Wadah makan dan perabot dapur plastik food grade UMK.'],
            ],

            // 4. ISO 9001 (Sistem Manajemen Mutu)
            $iso9001Id => [
                ['nama_komoditi' => 'Industri Pengolahan Karet & Barang Karet', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Penerapan sistem manajemen mutu industri manufaktur karet.'],
                ['nama_komoditi' => 'Industri Penyamakan Kulit & Barang Kulit', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Penerapan sistem manajemen mutu industri penyamakan dan alas kaki.'],
                ['nama_komoditi' => 'Industri Plastik, Polimer & Kemasan', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Penerapan sistem manajemen mutu manufaktur plastik & masterbatch.'],
                ['nama_komoditi' => 'Industri Fabrikasi & Komponen Otomotif Berbasis Karet/Plastik', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Manajemen mutu manufaktur komponen teknik.'],
            ],

            // 5. ISO 14001 (Sistem Manajemen Lingkungan)
            $iso14001Id => [
                ['nama_komoditi' => 'Industri Daur Ulang Plastik & Polimer (Recycling)', 'nomor_sni' => 'SNI ISO 14001:2015', 'deskripsi' => 'Sistem manajemen lingkungan daur ulang cacahan dan pelet plastik.'],
                ['nama_komoditi' => 'Industri Penyamakan Kulit (LWG / Pengelolaan Limbah)', 'nomor_sni' => 'SNI ISO 14001:2015', 'deskripsi' => 'Sistem manajemen lingkungan fasilitas penyamakan kulit dan IPAL.'],
                ['nama_komoditi' => 'Industri Pengolahan Lateks & Karet Alam', 'nomor_sni' => 'SNI ISO 14001:2015', 'deskripsi' => 'Manajemen lingkungan industri pengolahan bahan mentah karet.'],
            ],

            // 6. Industri Hijau
            $industriHijauId => [
                ['nama_komoditi' => 'Industri Karet Remah (Crumb Rubber) Hijau', 'nomor_sni' => 'SIH Kemenperin', 'deskripsi' => 'Sertifikasi industri hijau untuk pabrik pengolahan crumb rubber.'],
                ['nama_komoditi' => 'Industri Penyamakan Kulit Ramah Lingkungan', 'nomor_sni' => 'SIH Kemenperin', 'deskripsi' => 'Standar industri hijau penyamakan kulit hemat air dan bahan kimia.'],
                ['nama_komoditi' => 'Industri Barang Plastik Daur Ulang & Biodegradable', 'nomor_sni' => 'SIH Kemenperin', 'deskripsi' => 'Standar industri hijau produksi plastik terurai dan daur ulang.'],
            ],

            // 7. Transformasi Industri 4.0
            $industri4Id => [
                ['nama_komoditi' => 'Smart Factory Sektor Polimer & Plastik', 'nomor_sni' => 'INDI 4.0', 'deskripsi' => 'Kesiapan transformasi digital lini injeksi dan ekstrusi plastik.'],
                ['nama_komoditi' => 'Otomasi Manufaktur Alas Kaki & Produk Kulit', 'nomor_sni' => 'INDI 4.0', 'deskripsi' => 'Penerapan IoT dan digital tracking lini perakitan sepatu.'],
                ['nama_komoditi' => 'Sistem Monitoring Cerdas Pabrik Barang Karet', 'nomor_sni' => 'INDI 4.0', 'deskripsi' => 'Integrasi SCADA dan sensor mesin vulkanisasi karet.'],
            ],
        ];

        foreach ($dataByLingkup as $lingkupId => $items) {
            if (!$lingkupId) continue;
            foreach ($items as $item) {
                MasterKomoditi::updateOrCreate(
                    [
                        'nama_komoditi'      => $item['nama_komoditi'],
                        'lingkup_layanan_id' => $lingkupId,
                    ],
                    [
                        'nomor_sni' => $item['nomor_sni'],
                        'deskripsi' => $item['deskripsi'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}