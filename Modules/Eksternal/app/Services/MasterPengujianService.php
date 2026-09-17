<?php

namespace Modules\Eksternal\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class MasterPengujianService
{
    protected static ?array $cachedMasterData = null;

    /**
     * Path prioritas file acuan tarif pengujian
     */
    protected static function getCsvSourcePath(): string
    {
        // 1. Path di folder Downloads sesuai instruksi user
        $userDownloadsCsv = 'C:/Users/User/Downloads/Tarif HPP Pengujian  - Tarif PP 54 DAN HPP.csv';
        if (file_exists($userDownloadsCsv)) {
            return $userDownloadsCsv;
        }

        // 2. Fallback CSV di direktori database proyek
        $localCsv = base_path('database/data/tarif_pengujian_pp54.csv');
        if (file_exists($localCsv)) {
            return $localCsv;
        }

        return '';
    }

    /**
     * Path JSON master data yang sudah terstruktur
     */
    protected static function getJsonSourcePath(): string
    {
        return base_path('database/data/master_pengujian_pp54.json');
    }

    /**
     * Memuat seluruh data komoditas dan parameter uji dari acuan tarif
     */
    public static function loadMasterData(): array
    {
        if (self::$cachedMasterData !== null) {
            return self::$cachedMasterData;
        }

        // Coba ambil dari cache Laravel (1 jam)
        $data = Cache::remember('master_pengujian_pp54_data', 3600, function () {
            $jsonPath = self::getJsonSourcePath();
            $csvPath = self::getCsvSourcePath();

            // Jika JSON ada dan up-to-date
            if (file_exists($jsonPath)) {
                $jsonContent = file_get_contents($jsonPath);
                $decoded = json_decode($jsonContent, true);
                if (is_array($decoded) && !empty($decoded)) {
                    return $decoded;
                }
            }

            // Jika perlu parse dari CSV
            if (!empty($csvPath) && file_exists($csvPath)) {
                return self::parseCsvData($csvPath);
            }

            return [];
        });

        self::$cachedMasterData = $data;
        return self::$cachedMasterData;
    }

    /**
     * Mengambil daftar master komoditas untuk dropdown & wizard
     */
    public static function getMasterKomoditi(): array
    {
        $all = self::loadMasterData();
        return array_map(function ($kmd) {
            return [
                'id'               => (int) $kmd['id'],
                'kode'             => $kmd['kode'],
                'nama'             => $kmd['nama'],
                'ruang_lingkup'    => $kmd['ruang_lingkup'] ?? $kmd['nama'],
                'parameters_count' => count($kmd['parameters'] ?? []),
                'is_active'        => true,
            ];
        }, $all);
    }

    /**
     * Mengambil daftar parameter uji berdasarkan ID komoditas
     */
    public static function getParametersByKomoditi(int $komoditiId): array
    {
        $all = self::loadMasterData();
        foreach ($all as $kmd) {
            if ((int) $kmd['id'] === $komoditiId) {
                return $kmd['parameters'] ?? [];
            }
        }
        return [];
    }

    /**
     * Mencari satu parameter tertentu berdasarkan komoditiId dan parameterId
     */
    public static function findParameter(int $komoditiId, int $parameterId): ?array
    {
        $params = self::getParametersByKomoditi($komoditiId);
        foreach ($params as $p) {
            if ((int) $p['id'] === $parameterId) {
                return $p;
            }
        }
        return null;
    }

