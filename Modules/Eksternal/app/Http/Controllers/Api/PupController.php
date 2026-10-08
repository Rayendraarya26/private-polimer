<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Helpers\NotifHelper;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\DetailPembayaran;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\FormPup;
use App\Models\Db2\FormPupItem;

class PupController extends Controller
{
    /**
     * Definisi katalog master 28 skema Uji Profisiensi Kalibrasi BBSPJIKKP
     */
    protected array $skemaCatalog = [
        [
            'kode_skema' => 'UP-THERMO-GELAS',
            'slug'       => 'termometer_gelas',
            'nama'       => 'Skema UP Termometer Gelas',
            'kategori'   => 'Suhu',
            'harga_normal' => 1000000,
            'harga_promo'  => 1000000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'termometer',
            'image'              => '/images/pup/termometer_gelas.png',
        ],
        [
            'kode_skema' => 'UP-THERMO-DIGITAL-1',
            'slug'       => 'termometer_digital_1',
            'nama'       => 'Skema UP Termometer Digital 1',
            'kategori'   => 'Suhu',
            'harga_normal' => 900000,
            'harga_promo'  => 900000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'termometer',
            'image'              => '/images/pup/termometer_digital_1.png',
        ],
        [
            'kode_skema' => 'UP-THERMO-DIGITAL-2',
            'slug'       => 'termometer_digital_2',
            'nama'       => 'Skema UP Termometer Digital 2',
            'kategori'   => 'Suhu',
            'harga_normal' => 1200000,
            'harga_promo'  => 1200000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'termometer',
            'image'              => '/images/pup/termometer_digital_2.png',
        ],
        [
            'kode_skema' => 'UP-THERMO-DIGITAL-3',
            'slug'       => 'termometer_digital_3',
            'nama'       => 'Skema UP Termometer Digital 3',
            'kategori'   => 'Suhu',
            'harga_normal' => 1100000,
            'harga_promo'  => 1100000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'termometer',
            'image'              => '/images/pup/termometer_digital_3.png',
        ],
        [
            'kode_skema' => 'UP-THERMO-RADIASI',
            'slug'       => 'termometer_radiasi',
            'nama'       => 'Skema UP Termometer Radiasi',
            'kategori'   => 'Suhu',
            'harga_normal' => 1100000,
            'harga_promo'  => 900000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/termometer_radiasi.png',
        ],
        [
            'kode_skema' => 'UP-THERMOHYGRO',
            'slug'       => 'thermohygrometer',
            'nama'       => 'Skema UP Thermohygrometer',
            'kategori'   => 'Suhu & Kelembaban',
            'harga_normal' => 850000,
            'harga_promo'  => 850000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/thermohygrometer.png',
        ],
        [
            'kode_skema' => 'UP-AUTOCLAVE',
            'slug'       => 'autoclave',
            'nama'       => 'Skema UP Autoclave [in situ/on site di Yogyakarta]',
            'kategori'   => 'Suhu & Tekanan',
            'harga_normal' => 1100000,
            'harga_promo'  => 1100000,
            'is_in_situ'   => true,
            'requires_equipment' => true,
            'equipment_group'    => 'autoclave',
            'image'              => '/images/pup/autoclave.png',
        ],
        [
            'kode_skema' => 'UP-OVEN',
            'slug'       => 'oven',
            'nama'       => 'Skema UP Oven [in situ/on site di Yogyakarta]',
            'kategori'   => 'Suhu',
            'harga_normal' => 1700000,
            'harga_promo'  => 1700000,
            'is_in_situ'   => true,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/oven.png',
        ],
        [
            'kode_skema' => 'UP-CLIMATIC-CHAMBER',
            'slug'       => 'climatic_chamber',
            'nama'       => 'Skema UP Climatic Chamber [in situ/on site di Yogyakarta]',
            'kategori'   => 'Suhu & Kelembaban',
            'harga_normal' => 1400000,
            'harga_promo'  => 1400000,
            'is_in_situ'   => true,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/climatic_chamber.png',
        ],
        [
            'kode_skema' => 'UP-TIMBANGAN-ANALITIK',
            'slug'       => 'timbangan_analitik',
            'nama'       => 'Skema UP Timbangan Analitik [in situ/on site di Yogyakarta]',
            'kategori'   => 'Massa',
            'harga_normal' => 1500000,
            'harga_promo'  => 1500000,
            'is_in_situ'   => true,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/timbangan_analitik.png',
        ],
        [
            'kode_skema' => 'UP-TIMBANGAN-ELEKTRONIK',
            'slug'       => 'timbangan_elektronik',
            'nama'       => 'Skema UP Timbangan Elektronik [in situ/on site di Yogyakarta]',
            'kategori'   => 'Massa',
            'harga_normal' => 1500000,
            'harga_promo'  => 1500000,
            'is_in_situ'   => true,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/timbangan_elektronik.png',
        ],
        [
            'kode_skema' => 'UP-PIPET-VOLUME',
            'slug'       => 'pipet_volume',
            'nama'       => 'Skema UP Pipet Volume',
            'kategori'   => 'Volumetrik',
            'harga_normal' => 950000,
            'harga_promo'  => 950000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/pipet_volume.png',
        ],
        [
            'kode_skema' => 'UP-PIPET-UKUR',
            'slug'       => 'pipet_ukur',
            'nama'       => 'Skema UP Pipet Ukur',
            'kategori'   => 'Volumetrik',
            'harga_normal' => 950000,
            'harga_promo'  => 950000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/pipet_ukur.png',
        ],
        [
            'kode_skema' => 'UP-LABU-UKUR-1',
            'slug'       => 'labu_ukur_1',
            'nama'       => 'Skema UP Labu Ukur 1',
            'kategori'   => 'Volumetrik',
            'harga_normal' => 900000,
            'harga_promo'  => 900000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/labu_ukur_1.png',
        ],
        [
            'kode_skema' => 'UP-LABU-UKUR-2',
            'slug'       => 'labu_ukur_2',
            'nama'       => 'Skema UP Labu Ukur 2',
            'kategori'   => 'Volumetrik',
            'harga_normal' => 850000,
            'harga_promo'  => 750000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/labu_ukur_2.png',
        ],
        [
            'kode_skema' => 'UP-BURET',
            'slug'       => 'buret',
            'nama'       => 'Skema UP Buret',
            'kategori'   => 'Volumetrik',
            'harga_normal' => 950000,
            'harga_promo'  => 950000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/buret.png',
        ],
        [
            'kode_skema' => 'UP-GELAS-UKUR',
            'slug'       => 'gelas_ukur',
            'nama'       => 'Skema UP Gelas Ukur',
            'kategori'   => 'Volumetrik',
            'harga_normal' => 700000,
            'harga_promo'  => 700000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/gelas_ukur.png',
        ],
        [
            'kode_skema' => 'UP-MIKROPIPET',
            'slug'       => 'mikropipet',
            'nama'       => 'Skema UP Mikropipet',
            'kategori'   => 'Volumetrik',
            'harga_normal' => 900000,
            'harga_promo'  => 900000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/mikropipet.png',
        ],
        [
            'kode_skema' => 'UP-PRESSURE-PNEUMATIK',
            'slug'       => 'pressure_gauge_pneumatik',
            'nama'       => 'Skema UP Pressure Gauge Pneumatik',
            'kategori'   => 'Tekanan',
            'harga_normal' => 800000,
            'harga_promo'  => 800000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'pressure_gauge',
            'image'              => '/images/pup/pressure_gauge_pneumatik.png',
        ],
        [
            'kode_skema' => 'UP-PRESSURE-HIDROLIK',
            'slug'       => 'pressure_gauge_hidrolik',
            'nama'       => 'Skema UP Pressure Gauge Hidrolik',
            'kategori'   => 'Tekanan',
            'harga_normal' => 800000,
            'harga_promo'  => 800000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'pressure_gauge',
            'image'              => '/images/pup/pressure_gauge_hidrolik.png',
        ],
        [
            'kode_skema' => 'UP-CALIPER',
            'slug'       => 'digital_caliper',
            'nama'       => 'Skema UP Digital Caliper',
            'kategori'   => 'Dimensi & Panjang',
            'harga_normal' => 850000,
            'harga_promo'  => 850000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'digital_caliper',
            'image'              => '/images/pup/digital_caliper.png',
        ],
        [
            'kode_skema' => 'UP-MICROMETER-1',
            'slug'       => 'digital_outside_micrometer_1',
            'nama'       => 'Skema UP Digital Outside Micrometer 1',
            'kategori'   => 'Dimensi & Panjang',
            'harga_normal' => 850000,
            'harga_promo'  => 850000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/digital_outside_micrometer_1.png',
        ],
        [
            'kode_skema' => 'UP-MICROMETER-2',
            'slug'       => 'digital_outside_micrometer_2',
            'nama'       => 'Skema UP Digital Outside Micrometer 2',
            'kategori'   => 'Dimensi & Panjang',
            'harga_normal' => 900000,
            'harga_promo'  => 800000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/digital_outside_micrometer_2.png',
        ],
        [
            'kode_skema' => 'UP-DIAL-THICKNESS',
            'slug'       => 'dial_thickness_gauge',
            'nama'       => 'Skema UP Dial Thickness Gauge',
            'kategori'   => 'Dimensi & Panjang',
            'harga_normal' => 850000,
            'harga_promo'  => 850000,
            'is_in_situ'   => false,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'image'              => '/images/pup/dial_thickness_gauge.png',
        ],
        [
            'kode_skema' => 'UP-STOPWATCH',
            'slug'       => 'stopwatch_digital',
            'nama'       => 'Skema UP Stopwatch Digital',
            'kategori'   => 'Waktu & Frekuensi',
            'harga_normal' => 800000,
            'harga_promo'  => 800000,
            'is_in_situ'   => false,
            'requires_equipment' => true,
            'equipment_group'    => 'stopwatch',
            'image'              => '/images/pup/stopwatch_digital.png',
        ],
        [
            'kode_skema' => 'UP-CENTRIFUGE',
            'slug'       => 'centrifuge',
            'nama'       => 'Skema UP Centrifuge [in situ/on site di Yogyakarta]',
            'kategori'   => 'Kecepatan Putar',
            'harga_normal' => 1300000,
            'harga_promo'  => 1300000,
            'is_in_situ'   => true,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'bundle_eligible'    => true,
            'image'              => '/images/pup/centrifuge.png',
        ],
        [
            'kode_skema' => 'UP-OVERHEAD-STIRRER',
            'slug'       => 'overhead_stirrer',
            'nama'       => 'Skema UP Overhead Stirrer [in situ/on site di Yogyakarta]',
            'kategori'   => 'Kecepatan Putar',
            'harga_normal' => 1300000,
            'harga_promo'  => 1300000,
            'is_in_situ'   => true,
            'requires_equipment' => false,
            'equipment_group'    => null,
            'bundle_eligible'    => true,
            'image'              => '/images/pup/overhead_stirrer.png',
        ],
        [
            'kode_skema' => 'UP-SPEKTROFOTOMETER',
            'slug'       => 'spektrofotometer_uv_vis',
            'nama'       => 'Skema UP Spektrofotometer UV-Vis [in situ/on site di Yogyakarta]',
            'kategori'   => 'Optik',
            'harga_normal' => 1950000,
            'harga_promo'  => 1950000,
            'is_in_situ'   => true,
            'requires_equipment' => true,
            'equipment_group'    => 'spektrofotometer',
            'image'              => '/images/pup/spektrofotometer_uv_vis.png',
        ],
    ];

