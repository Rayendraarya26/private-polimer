<?php

namespace Modules\Eksternal\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// Models DB1 & DB2
use App\Models\Db1\Pelanggan;
use App\Models\Db2\MasterJenisLayanan;
use App\Models\Db2\MasterLingkupLayanan;
use App\Models\Db2\Permohonan;
use App\Models\Db2\DetailPermohonan;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\FormAset;
use App\Helpers\NotifHelper;

class AsetController extends Controller
{
    /**
     * Mengambil daftar dropdown jenis sewa aset
     */
    public function getJenisSewa(): JsonResponse
    {
        $options = [
            ['value' => 'sewa_lapangan',  'label' => 'Sewa Lapangan'],
            ['value' => 'sewa_bangunan',  'label' => 'Sewa Bangunan'],
            ['value' => 'sewa_alat',      'label' => 'Sewa Alat'],
            ['value' => 'sewa_mobil',     'label' => 'Sewa Mobil'],
            ['value' => 'sewa_ruangan',   'label' => 'Sewa Ruangan'],
        ];

        return response()->json([
            'success' => true,
            'data' => $options,
        ]);
    }

    /**
     * Menyimpan formulir permohonan pengajuan sewa aset
     */
    public function store(Request $request): JsonResponse
    {
        // Decode nested JSON jika dikirim dalam FormData multipart
        $dataIdentitas = is_string($request->input('dataIdentitas'))
            ? json_decode($request->input('dataIdentitas'), true)
            : $request->input('dataIdentitas', []);

        $dataSewa = is_string($request->input('dataSewa'))
            ? json_decode($request->input('dataSewa'), true)
            : $request->input('dataSewa', []);

        $request->merge([
            'dataIdentitas' => $dataIdentitas,
            'dataSewa'      => $dataSewa,
        ]);

        $request->validate([
            // Validasi jenis sewa & tanggal (bisa nested dataSewa atau flat)
            'dataSewa.jenis_sewa' => 'required_without:jenis_sewa|in:sewa_lapangan,sewa_bangunan,sewa_alat,sewa_mobil,sewa_ruangan',
            'jenis_sewa'          => 'sometimes|in:sewa_lapangan,sewa_bangunan,sewa_alat,sewa_mobil,sewa_ruangan',
            'dataSewa.tanggal_mulai' => 'required_without:tanggal_mulai|date',
            'tanggal_mulai'          => 'sometimes|date',
            'dataSewa.tanggal_selesai' => 'required_without:tanggal_selesai|date',
            'tanggal_selesai'          => 'sometimes|date',
            'dataSewa.keperluan_penggunaan' => 'required_without:keperluan_penggunaan|string',
            'keperluan_penggunaan'          => 'sometimes|string',
            'file_surat_permohonan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'setuju_pernyataan'     => 'required|boolean|accepted',
        ]);

        DB::beginTransaction();

        try {
            $user = auth()->user();
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';

            // Ambil data nilai sewa dari nested atau flat
            $jenisSewa = $dataSewa['jenis_sewa'] ?? $request->input('jenis_sewa');
            $tanggalMulaiStr = $dataSewa['tanggal_mulai'] ?? $request->input('tanggal_mulai');
            $tanggalSelesaiStr = $dataSewa['tanggal_selesai'] ?? $request->input('tanggal_selesai');
            $keperluanPenggunaan = $dataSewa['keperluan_penggunaan'] ?? $request->input('keperluan_penggunaan');
            $catatanTambahan = $dataSewa['catatan_tambahan'] ?? $request->input('catatan_tambahan');

            // Hitung durasi hari
            $tglMulai = Carbon::parse($tanggalMulaiStr);
            $tglSelesai = Carbon::parse($tanggalSelesaiStr);
            $durasiHari = (int) ($dataSewa['durasi_hari'] ?? $request->input('durasi_hari') ?? max(1, $tglMulai->diffInDays($tglSelesai) + 1));

            // Snapshot identitas pemohon dari profil atau payload
            $pelanggan = Pelanggan::with('detail')->where('user_id', $userId)->first();
            $detail = $pelanggan?->detail;

            $pemohonNama = $dataIdentitas['pemohon_nama']
                ?? $request->input('pemohon_nama')
                ?? $detail?->nama
                ?? $detail?->nama_perusahaan
                ?? $user?->name
                ?? 'Pemohon Aset';

            $pemohonNikNib = $dataIdentitas['pemohon_nik_nib']
                ?? $request->input('pemohon_nik_nib')
                ?? $detail?->nib
                ?? $detail?->nik
                ?? null;

            $pemohonAlamat = $dataIdentitas['pemohon_alamat']
                ?? $request->input('pemohon_alamat')
                ?? $detail?->alamat
                ?? $detail?->alamat_perusahaan
                ?? null;

            $pemohonTelepon = $dataIdentitas['pemohon_telepon']
                ?? $request->input('pemohon_telepon')
                ?? $detail?->no_hp
                ?? $detail?->telepon
                ?? null;

            $pemohonEmail = $dataIdentitas['pemohon_email']
                ?? $request->input('pemohon_email')
                ?? $detail?->email
                ?? $user?->email
                ?? null;

            // Generate Nomor Permohonan Berurutan: 0001/ASET/{BulanRomawi}/{Tahun}
            $romawiMap = [
                1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
                7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
            ];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/ASET/' . $bulanRomawi . '/' . now()->format('Y');

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

            // Simpan Berkas Surat Permohonan jika ada
            $fileSuratPath = null;
            if ($request->hasFile('file_surat_permohonan')) {
                $file = $request->file('file_surat_permohonan');
                $filename = 'surat_aset_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $fileSuratPath = $file->storeAs('permohonan/aset', $filename, 'public');
            }

            // 1. Simpan Header Permohonan
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => 'PERMOHONAN',
                'status_bayar' => 'BELUM',
                'total_harga' => 0, // Ditetapkan oleh admin saat penawaran/billing
                'tgl_order' => now(),
                'created_by' => $userId,
                'ip_address' => $request->ip(),
            ]);

