<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// Models DB2
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\FormHalal;
use App\Helpers\NotifHelper;

class HalalController extends Controller
{
    /**
     * Menyimpan formulir permohonan sertifikasi halal LPH BBSPJIKKP
     */
    public function store(Request $request): JsonResponse
    {
        // Decode nested JSON jika dikirim dalam FormData multipart
        $dataPengajuan = is_string($request->input('dataPengajuan'))
            ? json_decode($request->input('dataPengajuan'), true)
            : $request->input('dataPengajuan', []);

        $dataPelakuUsaha = is_string($request->input('dataPelakuUsaha'))
            ? json_decode($request->input('dataPelakuUsaha'), true)
            : $request->input('dataPelakuUsaha', []);

        $dataFasilitas = is_string($request->input('dataFasilitas'))
            ? json_decode($request->input('dataFasilitas'), true)
            : $request->input('dataFasilitas', []);

        $dataPenyelia = is_string($request->input('dataPenyelia'))
            ? json_decode($request->input('dataPenyelia'), true)
            : $request->input('dataPenyelia', []);

        $dataBahan = is_string($request->input('dataBahan'))
            ? json_decode($request->input('dataBahan'), true)
            : $request->input('dataBahan', []);

        $dataProduk = is_string($request->input('dataProduk'))
            ? json_decode($request->input('dataProduk'), true)
            : $request->input('dataProduk', []);

        // Sanitasi field bertipe date dan nullable agar string kosong "" menjadi null
        if (isset($dataPengajuan['kode_fasilitasi']) && trim((string)$dataPengajuan['kode_fasilitasi']) === '') {
            $dataPengajuan['kode_fasilitasi'] = null;
        }
        if (isset($dataPelakuUsaha['npwp']) && trim((string)$dataPelakuUsaha['npwp']) === '') {
            $dataPelakuUsaha['npwp'] = null;
        }
        if (isset($dataPelakuUsaha['pj_email']) && trim((string)$dataPelakuUsaha['pj_email']) === '') {
            $dataPelakuUsaha['pj_email'] = null;
        }
        if (isset($dataPelakuUsaha['pj_alamat']) && trim((string)$dataPelakuUsaha['pj_alamat']) === '') {
            $dataPelakuUsaha['pj_alamat'] = null;
        }
        if (isset($dataPenyelia['penyelia_no_sk']) && trim((string)$dataPenyelia['penyelia_no_sk']) === '') {
            $dataPenyelia['penyelia_no_sk'] = null;
        }
        if (isset($dataPenyelia['penyelia_tgl_sk']) && trim((string)$dataPenyelia['penyelia_tgl_sk']) === '') {
            $dataPenyelia['penyelia_tgl_sk'] = null;
        }
        if (isset($dataPenyelia['penyelia_no_sertifikat']) && trim((string)$dataPenyelia['penyelia_no_sertifikat']) === '') {
            $dataPenyelia['penyelia_no_sertifikat'] = null;
        }
        if (isset($dataPenyelia['penyelia_tgl_sertifikat']) && trim((string)$dataPenyelia['penyelia_tgl_sertifikat']) === '') {
            $dataPenyelia['penyelia_tgl_sertifikat'] = null;
        }

        $request->merge([
            'dataPengajuan' => $dataPengajuan,
            'dataPelakuUsaha' => $dataPelakuUsaha,
            'dataFasilitas' => $dataFasilitas,
            'dataPenyelia' => $dataPenyelia,
            'dataBahan' => $dataBahan,
            'dataProduk' => $dataProduk,
        ]);

        $isDraft = (bool) ($request->input('is_draft') ?? $request->input('isDraft', false)) || ($request->input('aksi') === 'draft');
        $isAjukan = !$isDraft;

        $request->validate([
            // 1. Data Pengajuan
            'dataPengajuan' => 'required|array',
            'dataPengajuan.jalur_pendaftaran' => $isAjukan ? 'required|in:reguler,self_declare' : 'nullable|in:reguler,self_declare',
            'dataPengajuan.jenis_pendaftaran' => $isAjukan ? 'required|in:baru,pengembangan' : 'nullable|in:baru,pengembangan',
            'dataPengajuan.kode_fasilitasi' => 'nullable|string|max:100',

            // 2. Data Pelaku Usaha
            'dataPelakuUsaha' => 'required|array',
            'dataPelakuUsaha.nama_usaha' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataPelakuUsaha.skala_usaha' => $isAjukan ? 'required|in:mikro,kecil,menengah,besar,luar_negeri' : 'nullable|string|max:50',
            'dataPelakuUsaha.nib' => $isAjukan ? 'required|string|max:50' : 'nullable|string|max:50',
            'dataPelakuUsaha.npwp' => 'nullable|string|max:50',
            'dataPelakuUsaha.pj_nama' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataPelakuUsaha.pj_kontak' => $isAjukan ? 'required|string|max:50' : 'nullable|string|max:50',
            'dataPelakuUsaha.pj_email' => 'nullable|email|max:255',
            'dataPelakuUsaha.pj_alamat' => 'nullable|string',

            // 3. Data Fasilitas Pabrik & Outlet
            'dataFasilitas' => $isAjukan ? 'required|array' : 'nullable|array',
            'dataFasilitas.pabrik' => $isAjukan ? 'required|array|min:1' : 'nullable|array',
            'dataFasilitas.pabrik.*.nama' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataFasilitas.pabrik.*.alamat' => $isAjukan ? 'required|string' : 'nullable|string',
            'dataFasilitas.pabrik.*.status_pabrik' => 'nullable|string',
            'dataFasilitas.outlet' => 'nullable|array',

            // 4. Data Penyelia Halal
            'dataPenyelia' => $isAjukan ? 'required|array' : 'nullable|array',
            'dataPenyelia.penyelia_nama' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataPenyelia.penyelia_nik' => $isAjukan ? 'required|string|max:50' : 'nullable|string|max:50',
            'dataPenyelia.penyelia_agama' => 'nullable|string|max:50',
            'dataPenyelia.penyelia_kontak' => $isAjukan ? 'required|string|max:50' : 'nullable|string|max:50',
            'dataPenyelia.penyelia_no_sk' => 'nullable|string|max:100',
            'dataPenyelia.penyelia_tgl_sk' => 'nullable|date',
            'dataPenyelia.penyelia_no_sertifikat' => 'nullable|string|max:100',
            'dataPenyelia.penyelia_tgl_sertifikat' => 'nullable|date',

            // 5. Data Bahan
            'dataBahan' => $isAjukan ? 'required|array|min:1' : 'nullable|array',
            'dataBahan.*.nama_bahan' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataBahan.*.jenis_bahan' => $isAjukan ? 'required|string' : 'nullable|string',

            // 6. Data Produk
            'dataProduk' => $isAjukan ? 'required|array|min:1' : 'nullable|array',
            'dataProduk.*.nama_produk' => $isAjukan ? 'required|string|max:255' : 'nullable|string|max:255',
            'dataProduk.*.klasifikasi' => 'nullable|string',

            // Berkas Upload
            'file_denah_lokasi' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_sk_penyelia' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_ktp_penyelia' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_sertifikat_penyelia' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_alur_proses' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_surat_permohonan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'file_manual_sjph' => 'nullable|file|mimes:pdf,doc,docx|max:10240',

            // Pernyataan
            'pernyataan_bebas_babi' => $isAjukan ? 'required|boolean|accepted' : 'nullable',
            'pernyataan_komitmen_sjph' => $isAjukan ? 'required|boolean|accepted' : 'nullable',
        ]);

        DB::beginTransaction();

        try {
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';

            // Generate Nomor Permohonan Berurutan: 0001/HLL/{BulanRomawi}/{Tahun}
            $romawiMap = [
                1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
                7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
            ];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/HLL/' . $bulanRomawi . '/' . now()->format('Y');

            $lastPermohonan = Permohonan::withTrashed()
                ->where('no_permohonan', 'LIKE', "%{$suffix}")
                ->lockForUpdate()
                ->orderBy('no_permohonan', 'desc')
                ->first();

            if ($lastPermohonan) {
                $parts = explode('/', $lastPermohonan->no_permohonan);
                $lastNumber = (int) $parts[0];
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            $noPermohonan = str_pad($nextNumber, 4, '0', STR_PAD_LEFT) . $suffix;

            // Helper upload berkas
            $uploadFile = function ($fileKey, $prefix) use ($request) {
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $filename = $prefix . '_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                    return $file->storeAs('permohonan/halal', $filename, 'public');
                }
                return null;
            };

            $pathDenah = $uploadFile('file_denah_lokasi', 'denah_pabrik');
            $pathSkPenyelia = $uploadFile('file_sk_penyelia', 'sk_penyelia');
            $pathKtpPenyelia = $uploadFile('file_ktp_penyelia', 'ktp_penyelia');
            $pathSertifikatPenyelia = $uploadFile('file_sertifikat_penyelia', 'sertifikat_penyelia');
            $pathAlurProses = $uploadFile('file_alur_proses', 'alur_proses');
            $pathSuratPermohonan = $uploadFile('file_surat_permohonan', 'surat_halal');
            $pathManualSjph = $uploadFile('file_manual_sjph', 'manual_sjph');

            $user = auth()->user();

            // 1. Simpan Header Permohonan
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => $isAjukan ? 'PERMOHONAN' : 'DRAFT',
                'status_bayar' => 'BELUM',
                'tgl_order' => $isAjukan ? now() : null,
                'created_by' => $userId,
                'ip_address' => $request->ip(),
            ]);