    /**
     * Parser langsung dari file CSV acuan Tarif PP 54 dan HPP
     */
    public static function parseCsvData(string $csvPath): array
    {
        if (!file_exists($csvPath)) {
            return [];
        }

        $lines = file($csvPath);
        $commodities = [];
        $currentIdx = -1;
        $currentParent = null;

        $kodeKomoditiMap = [
            'KULIT' => ['kode' => 'KMD-KLT', 'nama' => 'Kulit dan Produk Kulit', 'ruang_lingkup' => 'Pengujian Fisika, Mekanik, & Kimia Kulit'],
            'KARET' => ['kode' => 'KMD-KRT', 'nama' => 'Karet dan Barang Karet', 'ruang_lingkup' => 'Pengujian Vulkanisat, Kompon, & Sifat Fisis Karet'],
            'BAN DALAM' => ['kode' => 'KMD-BND', 'nama' => 'Ban Dalam Kendaraan', 'ruang_lingkup' => 'Pengujian Kuat Tarik, Sambungan, & Pengusangan Ban'],
            'BAN LUAR TRUCK DAN BUS' => ['kode' => 'KMD-BLTB', 'nama' => 'Ban Luar Truck & Bus (TBR)', 'ruang_lingkup' => 'Pengujian Dimensi, Breaking Energy, & Endurance'],
            'BAN LUAR LT' => ['kode' => 'KMD-BLLT', 'nama' => 'Ban Luar Light Truck (LT)', 'ruang_lingkup' => 'Pengujian Dimensi, High Speed, & Endurance Ban LT'],
            'BAN LUAR MOBIL PENUMPANG' => ['kode' => 'KMD-BLMP', 'nama' => 'Ban Luar Mobil Penumpang (PCR)', 'ruang_lingkup' => 'Pengujian Bead Unseating, High Speed, & Endurance'],
            'BAN LUAR SEPEDA MOTOR' => ['kode' => 'KMD-BLSM', 'nama' => 'Ban Luar Sepeda Motor (MC)', 'ruang_lingkup' => 'Pengujian Dimensi, Keausan TWI, & Ketahanan Beban'],
            'ROL KARET PENGUPAS GABAH' => ['kode' => 'KMD-RKPG', 'nama' => 'Rol Karet Pengupas Gabah', 'ruang_lingkup' => 'Pengujian Dimensi, Flensa, & Ketahanan Mekanis'],
            'SOL KARET CETAK' => ['kode' => 'KMD-SKC', 'nama' => 'Sol Karet Cetak', 'ruang_lingkup' => 'Pengujian Kuat Tarik, Kekerasan, & Keausan Sol'],
            'SEPATU PENGAMAN' => ['kode' => 'KMD-SPG', 'nama' => 'Sepatu Pengaman (Safety Shoes)', 'ruang_lingkup' => 'Pengujian Impact, Ketahanan Tusuk, & Kuat Rekat'],
            'PLASTIK' => ['kode' => 'KMD-PLS', 'nama' => 'Plastik dan Polimer Sintetis', 'ruang_lingkup' => 'Pengujian Kuat Tarik, Sobek, & Karakterisasi Plastik'],
            'LIMBAH CAIR' => ['kode' => 'KMD-LMB', 'nama' => 'Limbah Cair Industri', 'ruang_lingkup' => 'Pengujian Parameter Lingkungan (BOD, COD, TDS, Logam)'],
            'SIR' => ['kode' => 'KMD-SIR', 'nama' => 'Standard Indonesian Rubber (SIR)', 'ruang_lingkup' => 'Pengujian Mutu Karet Alam Standar Indonesia (PRI, Po, Kotoran)'],
            'SEPATU PDH PDL' => ['kode' => 'KMD-SPD', 'nama' => 'Sepatu Dinas Harian / Lapangan (PDH/PDL)', 'ruang_lingkup' => 'Pengujian Komprehensif Komponen Atasan, Sol, & Konstruksi'],
        ];

        for ($i = 0; $i < count($lines); $i++) {
            $row = str_getcsv($lines[$i]);
            $c0 = trim($row[0] ?? '');
            $c1 = trim($row[1] ?? '');
            $c2 = trim($row[2] ?? '');
            $c3 = trim($row[3] ?? '');
            $c4 = trim($row[4] ?? '');
            $c9 = trim($row[9] ?? '');

            if ($c3 === 'Parameter Pengujian' || $c3 === '') {
                continue;
            }

            $isCommodity = false;
            if (is_numeric($c1) && !empty($c3) && empty($c2)) {
                $isCommodity = true;
            } elseif ($c3 === 'SEPATU  PDH PDL' || $c3 === 'SEPATU PDH PDL') {
                $isCommodity = true;
            }

            if ($isCommodity) {
                $rawName = trim(preg_replace('/\s+/', ' ', $c3));
                $currentIdx = count($commodities);
                $id = $currentIdx + 1;

                $meta = $kodeKomoditiMap[$rawName] ?? [
                    'kode' => 'KMD-' . str_pad($id, 2, '0', STR_PAD_LEFT),
                    'nama' => ucwords(strtolower($rawName)),
                    'ruang_lingkup' => 'Pengujian ' . ucwords(strtolower($rawName)),
                ];

                $commodities[$currentIdx] = [
                    'id'               => $id,
                    'kode'             => $meta['kode'],
                    'nama'             => $meta['nama'],
                    'ruang_lingkup'    => $meta['ruang_lingkup'],
                    'parameters_count' => 0,
                    'parameters'       => [],
                ];
                $currentParent = null;
                continue;
            }

            if ($currentIdx >= 0) {
                $cleanTarif = str_replace([',', ' ', '"', 'Rp', 'rp'], '', $c9);
                $cleanHpp = str_replace([',', ' ', '"', 'Rp', 'rp'], '', $c4);

                $tarif = 0;
                if (is_numeric($cleanTarif) && (float)$cleanTarif > 0) {
                    $tarif = (int)$cleanTarif;
                } elseif (is_numeric($cleanHpp) && (float)$cleanHpp > 0) {
                    $tarif = (int) round((float)$cleanHpp / 1000) * 1000;
                }

                if ($tarif === 0 && (empty($cleanTarif) || $cleanTarif === '-') && empty($c1)) {
                    $currentParent = $c3;
                    continue;
                }

                $paramName = $c3;
                if ($currentParent && (strpos(strtolower($c3), 'jam') !== false || strlen($c3) < 15)) {
                    $paramName = $currentParent . ' (' . $c3 . ')';
                } else {
                    $currentParent = null;
                }

                $tarifMhs = (int) round($tarif * 0.5);
                $kategori = $c1 ?: ($c0 ?: 'Fisika/Mekanik');

                $pId = count($commodities[$currentIdx]['parameters']) + 1;
                $paramKode = 'PAR-' . $commodities[$currentIdx]['id'] . '-' . str_pad($pId, 3, '0', STR_PAD_LEFT);

                $commodities[$currentIdx]['parameters'][] = [
                    'id'              => ($commodities[$currentIdx]['id'] * 1000) + $pId,
                    'komoditi_id'     => $commodities[$currentIdx]['id'],
                    'kode'            => $paramKode,
                    'nama'            => $paramName,
                    'kategori'        => $kategori,
                    'metode_uji'      => 'SNI / Standar PP 54 Th 2021',
                    'satuan'          => 'Per Parameter',
                    'tarif_umum'      => $tarif,
                    'tarif_mahasiswa' => $tarifMhs,
                    'is_active'       => true,
                ];
            }
        }

        for ($k = 0; $k < count($commodities); $k++) {
            $commodities[$k]['parameters_count'] = count($commodities[$k]['parameters']);
        }

        return $commodities;
    }
}
