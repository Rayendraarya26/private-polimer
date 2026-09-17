<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PengujianController extends Controller
{
    /**
     * Master Data Komoditas Pengujian Laboratorium BBSPJIKKP (Local Fallback & Proxy Support)
     */
    protected static array $masterKomoditiData = [
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

    /**
     * Master Data Parameter Uji per Komoditas (Standar Metode Uji SNI, ASTM, ISO & Tarif PNBP PP RI)
     */
    protected static array $masterParameterData = [
        // Komoditas 1: Karet dan Barang Karet
        1 => [
            [
                'id' => 101,
                'komoditi_id' => 1,
                'kode' => 'PAR-KRT-01',
                'nama' => 'Kuat Tarik (Tensile Strength) & Perpanjangan Putus (Elongation at Break)',
                'metode_uji' => 'SNI 06-4965-1999 / ASTM D412',
                'satuan' => 'MPa & %',
                'tarif_umum' => 150000,
                'tarif_mahasiswa' => 75000,
                'deskripsi' => 'Pengujian sifat mekanik elastisitas karet dan daya regang maksimum.',
                'is_active' => true,
            ],
            [
                'id' => 102,
                'komoditi_id' => 1,
                'kode' => 'PAR-KRT-02',
                'nama' => 'Ketahanan Sobek (Tear Strength)',
                'metode_uji' => 'ASTM D624 (Die C / Die T)',
                'satuan' => 'kN/m',
                'tarif_umum' => 175000,
                'tarif_mahasiswa' => 87500,
                'deskripsi' => 'Pengujian daya tahan spesimen karet terhadap perambatan sobekan.',
                'is_active' => true,
            ],
            [
                'id' => 103,
                'komoditi_id' => 1,
                'kode' => 'PAR-KRT-03',
                'nama' => 'Kekerasan (Hardness Shore A)',
                'metode_uji' => 'SNI 06-4981-1999 / ASTM D2240',
                'satuan' => 'Shore A',
                'tarif_umum' => 80000,
                'tarif_mahasiswa' => 40000,
                'deskripsi' => 'Pengukuran tingkat kekerasan permukaan karet menggunakan Durometer.',
                'is_active' => true,
            ],
            [
                'id' => 104,
                'komoditi_id' => 1,
                'kode' => 'PAR-KRT-04',
                'nama' => 'Ketahanan Kikis / Ketahanan Aus (Abrasion Resistance)',
                'metode_uji' => 'DIN 53516 / ISO 4649',
                'satuan' => 'mm³',
                'tarif_umum' => 200000,
                'tarif_mahasiswa' => 100000,
                'deskripsi' => 'Pengujian volume kehilangan material karet akibat gesekan putar silinder.',
                'is_active' => true,
            ],
            [
                'id' => 105,
                'komoditi_id' => 1,
                'kode' => 'PAR-KRT-05',
                'nama' => 'Ketahanan Retak Lentur (Flex Cracking Resistance - De Mattia)',
                'metode_uji' => 'SNI 06-1302-1989 / ISO 132',
                'satuan' => 'Kilosiklus (kc)',
                'tarif_umum' => 220000,
                'tarif_mahasiswa' => 110000,
                'deskripsi' => 'Uji ketahanan fatik lentur berulang spesimen karet berlekuk.',
                'is_active' => true,
            ],
            [
                'id' => 106,
                'komoditi_id' => 1,
                'kode' => 'PAR-KRT-06',
                'nama' => 'Mampatan Tetap (Compression Set)',
                'metode_uji' => 'ASTM D395 Method B',
                'satuan' => '%',
                'tarif_umum' => 160000,
                'tarif_mahasiswa' => 80000,
                'deskripsi' => 'Kemampuan karet untuk kembali ke bentuk semula setelah ditekan pada suhu tertentu.',
                'is_active' => true,
            ],
            [
                'id' => 107,
                'komoditi_id' => 1,
                'kode' => 'PAR-KRT-07',
                'nama' => 'Uji Penuaan Termal Dipercepat (Accelerated Oven Aging)',
                'metode_uji' => 'ASTM D573 / ISO 188',
                'satuan' => 'Perubahan %',
                'tarif_umum' => 250000,
                'tarif_mahasiswa' => 125000,
                'deskripsi' => 'Ketahanan karet terhadap degradasi oksigen dan panas dalam oven sirkulasi udara.',
                'is_active' => true,
            ],
        ],

        // Komoditas 2: Plastik dan Polimer Komposit
        2 => [
            [
                'id' => 201,
                'komoditi_id' => 2,
                'kode' => 'PAR-PLS-01',
                'nama' => 'Kuat Tarik Lembaran & Film Plastik (Tensile Properties)',
                'metode_uji' => 'ASTM D638 / ASTM D882',
                'satuan' => 'MPa',
                'tarif_umum' => 180000,
                'tarif_mahasiswa' => 90000,
                'deskripsi' => 'Pengujian tegangan tarik dan modulus elastisitas plastik kaku/fleksibel.',
                'is_active' => true,
            ],
            [
                'id' => 202,
                'komoditi_id' => 2,
                'kode' => 'PAR-PLS-02',
                'nama' => 'Laju Alir Lelehan (Melt Flow Index / MFR / MVR)',
                'metode_uji' => 'ASTM D1238 / ISO 1133',
                'satuan' => 'g/10 min',
                'tarif_umum' => 190000,
                'tarif_mahasiswa' => 95000,
                'deskripsi' => 'Menentukan viskositas lelehan termoplastik pada suhu dan beban standar.',
                'is_active' => true,
            ],
            [
                'id' => 203,
                'komoditi_id' => 2,
                'kode' => 'PAR-PLS-03',
                'nama' => 'Massa Jenis / Densitas Polimer (Density)',
                'metode_uji' => 'ASTM D792 (Metode Piknometer / Archimedes)',
                'satuan' => 'g/cm³',
                'tarif_umum' => 100000,
                'tarif_mahasiswa' => 50000,
                'deskripsi' => 'Pengukuran kerapatan massa jenis resin atau produk polimer.',
                'is_active' => true,
            ],
            [
                'id' => 204,
                'komoditi_id' => 2,
                'kode' => 'PAR-PLS-04',
                'nama' => 'Ketahanan Bentur Izod Berlekuk (Izod Impact Resistance)',
                'metode_uji' => 'ASTM D256 / ISO 180',
                'satuan' => 'J/m',
                'tarif_umum' => 210000,
                'tarif_mahasiswa' => 105000,
                'deskripsi' => 'Pengujian ketangguhan plastik menerima beban tumbukan kejut berkecepatan tinggi.',
                'is_active' => true,
            ],
            [
                'id' => 205,
                'komoditi_id' => 2,
                'kode' => 'PAR-PLS-05',
                'nama' => 'Kuat Lentur (Flexural Strength & Modulus)',
                'metode_uji' => 'ASTM D790 / ISO 178',
                'satuan' => 'MPa',
                'tarif_umum' => 195000,
                'tarif_mahasiswa' => 97500,
                'deskripsi' => 'Uji kelenturan struktur batang plastik komposit metode tumpuan 3-titik.',
                'is_active' => true,
            ],
            [
                'id' => 206,
                'komoditi_id' => 2,
                'kode' => 'PAR-PLS-06',
                'nama' => 'Identifikasi Jenis Polimer (FTIR Spectroscopy)',
                'metode_uji' => 'IK/BBKKP/FTIR / ASTM E1252',
                'satuan' => 'Spektrogram',
                'tarif_umum' => 300000,
                'tarif_mahasiswa' => 150000,
                'deskripsi' => 'Karakterisasi gugus fungsi polimer untuk identifikasi jenis resin (PE, PP, PVC, PET, dll).',
                'is_active' => true,
            ],
        ],

        // Komoditas 3: Kulit dan Produk Olahan Kulit
        3 => [
            [
                'id' => 301,
                'komoditi_id' => 3,
                'kode' => 'PAR-KLT-01',
                'nama' => 'Kuat Tarik dan Kemuluran Kulit (Tensile & Elongation)',
                'metode_uji' => 'SNI 06-1795-1990 / ISO 3376',
                'satuan' => 'N/cm² & %',
                'tarif_umum' => 140000,
                'tarif_mahasiswa' => 70000,
                'deskripsi' => 'Pengujian daya tahan tarikan fisik kulit tersamak.',
                'is_active' => true,
            ],
            [
                'id' => 302,
                'komoditi_id' => 3,
                'kode' => 'PAR-KLT-02',
                'nama' => 'Ketahanan Bending Berulang Kulit (Bally Flexometer)',
                'metode_uji' => 'SNI 06-0996-1989 / ISO 5402',
                'satuan' => 'Siklus',
                'tarif_umum' => 180000,
                'tarif_mahasiswa' => 90000,
                'deskripsi' => 'Uji ketahanan retak permukaan cat tutup kulit atas sepatu terhadap ribuan tekukan.',
                'is_active' => true,
            ],
            [
                'id' => 303,
                'komoditi_id' => 3,
                'kode' => 'PAR-KLT-03',
                'nama' => 'Ketahanan Gosok Cat Tutup Kulit (Crockmeter / Rub Fastness)',
                'metode_uji' => 'SNI 06-0995-1989 / ISO 11640',
                'satuan' => 'Skala Abu-abu (Grey Scale)',
                'tarif_umum' => 130000,
                'tarif_mahasiswa' => 65000,
                'deskripsi' => 'Evaluasi kelunturan warna dan kerusakan lapisan cat terhadap gesekan basah & kering.',
                'is_active' => true,
            ],
            [
                'id' => 304,
                'komoditi_id' => 3,
                'kode' => 'PAR-KLT-04',
                'nama' => 'Kadar Air Kulit (Moisture Content)',
                'metode_uji' => 'SNI 06-0498-1989 / ISO 4684',
                'satuan' => '%',
                'tarif_umum' => 90000,
                'tarif_mahasiswa' => 45000,
                'deskripsi' => 'Pengujian kadar air gravimetri pada bahan kulit jadi.',
                'is_active' => true,
            ],
            [
                'id' => 305,
                'komoditi_id' => 3,
                'kode' => 'PAR-KLT-05',
                'nama' => 'Kadar Krom Oksida (Cr2O3 Analysis)',
                'metode_uji' => 'SNI 06-0500-1989 / ISO 5398',
                'satuan' => '%',
                'tarif_umum' => 175000,
                'tarif_mahasiswa' => 87500,
                'deskripsi' => 'Analisis kimiawi kandungan zat penyamak mineral krom pada kulit sapi/kambing.',
                'is_active' => true,
            ],
        ],

        // Komoditas 4: Alas Kaki dan Sepatu Pengaman
        4 => [
            [
                'id' => 401,
                'komoditi_id' => 4,
                'kode' => 'PAR-SPT-01',
                'nama' => 'Kuat Rekat Sol Sepatu (Bonding Strength Upper-to-Sole)',
                'metode_uji' => 'SNI 0111:2009 / SNI 7079:2009',
                'satuan' => 'N/mm',
                'tarif_umum' => 160000,
                'tarif_mahasiswa' => 80000,
                'deskripsi' => 'Daya rekat antara sol karet/PU dengan bagian atas (upper) sepatu kerja.',
                'is_active' => true,
            ],
            [
                'id' => 402,
                'komoditi_id' => 4,
                'kode' => 'PAR-SPT-02',
                'nama' => 'Ketahanan Tekuk Sol Luar (Outsole Flexing - Ross Flex)',
                'metode_uji' => 'SATRA TM60 / ASTM D1052',
                'satuan' => 'Kilosiklus (kc)',
                'tarif_umum' => 200000,
                'tarif_mahasiswa' => 100000,
                'deskripsi' => 'Uji kelenturan sol sepatu terhadap retak lentur pada temperatur ruang & dingin.',
                'is_active' => true,
            ],
            [
                'id' => 403,
                'komoditi_id' => 4,
                'kode' => 'PAR-SPT-03',
                'nama' => 'Ketahanan Bentur Pelindung Jari Kaki Baja (Impact Resistance Steel Toe Cap)',
                'metode_uji' => 'SNI 0111:2009 / EN ISO 20345 (200 Joule)',
                'satuan' => 'mm (Clearance)',
                'tarif_umum' => 275000,
                'tarif_mahasiswa' => 137500,
                'deskripsi' => 'Uji keselamatan impak energi beban 200 Joule pada pelindung jari sepatu safety.',
                'is_active' => true,
            ],
            [
                'id' => 404,
                'komoditi_id' => 4,
                'kode' => 'PAR-SPT-04',
                'nama' => 'Ketahanan Tekan Baja Pelindung Jari (Compression Resistance - 15 kN)',
                'metode_uji' => 'SNI 7079:2009 / EN ISO 20345',
                'satuan' => 'mm (Clearance)',
                'tarif_umum' => 250000,
                'tarif_mahasiswa' => 125000,
                'deskripsi' => 'Pengujian beban tekan kuasi-statik 15 kiloNewton pada toe cap sepatu pengaman.',
                'is_active' => true,
            ],
        ],

        // Komoditas 5: Tekstil dan Barang Industri
        5 => [
            [
                'id' => 501,
                'komoditi_id' => 5,
                'kode' => 'PAR-TKS-01',
                'nama' => 'Kuat Tarik dan Mulur Kain Tenun / Rajut (Tensile Fabric)',
                'metode_uji' => 'SNI 0276 / ASTM D5034 (Grab Test)',
                'satuan' => 'N & %',
                'tarif_umum' => 135000,
                'tarif_mahasiswa' => 67500,
                'deskripsi' => 'Pengujian ketahanan putus kain dan bahan penguat komposit industri.',
                'is_active' => true,
            ],
            [
                'id' => 502,
                'komoditi_id' => 5,
                'kode' => 'PAR-TKS-02',
                'nama' => 'Ketahanan Luntur Warna Terhadap Pencucian (Color Fastness to Washing)',
                'metode_uji' => 'SNI ISO 105-C06 / AATCC 61',
                'satuan' => 'Skala Abu-abu (Grey Scale)',
                'tarif_umum' => 125000,
                'tarif_mahasiswa' => 62500,
                'deskripsi' => 'Evaluasi kelunturan warna serat tekstil setelah pencucian deterjen standar.',
                'is_active' => true,
            ],
            [
                'id' => 503,
                'komoditi_id' => 5,
                'kode' => 'PAR-TKS-03',
                'nama' => 'Komposisi Serat Tekstil (Fiber Identification & Blend Ratio)',
                'metode_uji' => 'SNI 0264 / AATCC 20A (Mikroskopis & Kimia Pelarut)',
                'satuan' => '% Berat',
                'tarif_umum' => 220000,
                'tarif_mahasiswa' => 110000,
                'deskripsi' => 'Analisis kualitatif & kuantitatif serat katun, poliester, nilon, wol, dll.',
                'is_active' => true,
            ],
        ],
    ];

    /**
     * Mengambil daftar master komoditas pengujian aktif beserta jumlah parameternya
     */
    public function getMasterKomoditi(Request $request): JsonResponse
    {
        try {
            $komoditiList = array_map(function ($kmd) {
                $params = self::$masterParameterData[$kmd['id']] ?? [];
                $kmd['parameters_count'] = count($params);
                return $kmd;
            }, self::$masterKomoditiData);

            return response()->json([
                'success' => true,
                'message' => 'Daftar komoditas pengujian laboratorium berhasil dimuat.',
                'data' => $komoditiList,
                'results' => $komoditiList,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error getMasterKomoditi: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat master komoditi pengujian.',
                'data' => [],
                'results' => [],
            ], 500);
        }
    }

    /**
     * Mengambil daftar parameter uji berdasarkan ID komoditas
     */
    public function getParametersByKomoditi(Request $request, $id): JsonResponse
    {
        try {
            $komoditiId = (int) $id;
            $parameters = self::$masterParameterData[$komoditiId] ?? [];

            return response()->json([
                'success' => true,
                'message' => 'Daftar parameter uji berhasil dimuat.',
                'komoditi_id' => $komoditiId,
                'total' => count($parameters),
                'data' => $parameters,
                'results' => $parameters,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error getParametersByKomoditi: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat parameter uji komoditas.',
                'data' => [],
                'results' => [],
            ], 500);
        }
    }

    /**
     * Helper untuk menyimpan berkas yang diunggah pemohon (S3 / Public Disk)
     */
    protected function saveCustomerFile($file, string $subfolder = 'pengujian'): ?string
    {
        if (!$file || !$file->isValid()) {
            return null;
        }

        $disk = config('filesystems.default', 'public');
        $targetFolder = 'pengujian/' . trim($subfolder, '/');

        return $file->store($targetFolder, $disk);
    }

    /**
     * Memproses Pengajuan Permohonan Pengujian Laboratorium
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'aksi'                          => 'required|in:draft,ajukan',
            'bahasa_laporan'                => 'required|in:id,en',
            'diajukan_oleh'                 => 'nullable|string|max:255',
            'biaya_sama_dengan_pemohon'     => 'nullable',
            'biaya_ditanggung_oleh'         => 'required|string|max:255',
            'alamat_sama_dengan_pemohon'    => 'nullable',
            'laporan_dialamatkan_kepada'    => 'required|string|max:255',
            'keterangan_permintaan'         => 'nullable|string',
            'cara_pembayaran'               => 'required|in:tunai,transfer,dibayar_di_belakang',
            'kategori_tarif'                => 'required|in:umum,mahasiswa_pp54',
            'jenis_uji'                     => 'nullable|string',
            'permintaan_evaluasi'           => 'nullable',
            'catatan_evaluasi'              => 'nullable|string',
            'menyaksikan_uji'               => 'nullable',
            'catatan_menyaksikan'           => 'nullable|string',
            'tanggal_bapc'                  => 'nullable|string',
            'no_bapc'                       => 'nullable|string|max:255',
            'no_sample'                     => 'nullable|string|max:255',
            'merek_kode'                    => 'nullable|string|max:255',
            'no_surat_pengantar'            => 'nullable|string|max:255',
            'tgl_surat_pengantar'           => 'nullable|date',
            'samples'                       => 'required',
            'file_surat_pengantar'          => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'file_ktm'                      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $isAjukan = $validated['aksi'] === 'ajukan';
        $isMahasiswa = $validated['kategori_tarif'] === 'mahasiswa_pp54';

        if ($isAjukan && $isMahasiswa && !$request->hasFile('file_ktm')) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori Tarif Mahasiswa wajib melampirkan berkas Kartu Tanda Mahasiswa (KTM).'
            ], 422);
        }

        // Parse samples dari format JSON string
        $samplesRaw = $validated['samples'];
        if (is_string($samplesRaw)) {
            $samples = json_decode($samplesRaw, true);
            if (!is_array($samples)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Format data sampel pengujian tidak valid.'
                ], 422);
            }
        } else {
            $samples = (array) $samplesRaw;
        }

        if (empty($samples)) {
            return response()->json([
                'success' => false,
                'message' => 'Minimal harus ada 1 sampel pengujian yang didaftarkan.'
            ], 422);
        }

        // 1. Simpan berkas dokumen
        $pathSuratPengantar = $request->hasFile('file_surat_pengantar')
            ? $this->saveCustomerFile($request->file('file_surat_pengantar'), 'surat_pengantar')
            : null;

        $pathKtm = $request->hasFile('file_ktm')
            ? $this->saveCustomerFile($request->file('file_ktm'), 'ktm')
            : null;

        // 2. Kalkulasi grand total biaya pengujian
        $grandTotal = 0;
        $processedSamples = [];

        foreach ($samples as $idx => $sample) {
            $komoditiId = (int) ($sample['master_komoditi_id'] ?? 0);
            $jumlah = max(1, (int) ($sample['jumlah_sampel'] ?? 1));
            $parameterIds = (array) ($sample['parameter_ids'] ?? []);

            $availableParams = self::$masterParameterData[$komoditiId] ?? [];
            $paramById = collect($availableParams)->keyBy('id');

            $sampleParams = [];
            $sampleSubtotal = 0;

            foreach ($parameterIds as $pId) {
                if ($param = $paramById->get((int) $pId)) {
                    $rate = $isMahasiswa ? $param['tarif_mahasiswa'] : $param['tarif_umum'];
                    $sampleSubtotal += $rate;
                    $sampleParams[] = [
                        'id' => $param['id'],
                        'kode' => $param['kode'],
                        'nama' => $param['nama'],
                        'metode_uji' => $param['metode_uji'],
                        'satuan' => $param['satuan'],
                        'tarif' => $rate,
                    ];
                }
            }

            $sampleTotal = $sampleSubtotal * $jumlah;
            $grandTotal += $sampleTotal;

            $processedSamples[] = [
                'index' => $idx + 1,
                'nama_sampel' => $sample['nama_sampel'] ?? ('Sampel #' . ($idx + 1)),
                'bentuk_sampel' => $sample['bentuk_sampel'] ?? 'Lembaran / Film',
                'jumlah_sampel' => $jumlah,
                'satuan_sampel' => $sample['satuan_sampel'] ?? 'Pcs',
                'no_lot_bets' => $sample['no_lot_bets'] ?? null,
                'kondisi_sampel' => $sample['kondisi_sampel'] ?? 'Baik',
                'master_komoditi_id' => $komoditiId,
                'parameters' => $sampleParams,
                'subtotal' => $sampleTotal,
            ];
        }

        // 3. Generate Nomor Permohonan & Virtual Account
        $noPermohonan = 'UJI' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        $vaNumber = $validated['cara_pembayaran'] === 'transfer'
            ? ('988' . now()->format('ymd') . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT))
            : null;

        $permohonanId = (string) Str::uuid();

        // 4. Simpan ke database jika tabel permohonan tersedia
        try {
            DB::beginTransaction();

            $permohonanData = [
                'id' => $permohonanId,
                'id_pt_ins' => (string) Str::uuid(),
                'is_split_bill' => false,
                'no_permohonan' => $noPermohonan,
                'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                'status_bayar' => 'BELUM',
                'harga_permohonan' => $grandTotal,
                'tgl_order' => $isAjukan ? now() : null,
                'created_by' => auth()->id() ?? '00000000-0000-0000-0000-000000000000',
                'ip_address' => $request->ip(),
                'va' => $vaNumber,
                'file_attachment' => $pathSuratPengantar,
                'catatan_penawaran' => json_encode([
                    'layanan' => 'pengujian',
                    'bahasa_laporan' => $validated['bahasa_laporan'],
                    'diajukan_oleh' => $validated['diajukan_oleh'] ?? '',
                    'biaya_ditanggung_oleh' => $validated['biaya_ditanggung_oleh'],
                    'laporan_dialamatkan_kepada' => $validated['laporan_dialamatkan_kepada'],
                    'keterangan_permintaan' => $validated['keterangan_permintaan'] ?? '',
                    'cara_pembayaran' => $validated['cara_pembayaran'],
                    'kategori_tarif' => $validated['kategori_tarif'],
                    'permintaan_evaluasi' => filter_var($validated['permintaan_evaluasi'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'catatan_evaluasi' => $validated['catatan_evaluasi'] ?? '',
                    'menyaksikan_uji' => filter_var($validated['menyaksikan_uji'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'catatan_menyaksikan' => $validated['catatan_menyaksikan'] ?? '',
                    'tanggal_bapc' => $validated['tanggal_bapc'] ?? '',
                    'no_bapc' => $validated['no_bapc'] ?? '',
                    'no_sample' => $validated['no_sample'] ?? '',
                    'merek_kode' => $validated['merek_kode'] ?? '',
                    'no_surat_pengantar' => $validated['no_surat_pengantar'] ?? '',
                    'tgl_surat_pengantar' => $validated['tgl_surat_pengantar'] ?? '',
                    'file_surat_pengantar' => $pathSuratPengantar,
                    'file_ktm' => $pathKtm,
                    'samples' => $processedSamples,
                    'grand_total' => $grandTotal,
                ]),
            ];

            if (class_exists(\App\Models\Db2\Permohonan::class)) {
                $permohonan = \App\Models\Db2\Permohonan::create($permohonanData);
                $permohonanId = $permohonan->id;
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::warning('Permohonan DB write fallback: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => $isAjukan
                ? 'Permohonan pengujian laboratorium berhasil diajukan.'
                : 'Draft permohonan pengujian laboratorium berhasil disimpan.',
            'data' => [
                'id' => $permohonanId,
                'permohonan_id' => $permohonanId,
                'no_permohonan' => $noPermohonan,
                'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                'grand_total' => $grandTotal,
                'va' => $vaNumber,
                'redirect_url' => '/app/#/permohonan/detail/' . $permohonanId,
            ],
            'results' => [
                'id' => $permohonanId,
                'permohonan_id' => $permohonanId,
                'no_permohonan' => $noPermohonan,
            ],
        ], 201);
    }

    /**
     * Mengambil detail permohonan pengujian berdasarkan ID
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            if (class_exists(\App\Models\Db2\Permohonan::class)) {
                $permohonan = \App\Models\Db2\Permohonan::find($id);
                if ($permohonan) {
                    $catatan = json_decode($permohonan->catatan_penawaran ?? '{}', true);
                    return response()->json([
                        'success' => true,
                        'data' => [
                            'id' => $permohonan->id,
                            'no_permohonan' => $permohonan->no_permohonan,
                            'status_workflow' => $permohonan->status_workflow,
                            'status_bayar' => $permohonan->status_bayar,
                            'harga_permohonan' => $permohonan->harga_permohonan,
                            'va' => $permohonan->va,
                            'detail' => $catatan,
                        ],
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $id,
                    'jenis_layanan' => 'pengujian',
                    'message' => 'Detail permohonan pengujian aktif.',
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Error getDetailPengujian: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail permohonan.',
            ], 500);
        }
    }
}
