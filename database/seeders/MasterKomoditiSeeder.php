<?php

namespace Database\Seeders;

use App\Models\Db2\MasterKomoditi;
use App\Models\Db2\MasterLingkupLayanan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MasterKomoditiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        $spptId          = $getLingkupId(['SPPT', 'tanda-sni', 'sertifikasi-produk']);
        $iso9001Id       = $getLingkupId(['9001', 'sistem-manajemen-mutu']);
        $iso14001Id      = $getLingkupId(['14001', 'sistem-manajemen-lingkungan']);
        $halalRegId      = $getLingkupId(['Halal Reguler', 'halal-reguler']);
        $halalUmkId      = $getLingkupId(['Halal UMK', 'halal-umk']);
        $industriHijauId = $getLingkupId(['Industri Hijau', 'industri-hijau']);
        $industri4Id     = $getLingkupId(['4.0', 'transformasi-industri-40']);

        $dataByLingkup = [
            // ==========================================
            // 1. 24 KOMODITI RESMI SPPT SNI (SINKRON DENGAN SIS)
            // ==========================================
            $spptId => [
                ['nama_komoditi' => 'Sepatu Pengaman dari Kulit dengan Sol Karet Cetak Vulkanisasi', 'nomor_sni' => 'SNI 0111:2009', 'deskripsi' => 'Sepatu keselamatan kerja dari bahan kulit dengan sol karet vulkanisir.'],
                ['nama_komoditi' => 'Sepatu Pengaman dengan Sol Poliuretan dan Termoplastik Poliuretan', 'nomor_sni' => 'SNI 7079:2009', 'deskripsi' => 'Sepatu keselamatan kerja dengan sol injeksi PU dan TPU.'],
                ['nama_komoditi' => 'Sepatu Kulit Kasual Pria dan Wanita', 'nomor_sni' => 'SNI 06-0392-1989', 'deskripsi' => 'Sepatu kasual berbahan dasar kulit untuk pria dan wanita.'],
                ['nama_komoditi' => 'Kulit Sapi Krom Tersamak untuk Bahan Sepatu', 'nomor_sni' => 'SNI 0234:2009', 'deskripsi' => 'Kulit sapi hasil penyamakan krom untuk bahan baku bagian atas sepatu.'],
                ['nama_komoditi' => 'Jaket Kulit dan Pakaian Jadi dari Kulit', 'nomor_sni' => 'SNI 4500:2001', 'deskripsi' => 'Pakaian pelindung dan kasual berbahan kulit tersamak.'],
                ['nama_komoditi' => 'Sarung Tangan Kerja Pengaman dari Kulit', 'nomor_sni' => 'SNI 06-0391-1989', 'deskripsi' => 'Sarung tangan keselamatan kerja berbahan kulit.'],
                ['nama_komoditi' => 'Kulit Boks (Box Calf)', 'nomor_sni' => 'SNI 06-0487-1989', 'deskripsi' => 'Kulit boks halus berkualitas tinggi untuk kerajinan dan sepatu.'],
                ['nama_komoditi' => 'Ban Sepeda Motor', 'nomor_sni' => 'SNI 0101:2012', 'deskripsi' => 'Ban luar kendaraan bermotor roda dua.'],
                ['nama_komoditi' => 'Ban Mobil Penumpang', 'nomor_sni' => 'SNI 0098:2012', 'deskripsi' => 'Ban luar untuk kendaraan mobil penumpang.'],
                ['nama_komoditi' => 'Ban Truk Ringan dan Truk/Bus', 'nomor_sni' => 'SNI 0099:2012', 'deskripsi' => 'Ban luar untuk kendaraan komersial, truk, dan bus.'],
                ['nama_komoditi' => 'Ban Dalam Kendaraan Bermotor', 'nomor_sni' => 'SNI 0181:2001', 'deskripsi' => 'Ban dalam karet untuk sepeda motor dan mobil.'],
                ['nama_komoditi' => 'Bantalan Karet Jembatan (Elastomeric Bearing Pad)', 'nomor_sni' => 'SNI 3967:2014', 'deskripsi' => 'Bantalan karet struktural penahan beban dan getaran jembatan.'],
                ['nama_komoditi' => 'Selang Karet untuk Kompor Gas LPG', 'nomor_sni' => 'SNI 06-7213-2006', 'deskripsi' => 'Selang karet fleksibel bertekanan untuk distribusi gas LPG.'],
                ['nama_komoditi' => 'Karet Perapat (Rubber Seal) Katup Tabung Gas LPG', 'nomor_sni' => 'SNI 7655:2010', 'deskripsi' => 'Karet perapat seal cincin pada katup tabung gas LPG.'],
                ['nama_komoditi' => 'Sarung Tangan Karet Medis / Bedah Sekali Pakai', 'nomor_sni' => 'SNI 16-1672-1989', 'deskripsi' => 'Sarung tangan karet lateks/sintetik untuk keperluan medis.'],
                ['nama_komoditi' => 'Kondom Karet Lateks Alami', 'nomor_sni' => 'SNI ISO 4074:2016', 'deskripsi' => 'Alat kontrasepsi dan proteksi berbahan lateks alami.'],
                ['nama_komoditi' => 'Karet Vulkanisir Sol Sepatu', 'nomor_sni' => 'SNI 0778:2011', 'deskripsi' => 'Bahan karet vulkanisir untuk sol luar alas kaki.'],
                ['nama_komoditi' => 'Helm Pengendara Kendaraan Bermotor Roda Dua', 'nomor_sni' => 'SNI 1811:2007', 'deskripsi' => 'Pelindung kepala pengendara sepeda motor standar nasional.'],
                ['nama_komoditi' => 'Pipa PVC-U untuk Saluran Air Minum', 'nomor_sni' => 'SNI 06-0084-2002', 'deskripsi' => 'Pipa polivinil klorida tanpa plastisizer untuk jaringan air bersih.'],
                ['nama_komoditi' => 'Pipa Polietilena (PE-100 / PE-80) untuk Air Minum', 'nomor_sni' => 'SNI 4829.2:2015', 'deskripsi' => 'Pipa termoplastik PE-HD untuk distribusi air minum bertekanan.'],
                ['nama_komoditi' => 'Kantong Plastik Belanja Ramah Lingkungan / Mudah Terurai', 'nomor_sni' => 'SNI 7188.7:2016', 'deskripsi' => 'Kantong plastik belanja biodegradable / oxo-biodegradable.'],
                ['nama_komoditi' => 'Kemasan Pangan Plastik Polietilena (PE) dan Polipropilena (PP)', 'nomor_sni' => 'SNI 7323:2008', 'deskripsi' => 'Wadah dan kemasan plastik aman kontak pangan (food grade).'],
                ['nama_komoditi' => 'Tangki Air Plastik Silinder Vertikal dari Polietilena (PE)', 'nomor_sni' => 'SNI 7288:2007', 'deskripsi' => 'Tangki penampung air polietilena kapasitas besar.'],
                ['nama_komoditi' => 'Peralatan Makan dan Minum dari Melamin', 'nomor_sni' => 'SNI 7322:2008', 'deskripsi' => 'Piring, mangkok, dan gelas makan berbahan resin melamin aman pangan.'],
            ],

            // ==========================================
            // 2. ISO 9001 (SISTEM MANAJEMEN MUTU)
            // ==========================================
            $iso9001Id => [
                ['nama_komoditi' => 'Industri Pengolahan Karet & Barang Karet', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Penerapan sistem manajemen mutu industri manufaktur karet.'],
                ['nama_komoditi' => 'Industri Penyamakan Kulit & Barang Kulit', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Penerapan sistem manajemen mutu industri penyamakan dan alas kaki.'],
                ['nama_komoditi' => 'Industri Plastik, Polimer & Kemasan', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Penerapan sistem manajemen mutu manufaktur plastik & masterbatch.'],
                ['nama_komoditi' => 'Industri Fabrikasi & Komponen Otomotif Berbasis Karet/Plastik', 'nomor_sni' => 'SNI ISO 9001:2015', 'deskripsi' => 'Manajemen mutu manufaktur komponen teknik.'],
            ],

            // ==========================================
            // 3. ISO 14001 (SISTEM MANAJEMEN LINGKUNGAN)
            // ==========================================
            $iso14001Id => [
                ['nama_komoditi' => 'Industri Daur Ulang Plastik & Polimer (Recycling)', 'nomor_sni' => 'SNI ISO 14001:2015', 'deskripsi' => 'Sistem manajemen lingkungan daur ulang cacahan dan pelet plastik.'],
                ['nama_komoditi' => 'Industri Penyamakan Kulit (LWG / Pengelolaan Limbah)', 'nomor_sni' => 'SNI ISO 14001:2015', 'deskripsi' => 'Sistem manajemen lingkungan fasilitas penyamakan kulit dan IPAL.'],
                ['nama_komoditi' => 'Industri Pengolahan Lateks & Karet Alam', 'nomor_sni' => 'SNI ISO 14001:2015', 'deskripsi' => 'Manajemen lingkungan industri pengolahan bahan mentah karet.'],
            ],

            // ==========================================
            // 4. HALAL REGULER & UMK
            // ==========================================
            $halalRegId => [
                ['nama_komoditi' => 'Kemasan Pangan Berbasis Polimer / Plastik', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Kemasan pangan plastik bersertifikasi halal.'],
                ['nama_komoditi' => 'Gelatin dan Kolagen Berbahan Baku Kulit', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Bahan penolong/tambahan pangan berbasis gelatin halal.'],
                ['nama_komoditi' => 'Barang Konsumsi Karet & Lateks (Peralatan Makan/Bayi)', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Peralatan makan, dot, dan perlengkapan bayi berbahan silikon/karet.'],
            ],
            $halalUmkId => [
                ['nama_komoditi' => 'Kemasan Makanan / Minuman Plastik Skala UMK', 'nomor_sni' => 'SJPH Halal Self-Declare', 'deskripsi' => 'Kemasan kantong, pouch, atau cup polimer untuk pelaku UMK.'],
                ['nama_komoditi' => 'Kerajinan & Aksesoris Kulit Skala Kecil', 'nomor_sni' => 'SJPH Halal', 'deskripsi' => 'Produk kerajinan dan dompet/sepatu kulit skala mikro dan kecil.'],
            ],

            // ==========================================
            // 5. INDUSTRI HIJAU & INDUSTRI 4.0
            // ==========================================
            $industriHijauId => [
                ['nama_komoditi' => 'Industri Karet Remah (Crumb Rubber) Hijau', 'nomor_sni' => 'SIH Kemenperin', 'deskripsi' => 'Sertifikasi industri hijau untuk pabrik pengolahan crumb rubber.'],
                ['nama_komoditi' => 'Industri Penyamakan Kulit Ramah Lingkungan', 'nomor_sni' => 'SIH Kemenperin', 'deskripsi' => 'Standar industri hijau penyamakan kulit hemat air dan bahan kimia.'],
                ['nama_komoditi' => 'Industri Barang Plastik Daur Ulang & Biodegradable', 'nomor_sni' => 'SIH Kemenperin', 'deskripsi' => 'Standar industri hijau produksi plastik terurai dan daur ulang.'],
            ],
            $industri4Id => [
                ['nama_komoditi' => 'Smart Factory Sektor Polimer & Plastik', 'nomor_sni' => 'INDI 4.0', 'deskripsi' => 'Kesiapan transformasi digital lini injeksi dan ekstrusi plastik.'],
                ['nama_komoditi' => 'Otomasi Manufaktur Alas Kaki & Produk Kulit', 'nomor_sni' => 'INDI 4.0', 'deskripsi' => 'Penerapan IoT dan digital tracking lini perakitan sepatu.'],
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