            // 2. Simpan Form Aset
            $formAset = FormAset::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'jenis_sewa' => $jenisSewa,
                'tanggal_mulai' => $tglMulai->toDateString(),
                'tanggal_selesai' => $tglSelesai->toDateString(),
                'durasi_hari' => $durasiHari,
                'keperluan_penggunaan' => $keperluanPenggunaan,
                'catatan_tambahan' => $catatanTambahan,
                'pemohon_nama' => $pemohonNama,
                'pemohon_nik_nib' => $pemohonNikNib,
                'pemohon_alamat' => $pemohonAlamat,
                'pemohon_telepon' => $pemohonTelepon,
                'pemohon_email' => $pemohonEmail,
                'file_surat_permohonan' => $fileSuratPath,
                'setuju_pernyataan' => true,
                'pernyataan_at' => now(),
            ]);

            // 3. Hubungkan ke Master Lingkup Layanan
            $lingkup = MasterLingkupLayanan::where('slug', 'sewa-aset')
                ->orWhere('slug', 'aset')
                ->orWhere('lingkup', 'LIKE', '%sewa%aset%')
                ->first();

            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'aset')
                    ->orWhere('jenis_layanan', 'LIKE', '%aset%')
                    ->first();

                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'Sewa Aset',
                        'slug' => 'aset',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => 'Pemanfaatan & Sewa Aset BBSPJIKKP',
                    'slug' => 'sewa-aset',
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $formAset->id,
                'formable_type' => FormAset::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);

            // 4. Catat Milestone Timeline Pelacakan
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul' => 'Permohonan Sewa Aset Diajukan',
                'deskripsi' => 'Permohonan sewa aset #' . $permohonan->no_permohonan . ' (' . ucwords(str_replace('_', ' ', $jenisSewa)) . ') berhasil diajukan dan menunggu verifikasi petugas.',
            ]);

            DB::commit();

            // 5. Kirim Notifikasi Internal Admin
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Sewa Aset Baru',
                    'Permohonan sewa aset #' . $permohonan->no_permohonan . ' dari ' . $pemohonNama,
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin Sewa Aset: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan sewa aset berhasil diajukan!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('AsetController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan permohonan sewa aset: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menampilkan detail permohonan sewa aset
     */
    public function show(string $id): JsonResponse
    {
        try {
            $formAset = FormAset::with([
                'permohonan',
                'permohonan.creator',
                'permohonan.penawaranBiaya',
                'permohonan.trackingLogs',
            ])
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->first();

            if (!$formAset) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data permohonan sewa aset tidak ditemukan',
                ], 404);
            }

            // Validasi kepemilikan data (mitigasi IDOR)
            $currentUser = auth()->user();
            $userId = auth()->id();
            if ($formAset->permohonan && $formAset->permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses untuk melihat permohonan ini.',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $formAset,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail permohonan aset: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Memperbarui formulir permohonan pengajuan sewa aset
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $formAset = FormAset::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->first();

        if (!$formAset || !$formAset->permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Data permohonan sewa aset tidak ditemukan',
            ], 404);
        }

        $permohonan = $formAset->permohonan;
        $currentUser = auth()->user();
        $userId = auth()->id();

        // Validasi kepemilikan data (mitigasi IDOR)
        if ($permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk mengubah permohonan ini.',
            ], 403);
        }

        // Hanya permohonan berstatus DRAFT, REVISI, PERMOHONAN_PERLU_PERBAIKAN, atau PERMOHONAN yang dapat diubah
        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI', 'PERMOHONAN_PERLU_PERBAIKAN', 'PERMOHONAN'])) {
            return response()->json([
                'success' => false,
                'message' => "Permohonan dengan status {$permohonan->status_workflow} tidak dapat diubah.",
            ], 400);
        }

        $dataIdentitas = is_string($request->input('dataIdentitas'))
            ? json_decode($request->input('dataIdentitas'), true)
            : $request->input('dataIdentitas', []);

        $dataSewa = is_string($request->input('dataSewa'))
            ? json_decode($request->input('dataSewa'), true)
            : $request->input('dataSewa', []);

        $request->merge([
            'dataIdentitas' => $dataIdentitas,
            'dataSewa'      => $dataSewa,
        ]);

        $request->validate([
            'dataSewa.jenis_sewa' => 'sometimes|in:sewa_lapangan,sewa_bangunan,sewa_alat,sewa_mobil,sewa_ruangan',
            'jenis_sewa'          => 'sometimes|in:sewa_lapangan,sewa_bangunan,sewa_alat,sewa_mobil,sewa_ruangan',
            'dataSewa.tanggal_mulai' => 'sometimes|date',
            'tanggal_mulai'          => 'sometimes|date',
            'dataSewa.tanggal_selesai' => 'sometimes|date',
            'tanggal_selesai'          => 'sometimes|date',
            'file_surat_permohonan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('file_surat_permohonan')) {
                $file = $request->file('file_surat_permohonan');
                $filename = 'surat_aset_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $formAset->file_surat_permohonan = $file->storeAs('permohonan/aset', $filename, 'public');
            }

            $jenisSewa = $dataSewa['jenis_sewa'] ?? $request->input('jenis_sewa');
            if (!empty($jenisSewa)) $formAset->jenis_sewa = $jenisSewa;

            $tglMulaiStr = $dataSewa['tanggal_mulai'] ?? $request->input('tanggal_mulai');
            if (!empty($tglMulaiStr)) $formAset->tanggal_mulai = Carbon::parse($tglMulaiStr)->toDateString();

            $tglSelesaiStr = $dataSewa['tanggal_selesai'] ?? $request->input('tanggal_selesai');
            if (!empty($tglSelesaiStr)) $formAset->tanggal_selesai = Carbon::parse($tglSelesaiStr)->toDateString();

            if ($formAset->tanggal_mulai && $formAset->tanggal_selesai) {
                $m = Carbon::parse($formAset->tanggal_mulai);
                $s = Carbon::parse($formAset->tanggal_selesai);
                $formAset->durasi_hari = max(1, $m->diffInDays($s) + 1);
            }

            $keperluan = $dataSewa['keperluan_penggunaan'] ?? $request->input('keperluan_penggunaan');
            if (!empty($keperluan)) $formAset->keperluan_penggunaan = $keperluan;

            $catatan = $dataSewa['catatan_tambahan'] ?? $request->input('catatan_tambahan');
            if (isset($catatan)) $formAset->catatan_tambahan = $catatan;

            $pemohonNama = $dataIdentitas['pemohon_nama'] ?? $request->input('pemohon_nama');
            if (!empty($pemohonNama)) $formAset->pemohon_nama = $pemohonNama;

            $pemohonNikNib = $dataIdentitas['pemohon_nik_nib'] ?? $request->input('pemohon_nik_nib');
            if (isset($pemohonNikNib)) $formAset->pemohon_nik_nib = $pemohonNikNib;

            $pemohonAlamat = $dataIdentitas['pemohon_alamat'] ?? $request->input('pemohon_alamat');
            if (isset($pemohonAlamat)) $formAset->pemohon_alamat = $pemohonAlamat;

            $pemohonTelepon = $dataIdentitas['pemohon_telepon'] ?? $request->input('pemohon_telepon');
            if (isset($pemohonTelepon)) $formAset->pemohon_telepon = $pemohonTelepon;

            $pemohonEmail = $dataIdentitas['pemohon_email'] ?? $request->input('pemohon_email');
            if (isset($pemohonEmail)) $formAset->pemohon_email = $pemohonEmail;

            $formAset->save();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan sewa aset berhasil diperbarui!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('AsetController::update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui permohonan sewa aset: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengajukan ulang permohonan sewa aset setelah revisi/perbaikan
     */
    public function ajukanUlang(Request $request, string $id): JsonResponse
    {
        $formAset = FormAset::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->first();

        if (!$formAset || !$formAset->permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Data permohonan sewa aset tidak ditemukan',
            ], 404);
        }

        $permohonan = $formAset->permohonan;
        $currentUser = auth()->user();
        $userId = auth()->id();

        // Validasi kepemilikan data (mitigasi IDOR)
        if ($permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk mengajukan permohonan ini.',
            ], 403);
        }

        if (!in_array($permohonan->status_workflow, ['REVISI', 'PERMOHONAN_PERLU_PERBAIKAN', 'DRAFT'])) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya permohonan dengan status REVISI atau DRAFT yang dapat diajukan ulang.',
            ], 400);
        }

        // Jalankan update data jika ada payload baru
        if ($request->has('dataSewa') || $request->has('dataIdentitas') || $request->has('jenis_sewa')) {
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
                'judul' => 'Permohonan Sewa Aset Diajukan Ulang',
                'deskripsi' => 'Pemohon telah melakukan revisi permohonan #' . $permohonan->no_permohonan . ' dan mengajukan kembali untuk diverifikasi.',
            ]);

            DB::commit();

            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Sewa Aset Diajukan Ulang',
                    'Permohonan sewa aset #' . $permohonan->no_permohonan . ' telah diajukan ulang oleh pemohon.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin ajukan ulang Sewa Aset: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan sewa aset berhasil diajukan ulang!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => 'PERMOHONAN',
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('AsetController::ajukanUlang Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengajukan ulang permohonan sewa aset: ' . $e->getMessage(),
            ], 500);
        }
    }
}