            // 2. Simpan Form Halal
            $formHalal = FormHalal::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'jalur_pendaftaran' => $dataPengajuan['jalur_pendaftaran'] ?? 'reguler',
                'jenis_pendaftaran' => $dataPengajuan['jenis_pendaftaran'] ?? 'baru',
                'kode_fasilitasi' => !empty($dataPengajuan['kode_fasilitasi']) ? $dataPengajuan['kode_fasilitasi'] : null,
                'nama_usaha' => !empty($dataPelakuUsaha['nama_usaha']) ? $dataPelakuUsaha['nama_usaha'] : ($user?->pelanggan?->detail?->nama_perusahaan ?? $user?->name ?? 'Draft Usaha'),
                'skala_usaha' => $dataPelakuUsaha['skala_usaha'] ?? 'mikro',
                'nib' => !empty($dataPelakuUsaha['nib']) ? $dataPelakuUsaha['nib'] : ($user?->pelanggan?->detail?->nib ?? '-'),
                'npwp' => !empty($dataPelakuUsaha['npwp']) ? $dataPelakuUsaha['npwp'] : null,
                'pj_nama' => !empty($dataPelakuUsaha['pj_nama']) ? $dataPelakuUsaha['pj_nama'] : ($user?->name ?? 'Draft Pemohon'),
                'pj_kontak' => !empty($dataPelakuUsaha['pj_kontak']) ? $dataPelakuUsaha['pj_kontak'] : ($user?->pelanggan?->detail?->no_hp ?? '-'),
                'pj_email' => !empty($dataPelakuUsaha['pj_email']) ? $dataPelakuUsaha['pj_email'] : null,
                'pj_alamat' => !empty($dataPelakuUsaha['pj_alamat']) ? $dataPelakuUsaha['pj_alamat'] : null,
                'pabrik_json' => $dataFasilitas['pabrik'] ?? [],
                'outlet_json' => $dataFasilitas['outlet'] ?? [],
                'file_denah_lokasi' => $pathDenah,
                'penyelia_nama' => !empty($dataPenyelia['penyelia_nama']) ? $dataPenyelia['penyelia_nama'] : ($user?->name ?? 'Draft Penyelia'),
                'penyelia_nik' => !empty($dataPenyelia['penyelia_nik']) ? $dataPenyelia['penyelia_nik'] : '-',
                'penyelia_agama' => $dataPenyelia['penyelia_agama'] ?? 'Islam',
                'penyelia_kontak' => !empty($dataPenyelia['penyelia_kontak']) ? $dataPenyelia['penyelia_kontak'] : '-',
                'penyelia_no_sk' => !empty($dataPenyelia['penyelia_no_sk']) ? $dataPenyelia['penyelia_no_sk'] : null,
                'penyelia_tgl_sk' => !empty($dataPenyelia['penyelia_tgl_sk']) ? $dataPenyelia['penyelia_tgl_sk'] : null,
                'penyelia_no_sertifikat' => !empty($dataPenyelia['penyelia_no_sertifikat']) ? $dataPenyelia['penyelia_no_sertifikat'] : null,
                'penyelia_tgl_sertifikat' => !empty($dataPenyelia['penyelia_tgl_sertifikat']) ? $dataPenyelia['penyelia_tgl_sertifikat'] : null,
                'file_sk_penyelia' => $pathSkPenyelia,
                'file_ktp_penyelia' => $pathKtpPenyelia,
                'file_sertifikat_penyelia' => $pathSertifikatPenyelia,
                'bahan_json' => $dataBahan,
                'produk_json' => $dataProduk,
                'alur_proses' => !empty($dataProduk['alur_proses']) ? $dataProduk['alur_proses'] : null,
                'file_alur_proses' => $pathAlurProses,
                'file_surat_permohonan' => $pathSuratPermohonan,
                'file_manual_sjph' => $pathManualSjph,
                'pernyataan_bebas_babi' => $isAjukan ? true : (bool) ($request->input('pernyataan_bebas_babi') ?? false),
                'pernyataan_komitmen_sjph' => $isAjukan ? true : (bool) ($request->input('pernyataan_komitmen_sjph') ?? false),
                'pernyataan_at' => $isAjukan ? now() : null,
            ]);

            // 3. Hubungkan ke Master Lingkup Layanan
            $isSelfDeclare = ($dataPengajuan['jalur_pendaftaran'] ?? '') === 'self_declare';
            $targetSlug = $isSelfDeclare ? 'halal-umk' : 'halal-reguler';

            $lingkup = MasterLingkupLayanan::where('slug', $targetSlug)
                ->orWhere('slug', 'LIKE', '%halal%')
                ->first();

            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'halal')
                    ->orWhere('jenis_layanan', 'LIKE', '%halal%')
                    ->first();

                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'Pemeriksaan Halal',
                        'slug' => 'halal',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => $isSelfDeclare ? 'Halal UMK (Self Declare)' : 'Halal Reguler (Audit LPH)',
                    'slug' => $targetSlug,
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $formHalal->id,
                'formable_type' => FormHalal::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);

            // 4. Catat Milestone Timeline Pelacakan
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => $isAjukan ? 'PERMOHONAN_MASUK' : 'PERMOHONAN_DRAFT',
                'judul' => $isAjukan ? 'Permohonan Sertifikasi Halal Diajukan' : 'Draft Permohonan Sertifikasi Halal Disimpan',
                'deskripsi' => $isAjukan
                    ? 'Permohonan pemeriksaan halal LPH #' . $permohonan->no_permohonan . ' (' . ($isSelfDeclare ? 'Self Declare' : 'Reguler') . ') berhasil diajukan dan menunggu verifikasi petugas LPH.'
                    : 'Permohonan pemeriksaan halal LPH #' . $permohonan->no_permohonan . ' disimpan sebagai draft oleh pemohon.',
            ]);

            DB::commit();

            // 5. Kirim Notifikasi Internal Admin jika bukan draft
            if ($isAjukan) {
                try {
                    $adminIds = NotifHelper::getAdminUserIds();
                    NotifHelper::notifyMany(
                        $adminIds,
                        'Permohonan Halal Baru',
                        'Permohonan pemeriksaan halal #' . $permohonan->no_permohonan . ' dari ' . $formHalal->nama_usaha,
                        route('permohonan.layanan.detail', $permohonan->id)
                    );
                } catch (\Exception $notifEx) {
                    Log::warning('Gagal kirim notifikasi admin Halal: ' . $notifEx->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => $isAjukan ? 'Permohonan sertifikasi halal berhasil diajukan!' : 'Draft permohonan sertifikasi halal berhasil disimpan!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => $permohonan->status_workflow,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasi formulir gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error submit permohonan Halal: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat menyimpan permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengambil data formulir permohonan sertifikasi halal
     */
    public function show(string $id): JsonResponse
    {
        $permohonan = Permohonan::with([
            'detailPermohonan.lingkupLayanan',
            'detailPembayaran',
            'creator',
            'trackingLogs',
            'formHalal',
        ])->findOrFail($id);

        $formHalal = $permohonan->formHalal->first();

        return response()->json([
            'success' => true,
            'data' => [
                'permohonan' => $permohonan,
                'form_halal' => $formHalal,
            ],
        ]);
    }

    /**
     * Memperbarui formulir permohonan sertifikasi halal
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->orWhere('no_permohonan', $id)
            ->first();

        if (!$permohonan) {
            $formHalal = FormHalal::where('id', $id)->first();
            $permohonan = $formHalal ? Permohonan::find($formHalal->permohonan_id) : null;
        }

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan sertifikasi halal tidak ditemukan.',
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

        $formHalal = FormHalal::where('permohonan_id', $permohonan->id)->first();
        if (!$formHalal) {
            return response()->json([
                'success' => false,
                'message' => 'Data formulir halal tidak ditemukan.',
            ], 404);
        }

        // Decode JSON inputs jika berbentuk string FormData
        $dataPengajuan = is_string($request->input('dataPengajuan'))
            ? json_decode($request->input('dataPengajuan'), true)
            : $request->input('dataPengajuan', []);

        $dataPelakuUsaha = is_string($request->input('dataPelakuUsaha'))
            ? json_decode($request->input('dataPelakuUsaha'), true)
            : $request->input('dataPelakuUsaha', []);

        $dataFasilitas = is_string($request->input('dataFasilitas'))
            ? json_decode($request->input('dataFasilitas'), true)
            : $request->input('dataFasilitas', []);

        $dataPenyelia = is_string($request->input('dataPenyelia'))
            ? json_decode($request->input('dataPenyelia'), true)
            : $request->input('dataPenyelia', []);

        $dataBahan = is_string($request->input('dataBahan'))
            ? json_decode($request->input('dataBahan'), true)
            : $request->input('dataBahan', []);

        $dataProduk = is_string($request->input('dataProduk'))
            ? json_decode($request->input('dataProduk'), true)
            : $request->input('dataProduk', []);

        DB::beginTransaction();
        try {
            // Upload update berkas bila ada
            if ($request->hasFile('file_denah_lokasi')) {
                $formHalal->file_denah_lokasi = $request->file('file_denah_lokasi')->store('halal/denah', 'public');
            }
            if ($request->hasFile('file_sk_penyelia')) {
                $formHalal->file_sk_penyelia = $request->file('file_sk_penyelia')->store('halal/sk_penyelia', 'public');
            }
            if ($request->hasFile('file_ktp_penyelia')) {
                $formHalal->file_ktp_penyelia = $request->file('file_ktp_penyelia')->store('halal/ktp_penyelia', 'public');
            }
            if ($request->hasFile('file_sertifikat_penyelia')) {
                $formHalal->file_sertifikat_penyelia = $request->file('file_sertifikat_penyelia')->store('halal/sertifikat_penyelia', 'public');
            }
            if ($request->hasFile('file_alur_proses')) {
                $formHalal->file_alur_proses = $request->file('file_alur_proses')->store('halal/alur_proses', 'public');
            }
            if ($request->hasFile('file_surat_permohonan')) {
                $formHalal->file_surat_permohonan = $request->file('file_surat_permohonan')->store('halal/surat_permohonan', 'public');
            }
            if ($request->hasFile('file_manual_sjph')) {
                $formHalal->file_manual_sjph = $request->file('file_manual_sjph')->store('halal/manual_sjph', 'public');
            }

            if (!empty($dataPengajuan['jalur_pendaftaran'])) $formHalal->jalur_pendaftaran = $dataPengajuan['jalur_pendaftaran'];
            if (!empty($dataPengajuan['jenis_pendaftaran'])) $formHalal->jenis_pendaftaran = $dataPengajuan['jenis_pendaftaran'];
            if (isset($dataPengajuan['kode_fasilitasi'])) $formHalal->kode_fasilitasi = !empty($dataPengajuan['kode_fasilitasi']) ? $dataPengajuan['kode_fasilitasi'] : null;

            if (!empty($dataPelakuUsaha['nama_usaha'])) $formHalal->nama_usaha = $dataPelakuUsaha['nama_usaha'];
            if (!empty($dataPelakuUsaha['skala_usaha'])) $formHalal->skala_usaha = $dataPelakuUsaha['skala_usaha'];
            if (!empty($dataPelakuUsaha['nib'])) $formHalal->nib = $dataPelakuUsaha['nib'];
            if (isset($dataPelakuUsaha['npwp'])) $formHalal->npwp = !empty($dataPelakuUsaha['npwp']) ? $dataPelakuUsaha['npwp'] : null;
            if (!empty($dataPelakuUsaha['pj_nama'])) $formHalal->pj_nama = $dataPelakuUsaha['pj_nama'];
            if (!empty($dataPelakuUsaha['pj_kontak'])) $formHalal->pj_kontak = $dataPelakuUsaha['pj_kontak'];
            if (isset($dataPelakuUsaha['pj_email'])) $formHalal->pj_email = !empty($dataPelakuUsaha['pj_email']) ? $dataPelakuUsaha['pj_email'] : null;
            if (isset($dataPelakuUsaha['pj_alamat'])) $formHalal->pj_alamat = !empty($dataPelakuUsaha['pj_alamat']) ? $dataPelakuUsaha['pj_alamat'] : null;

            if (!empty($dataFasilitas['pabrik'])) $formHalal->pabrik_json = $dataFasilitas['pabrik'];
            if (isset($dataFasilitas['outlet'])) $formHalal->outlet_json = $dataFasilitas['outlet'];

            if (!empty($dataPenyelia['penyelia_nama'])) $formHalal->penyelia_nama = $dataPenyelia['penyelia_nama'];
            if (!empty($dataPenyelia['penyelia_nik'])) $formHalal->penyelia_nik = $dataPenyelia['penyelia_nik'];
            if (!empty($dataPenyelia['penyelia_agama'])) $formHalal->penyelia_agama = $dataPenyelia['penyelia_agama'];
            if (!empty($dataPenyelia['penyelia_kontak'])) $formHalal->penyelia_kontak = $dataPenyelia['penyelia_kontak'];
            if (isset($dataPenyelia['penyelia_no_sk'])) $formHalal->penyelia_no_sk = !empty($dataPenyelia['penyelia_no_sk']) ? $dataPenyelia['penyelia_no_sk'] : null;
            if (isset($dataPenyelia['penyelia_tgl_sk'])) $formHalal->penyelia_tgl_sk = !empty($dataPenyelia['penyelia_tgl_sk']) ? $dataPenyelia['penyelia_tgl_sk'] : null;
            if (isset($dataPenyelia['penyelia_no_sertifikat'])) $formHalal->penyelia_no_sertifikat = !empty($dataPenyelia['penyelia_no_sertifikat']) ? $dataPenyelia['penyelia_no_sertifikat'] : null;
            if (isset($dataPenyelia['penyelia_tgl_sertifikat'])) $formHalal->penyelia_tgl_sertifikat = !empty($dataPenyelia['penyelia_tgl_sertifikat']) ? $dataPenyelia['penyelia_tgl_sertifikat'] : null;

            if (!empty($dataBahan)) $formHalal->bahan_json = $dataBahan;
            if (!empty($dataProduk)) {
                $formHalal->produk_json = $dataProduk;
                if (!empty($dataProduk['alur_proses'])) $formHalal->alur_proses = $dataProduk['alur_proses'];
            }

            $formHalal->save();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan sertifikasi halal berhasil diperbarui!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('HalalController::update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui formulir halal: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengajukan ulang permohonan sertifikasi halal setelah revisi
     */
    public function ajukanUlang(Request $request, string $id): JsonResponse
    {
        $permohonan = Permohonan::where('id', $id)
            ->orWhere('no_permohonan', $id)
            ->first();

        if (!$permohonan) {
            $formHalal = FormHalal::where('id', $id)->first();
            $permohonan = $formHalal ? Permohonan::find($formHalal->permohonan_id) : null;
        }

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan sertifikasi halal tidak ditemukan.',
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

        // Update data jika dikirim payload baru
        if ($request->has('dataPengajuan') || $request->has('dataPelakuUsaha') || $request->has('dataFasilitas')) {
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
                'judul' => 'Permohonan Sertifikasi Halal Diajukan Ulang',
                'deskripsi' => 'Pemohon telah melakukan revisi formulir halal #' . $permohonan->no_permohonan . ' dan mengajukan kembali untuk diverifikasi.',
            ]);

            DB::commit();

            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Halal Diajukan Ulang',
                    'Permohonan sertifikasi halal #' . $permohonan->no_permohonan . ' telah diajukan ulang oleh pemohon.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin ajukan ulang halal: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan sertifikasi halal berhasil diajukan ulang!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => 'PERMOHONAN',
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('HalalController::ajukanUlang Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengajukan ulang permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
