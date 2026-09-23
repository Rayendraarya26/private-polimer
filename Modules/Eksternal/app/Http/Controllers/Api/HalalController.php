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

        $request->merge([
            'dataPengajuan' => $dataPengajuan,
            'dataPelakuUsaha' => $dataPelakuUsaha,
            'dataFasilitas' => $dataFasilitas,
            'dataPenyelia' => $dataPenyelia,
            'dataBahan' => $dataBahan,
            'dataProduk' => $dataProduk,
        ]);

        $request->validate([
            // 1. Data Pengajuan
            'dataPengajuan' => 'required|array',
            'dataPengajuan.jalur_pendaftaran' => 'required|in:reguler,self_declare',
            'dataPengajuan.jenis_pendaftaran' => 'required|in:baru,pengembangan',
            'dataPengajuan.kode_fasilitasi' => 'nullable|string|max:100',

            // 2. Data Pelaku Usaha
            'dataPelakuUsaha' => 'required|array',
            'dataPelakuUsaha.nama_usaha' => 'required|string|max:255',
            'dataPelakuUsaha.skala_usaha' => 'required|in:mikro,kecil,menengah,besar,luar_negeri',
            'dataPelakuUsaha.nib' => 'required|string|max:50',
            'dataPelakuUsaha.npwp' => 'nullable|string|max:50',
            'dataPelakuUsaha.pj_nama' => 'required|string|max:255',
            'dataPelakuUsaha.pj_kontak' => 'required|string|max:50',
            'dataPelakuUsaha.pj_email' => 'nullable|email|max:255',
            'dataPelakuUsaha.pj_alamat' => 'nullable|string',

            // 3. Data Fasilitas Pabrik & Outlet
            'dataFasilitas' => 'required|array',
            'dataFasilitas.pabrik' => 'required|array|min:1',
            'dataFasilitas.pabrik.*.nama' => 'required|string|max:255',
            'dataFasilitas.pabrik.*.alamat' => 'required|string',
            'dataFasilitas.pabrik.*.status_pabrik' => 'nullable|string',
            'dataFasilitas.outlet' => 'nullable|array',

            // 4. Data Penyelia Halal
            'dataPenyelia' => 'required|array',
            'dataPenyelia.penyelia_nama' => 'required|string|max:255',
            'dataPenyelia.penyelia_nik' => 'required|string|max:50',
            'dataPenyelia.penyelia_agama' => 'required|string|max:50',
            'dataPenyelia.penyelia_kontak' => 'required|string|max:50',
            'dataPenyelia.penyelia_no_sk' => 'nullable|string|max:100',
            'dataPenyelia.penyelia_tgl_sk' => 'nullable|date',
            'dataPenyelia.penyelia_no_sertifikat' => 'nullable|string|max:100',
            'dataPenyelia.penyelia_tgl_sertifikat' => 'nullable|date',

            // 5. Data Bahan
            'dataBahan' => 'required|array|min:1',
            'dataBahan.*.nama_bahan' => 'required|string|max:255',
            'dataBahan.*.jenis_bahan' => 'required|string',

            // 6. Data Produk
            'dataProduk' => 'required|array|min:1',
            'dataProduk.*.nama_produk' => 'required|string|max:255',
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
            'pernyataan_bebas_babi' => 'required|boolean|accepted',
            'pernyataan_komitmen_sjph' => 'required|boolean|accepted',
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

            // 1. Simpan Header Permohonan
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => 'PERMOHONAN',
                'status_bayar' => 'BELUM',
                'total_harga' => 0, // Akan ditetapkan via penawaran biaya/audit LPH
                'tgl_order' => now(),
                'created_by' => $userId,
                'ip_address' => $request->ip(),
            ]);

            // 2. Simpan Form Halal
            $formHalal = FormHalal::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'jalur_pendaftaran' => $dataPengajuan['jalur_pendaftaran'] ?? 'reguler',
                'jenis_pendaftaran' => $dataPengajuan['jenis_pendaftaran'] ?? 'baru',
                'kode_fasilitasi' => $dataPengajuan['kode_fasilitasi'] ?? null,
                'nama_usaha' => $dataPelakuUsaha['nama_usaha'],
                'skala_usaha' => $dataPelakuUsaha['skala_usaha'] ?? 'mikro',
                'nib' => $dataPelakuUsaha['nib'],
                'npwp' => $dataPelakuUsaha['npwp'] ?? null,
                'pj_nama' => $dataPelakuUsaha['pj_nama'],
                'pj_kontak' => $dataPelakuUsaha['pj_kontak'],
                'pj_email' => $dataPelakuUsaha['pj_email'] ?? null,
                'pj_alamat' => $dataPelakuUsaha['pj_alamat'] ?? null,
                'pabrik_json' => $dataFasilitas['pabrik'] ?? [],
                'outlet_json' => $dataFasilitas['outlet'] ?? [],
                'file_denah_lokasi' => $pathDenah,
                'penyelia_nama' => $dataPenyelia['penyelia_nama'],
                'penyelia_nik' => $dataPenyelia['penyelia_nik'],
                'penyelia_agama' => $dataPenyelia['penyelia_agama'] ?? 'Islam',
                'penyelia_kontak' => $dataPenyelia['penyelia_kontak'],
                'penyelia_no_sk' => $dataPenyelia['penyelia_no_sk'] ?? null,
                'penyelia_tgl_sk' => $dataPenyelia['penyelia_tgl_sk'] ?? null,
                'penyelia_no_sertifikat' => $dataPenyelia['penyelia_no_sertifikat'] ?? null,
                'penyelia_tgl_sertifikat' => $dataPenyelia['penyelia_tgl_sertifikat'] ?? null,
                'file_sk_penyelia' => $pathSkPenyelia,
                'file_ktp_penyelia' => $pathKtpPenyelia,
                'file_sertifikat_penyelia' => $pathSertifikatPenyelia,
                'bahan_json' => $dataBahan,
                'produk_json' => $dataProduk,
                'alur_proses' => $dataProduk['alur_proses'] ?? null,
                'file_alur_proses' => $pathAlurProses,
                'file_surat_permohonan' => $pathSuratPermohonan,
                'file_manual_sjph' => $pathManualSjph,
                'pernyataan_bebas_babi' => true,
                'pernyataan_komitmen_sjph' => true,
                'pernyataan_at' => now(),
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
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul' => 'Permohonan Sertifikasi Halal Diajukan',
                'deskripsi' => 'Permohonan pemeriksaan halal LPH #' . $permohonan->no_permohonan . ' (' . ($isSelfDeclare ? 'Self Declare' : 'Reguler') . ') berhasil diajukan dan menunggu verifikasi petugas LPH.',
            ]);

            DB::commit();

            // 5. Kirim Notifikasi Internal Admin
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Halal Baru',
                    'Permohonan pemeriksaan halal #' . $permohonan->no_permohonan . ' dari ' . $dataPelakuUsaha['nama_usaha'],
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin Halal: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Permohonan sertifikasi halal berhasil diajukan!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
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
}