    /**
     * Ambil katalog skema Uji Profisiensi Kalibrasi
     */
    public function getSkema(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'results' => [
                'periode' => (string) date('Y'),
                'diskon_bundling' => [
                    'skema_terkait' => ['centrifuge', 'overhead_stirrer'],
                    'nominal'       => 1000000,
                    'keterangan'    => 'Diskon Rp 1.000.000 jika mendaftar skema Centrifuge dan Overhead Stirrer sekaligus',
                ],
                'skema'   => $this->skemaCatalog,
            ],
            'data' => $this->skemaCatalog,
        ]);
    }

    /**
     * Simpan pendaftaran permohonan Uji Profisiensi baru
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            // Identitas & Narahubung
            'nama_pengisi'             => 'required|string|max:255',
            'email_pemohon'            => 'required|email|max:255',
            'nama_narahubung'          => 'required|string|max:255',
            'no_wa_narahubung'         => 'required|string|max:50',

            // Profil Lab
            'nama_lab_kalibrasi'       => 'required|string|max:255',
            'alamat_lab_kalibrasi'     => 'required|string',
            'kota_kabupaten_lab'       => 'required|string|max:255',
            'email_official_lab'       => 'required|email|max:255',

            // Pengesah
            'nama_personil_pengesah'   => 'required|string|max:255',
            'jabatan_personil_pengesah'=> 'required|string|max:255',

            // Skema Terpilih
            'skema_items'              => 'required|array|min:1',
            'skema_items.*.kode_skema' => 'required|string',
            'skema_items.*.nama_skema' => 'required|string',
            'skema_items.*.tarif_pnbp' => 'required|numeric|min:0',

            // Pernyataan
            'pernyataan_en_score'      => 'required|boolean|accepted',
            'pernyataan_proposal'      => 'required|boolean|accepted',
        ]);

        DB::beginTransaction();
        try {
            $user   = auth()->user();
            $userId = auth()->id() ?? \App\Models\Db1\SysUser::first()?->id;

            // 1. Generate No Permohonan: PUP + YYYYMMDD + 5 Random Digit
            $noPermohonan = 'PUP' . now()->format('Ymd') . str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);

            // 2. Hitung Rincian Biaya & Diskon Bundling Centrifuge + Overhead Stirrer
            $skemaItems = $request->input('skema_items', []);
            $totalBiayaKotor = 0;
            $selectedSlugs = [];

            foreach ($skemaItems as $item) {
                $totalBiayaKotor += (float) ($item['tarif_pnbp'] ?? 0);
                $slug = $item['slug'] ?? Str::slug($item['kode_skema'] ?? '');
                $selectedSlugs[] = str_replace('-', '_', strtolower($slug));
            }

            // Cek apakah centrifuge dan overhead stirrer sama-sama dipilih
            $hasCentrifuge = in_array('centrifuge', $selectedSlugs) || in_array('up_centrifuge', $selectedSlugs);
            $hasOverhead   = in_array('overhead_stirrer', $selectedSlugs) || in_array('up_overhead_stirrer', $selectedSlugs);
            $eligibleBundleDiscount = $hasCentrifuge && $hasOverhead;

            $diskonNominal = $eligibleBundleDiscount ? 1000000.00 : 0.00;
            $catatanDiskon = $eligibleBundleDiscount
                ? 'Diskon Bundling Khusus Skema Centrifuge & Overhead Stirrer (Rp 1.000.000,00)'
                : null;
            $totalBiayaBersih = max(0, $totalBiayaKotor - $diskonNominal);

            // 3. Simpan Header Permohonan
            $permohonan = Permohonan::create([
                'id'               => (string) Str::uuid(),
                'id_pt_ins'        => $user?->id_pt_ins ?? null,
                'no_permohonan'    => $noPermohonan,
                'is_split_bill'    => false,
                'status_workflow'  => 'PERMOHONAN',
                'status_bayar'     => 'BELUM',
                'tgl_order'        => now(),
                'harga_permohonan' => $totalBiayaBersih,
                'created_by'       => $userId,
                'ip_address'       => $request->ip(),
            ]);

            // 4. Simpan Data Form PUP
            $formPup = FormPup::create([
                'id'                      => (string) Str::uuid(),
                'permohonan_id'           => $permohonan->id,
                'nama_pengisi'            => $request->input('nama_pengisi'),
                'email_pemohon'           => $request->input('email_pemohon'),
                'nama_narahubung'         => $request->input('nama_narahubung'),
                'no_wa_narahubung'        => $request->input('no_wa_narahubung'),
                'nama_lab_kalibrasi'      => $request->input('nama_lab_kalibrasi'),
                'alamat_lab_kalibrasi'    => $request->input('alamat_lab_kalibrasi'),
                'kota_kabupaten_lab'      => $request->input('kota_kabupaten_lab'),
                'email_official_lab'      => $request->input('email_official_lab'),
                'nama_personil_pengesah'  => $request->input('nama_personil_pengesah'),
                'jabatan_personil_pengesah'=> $request->input('jabatan_personil_pengesah'),
                'periode_pendaftaran'     => $request->input('periode_pendaftaran', 'EARLY_BIRD'),
                'total_biaya_kotor'       => $totalBiayaKotor,
                'diskon_nominal'          => $diskonNominal,
                'total_biaya_bersih'      => $totalBiayaBersih,
                'catatan_diskon'          => $catatanDiskon,
                'konfirmasi_equipment'    => $request->input('konfirmasi_equipment', []),
                'pernyataan_en_score'     => (bool) $request->input('pernyataan_en_score', true),
                'pernyataan_proposal'     => (bool) $request->input('pernyataan_proposal', true),
                'disetujui_pada'          => now(),
            ]);

            // 5. Simpan Rincian Skema Item
            foreach ($skemaItems as $item) {
                FormPupItem::create([
                    'id'                     => (string) Str::uuid(),
                    'form_pup_id'            => $formPup->id,
                    'kode_skema'             => $item['kode_skema'] ?? '',
                    'nama_skema'             => $item['nama_skema'] ?? '',
                    'metode_kalibrasi_acuan' => $item['metode_kalibrasi_acuan'] ?? null,
                    'is_in_situ'             => (bool) ($item['is_in_situ'] ?? false),
                    'tarif_pnbp'             => (float) ($item['tarif_pnbp'] ?? 0),
                ]);
            }

            // 6. Hubungkan ke Detail Permohonan (Polymorphic Entity Core Polimer)
            $lingkup = MasterLingkupLayanan::where('slug', 'LIKE', '%up-kalibrasi%')
                ->orWhere('lingkup', 'LIKE', '%Uji Profisiensi%')
                ->first();

            if ($lingkup) {
                DetailPermohonan::create([
                    'id'                 => (string) Str::uuid(),
                    'permohonan_id'      => $permohonan->id,
                    'formable_id'        => $formPup->id,
                    'formable_type'      => FormPup::class,
                    'lingkup_layanan_id' => $lingkup->id,
                ]);
            }

            // 7. Buat Rincian Tagihan Awal di detail_pembayaran
            foreach ($skemaItems as $item) {
                DetailPembayaran::create([
                    'id'            => (string) Str::uuid(),
                    'id_pt_ins'     => $user?->id_pt_ins ?? null,
                    'permohonan_id' => $permohonan->id,
                    'kode_tarif'    => $item['kode_skema'] ?? null,
                    'item_bayar'    => $item['nama_skema'],
                    'harga_satuan'  => (float) ($item['tarif_pnbp'] ?? 0),
                    'kuantitas'     => 1,
                    'subtotal'      => (float) ($item['tarif_pnbp'] ?? 0),
                ]);
            }

            // Tambahkan baris potongan diskon jika bundling berlaku
            if ($eligibleBundleDiscount && $diskonNominal > 0) {
                DetailPembayaran::create([
                    'id'            => (string) Str::uuid(),
                    'id_pt_ins'     => $user?->id_pt_ins ?? null,
                    'permohonan_id' => $permohonan->id,
                    'kode_tarif'    => 'DISCOUNT-BUNDLE-UP',
                    'item_bayar'    => 'Potongan Diskon Bundling (Centrifuge + Overhead Stirrer)',
                    'harga_satuan'  => -$diskonNominal,
                    'kuantitas'     => 1,
                    'subtotal'      => -$diskonNominal,
                ]);
            }

            // 8. Catat Milestone Timeline Log
            PermohonanTrackingLog::create([
                'id'             => (string) Str::uuid(),
                'permohonan_id'  => $permohonan->id,
                'sumber'         => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul'          => 'Pendaftaran Uji Profisiensi (PUP) Diajukan',
                'deskripsi'      => 'Permohonan pendaftaran Uji Profisiensi #' . $permohonan->no_permohonan . ' berhasil diajukan untuk ' . count($skemaItems) . ' skema artefak kalibrasi.',
            ]);

            DB::commit();

            // 9. Kirim Notifikasi ke Admin Marketing
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Pendaftaran Uji Profisiensi Baru',
                    'Pendaftaran #' . $permohonan->no_permohonan . ' dari ' . $formPup->nama_lab_kalibrasi,
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin PUP: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran Uji Profisiensi berhasil diajukan!',
                'data'    => [
                    'id'            => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'total_biaya'   => $totalBiayaBersih,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('PupController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan pendaftaran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tampilkan detail pendaftaran PUP
     */
    public function show(string $id): JsonResponse
    {
        try {
            $permohonan = Permohonan::where('id', $id)
                ->orWhere('no_permohonan', $id)
                ->with(['formPup.items', 'detailPembayaran', 'trackingLogs'])
                ->first();

            if (!$permohonan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Permohonan Uji Profisiensi tidak ditemukan',
                ], 404);
            }

            $formPup = $permohonan->formPup->first();

            return response()->json([
                'success' => true,
                'data'    => [
                    'permohonan'        => $permohonan,
                    'form_pup'          => $formPup,
                    'items'             => $formPup?->items ?? [],
                    'detail_pembayaran' => $permohonan->detailPembayaran,
                    'tracking_logs'     => $permohonan->trackingLogs,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('PupController::show Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Memperbarui formulir pendaftaran Uji Profisiensi (PUP)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->orWhere('no_permohonan', $id)
            ->first();

        if (!$permohonan) {
            $form = FormPup::where('id', $id)->first();
            $permohonan = $form ? Permohonan::find($form->permohonan_id) : null;
        }

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan Uji Profisiensi tidak ditemukan.',
            ], 404);
        }

        $userId = auth()->id();
        $currentUser = auth()->user();

        // Validasi kepemilikan data (mitigasi IDOR)
        if ($permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk mengubah permohonan ini.',
            ], 403);
        }

        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI', 'PERMOHONAN'])) {
            return response()->json([
                'success' => false,
                'message' => "Permohonan dengan status {$permohonan->status_workflow} tidak dapat diubah.",
            ], 400);
        }

        $formPup = FormPup::where('permohonan_id', $permohonan->id)->first();
        if (!$formPup) {
            return response()->json([
                'success' => false,
                'message' => 'Form Uji Profisiensi tidak ditemukan.',
            ], 404);
        }

        DB::beginTransaction();
        try {
            $fillable = [
                'nama_lab_kalibrasi', 'no_akreditasi_kan', 'masa_berlaku_akreditasi',
                'alamat_laboratorium', 'telepon_laboratorium', 'email_laboratorium',
                'pic_nama', 'pic_jabatan', 'pic_telepon', 'pic_email',
                'penanggung_jawab_biaya', 'alamat_penagihan', 'npwp_penagihan',
                'penerima_laporan_nama', 'penerima_laporan_alamat', 'catatan_khusus'
            ];

            foreach ($fillable as $col) {
                if ($request->has($col)) {
                    $formPup->{$col} = $request->input($col);
                }
            }

            if ($request->has('is_akreditasi_kan')) {
                $formPup->is_akreditasi_kan = filter_var($request->input('is_akreditasi_kan'), FILTER_VALIDATE_BOOLEAN);
            }

            // Update items jika diberikan
            $skemaCodes = $request->input('skema_terpilih') ?? $request->input('selectedSkemas');
            if (is_array($skemaCodes) && !empty($skemaCodes)) {
                FormPupItem::where('form_pup_id', $formPup->id)->delete();
                DetailPembayaran::where('permohonan_id', $permohonan->id)->delete();

                $skemaCatalogIndexed = collect($this->skemaCatalog)->keyBy('kode_skema');
                $totalKotor = 0;
                $hasCentrifuge = false;
                $hasOverheadStirrer = false;

                foreach ($skemaCodes as $kode) {
                    $cat = $skemaCatalogIndexed->get($kode);
                    if (!$cat) continue;

                    $harga = (float) $cat['harga_promo'];
                    $totalKotor += $harga;

                    if ($kode === 'UP-CENTRIFUGE') $hasCentrifuge = true;
                    if ($kode === 'UP-OVERHEAD-STIRRER') $hasOverheadStirrer = true;

                    FormPupItem::create([
                        'id' => (string) Str::uuid(),
                        'form_pup_id' => $formPup->id,
                        'kode_skema' => $cat['kode_skema'],
                        'nama_skema' => $cat['nama'],
                        'kategori' => $cat['kategori'],
                        'tarif_pnbp' => $harga,
                        'requires_equipment' => (bool) $cat['requires_equipment'],
                        'equipment_group' => $cat['equipment_group'] ?? null,
                    ]);

                    DetailPembayaran::create([
                        'id' => (string) Str::uuid(),
                        'id_pt_ins' => $permohonan->id_pt_ins,
                        'permohonan_id' => $permohonan->id,
                        'kode_tarif' => $cat['kode_skema'],
                        'item_bayar' => $cat['nama'],
                        'harga_satuan' => $harga,
                        'kuantitas' => 1,
                        'subtotal' => $harga,
                    ]);
                }

                $diskonNominal = 0;
                if ($hasCentrifuge && $hasOverheadStirrer) {
                    $diskonNominal = 1000000;
                    DetailPembayaran::create([
                        'id' => (string) Str::uuid(),
                        'id_pt_ins' => $permohonan->id_pt_ins,
                        'permohonan_id' => $permohonan->id,
                        'kode_tarif' => 'DISCOUNT-BUNDLE-UP',
                        'item_bayar' => 'Potongan Diskon Bundling (Centrifuge + Overhead Stirrer)',
                        'harga_satuan' => -$diskonNominal,
                        'kuantitas' => 1,
                        'subtotal' => -$diskonNominal,
                    ]);
                }

                $totalBersih = max(0, $totalKotor - $diskonNominal);
                $formPup->total_biaya_kotor = $totalKotor;
                $formPup->diskon_bundling = $diskonNominal;
                $formPup->total_biaya_bersih = $totalBersih;
                $formPup->total_skema_dipilih = count($skemaCodes);

                $permohonan->total_harga = $totalBersih;
            }

            $formPup->save();
            $permohonan->save();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran Uji Profisiensi berhasil diperbarui!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'total_biaya' => $permohonan->total_harga,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('PupController::update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui pendaftaran PUP: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengajukan ulang permohonan Uji Profisiensi (PUP) setelah revisi
     */
    public function ajukanUlang(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->orWhere('no_permohonan', $id)
            ->first();

        if (!$permohonan) {
            $form = FormPup::where('id', $id)->first();
            $permohonan = $form ? Permohonan::find($form->permohonan_id) : null;
        }

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan Uji Profisiensi tidak ditemukan.',
            ], 404);
        }

        $userId = auth()->id();
        $currentUser = auth()->user();

        // Validasi kepemilikan data (mitigasi IDOR)
        if ($permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk mengajukan permohonan ini.',
            ], 403);
        }

        if (!in_array($permohonan->status_workflow, ['REVISI', 'DRAFT'])) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya permohonan dengan status REVISI atau DRAFT yang dapat diajukan ulang.',
            ], 400);
        }

        if ($request->has('nama_lab_kalibrasi') || $request->has('skema_terpilih')) {
            $updateResponse = $this->update($request, $id);
            if ($updateResponse->getStatusCode() !== 200) {
                return $updateResponse;
            }
        }

        DB::beginTransaction();
        try {
            $permohonan->update([
                'status_workflow' => 'PERMOHONAN',
                'tgl_order' => now(),
            ]);

            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_DIAJUKAN_ULANG',
                'judul' => 'Pendaftaran Uji Profisiensi Diajukan Ulang',
                'deskripsi' => 'Pemohon telah melakukan revisi formulir PUP #' . $permohonan->no_permohonan . ' dan mengajukan kembali untuk diverifikasi.',
            ]);

            DB::commit();

            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Pendaftaran Uji Profisiensi Diajukan Ulang',
                    'Pendaftaran Uji Profisiensi #' . $permohonan->no_permohonan . ' telah diajukan ulang oleh pemohon.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin ajukan ulang PUP: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran Uji Profisiensi berhasil diajukan ulang!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => 'PERMOHONAN',
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('PupController::ajukanUlang Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengajukan ulang pendaftaran: ' . $e->getMessage(),
            ], 500);
        }
    }
}
