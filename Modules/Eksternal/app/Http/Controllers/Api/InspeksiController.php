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
use App\Models\Db2\FormInspeksi;
use App\Helpers\NotifHelper;

class InspeksiController extends Controller
{
    /**
     * Menyimpan formulir permohonan jasa inspeksi karung plastik
     */
    public function store(Request $request): JsonResponse
    {
        // Decode nested JSON jika dikirim dalam FormData multipart
        $dataPermohonan = is_string($request->input('dataPermohonan'))
            ? json_decode($request->input('dataPermohonan'), true)
            : $request->input('dataPermohonan', []);

        $dataSpesifikasi = is_string($request->input('dataSpesifikasi'))
            ? json_decode($request->input('dataSpesifikasi'), true)
            : $request->input('dataSpesifikasi', []);

        $dataPelaksanaan = is_string($request->input('dataPelaksanaan'))
            ? json_decode($request->input('dataPelaksanaan'), true)
            : $request->input('dataPelaksanaan', []);

        $dataPenerima = is_string($request->input('dataPenerima'))
            ? json_decode($request->input('dataPenerima'), true)
            : $request->input('dataPenerima', []);

        $dataBiaya = is_string($request->input('dataBiaya'))
            ? json_decode($request->input('dataBiaya'), true)
            : $request->input('dataBiaya', []);

        $dataPic = is_string($request->input('dataPic'))
            ? json_decode($request->input('dataPic'), true)
            : $request->input('dataPic', []);

        $request->merge([
            'dataPermohonan' => $dataPermohonan,
            'dataSpesifikasi' => $dataSpesifikasi,
            'dataPelaksanaan' => $dataPelaksanaan,
            'dataPenerima' => $dataPenerima,
            'dataBiaya' => $dataBiaya,
            'dataPic' => $dataPic,
        ]);

        $request->validate([
            // 1. Data Permohonan
            'dataPermohonan' => 'required|array',
            'dataPermohonan.no_surat_pemohon' => 'nullable|string|max:100',
            'dataPermohonan.tgl_surat_pemohon' => 'nullable|date',
            'dataPermohonan.tujuan_inspeksi' => 'required|string',

            // 2. Data Spesifikasi Karung
            'dataSpesifikasi' => 'required|array',
            'dataSpesifikasi.jenis_inspeksi' => 'required|array|min:1',
            'dataSpesifikasi.komoditas' => 'required|string|max:255',
            'dataSpesifikasi.kapasitas_karung' => 'required|string|max:50',
            'dataSpesifikasi.spesifikasi_dimensi' => 'nullable|string',
            'dataSpesifikasi.jumlah_partai_lot' => 'required|integer|min:1',

            // 3. Data Pelaksanaan
            'dataPelaksanaan' => 'required|array',
            'dataPelaksanaan.tgl_rencana_inspeksi' => 'required|date',
            'dataPelaksanaan.lokasi_inspeksi' => 'required|string',
            'dataPelaksanaan.bahasa_laporan' => 'required|in:indonesia,inggris',

            // 4. Data Penerima Hasil Inspeksi
            'dataPenerima' => 'required|array',
            'dataPenerima.penerima_hasil_nama' => 'required|string|max:255',
            'dataPenerima.penerima_hasil_alamat' => 'nullable|string',
            'dataPenerima.penerima_hasil_email' => 'nullable|email|max:255',

            // 5. Data Penanggung Biaya
            'dataBiaya' => 'required|array',
            'dataBiaya.biaya_nama' => 'required|string|max:255',
            'dataBiaya.biaya_alamat' => 'nullable|string',
            'dataBiaya.biaya_email' => 'nullable|email|max:255',

            // 6. Data PIC
            'dataPic' => 'required|array',
            'dataPic.pemohon_pic_nama' => 'required|string|max:255',
            'dataPic.pemohon_pic_kontak' => 'required|string|max:50',
            'dataPic.pemohon_pic_alamat' => 'nullable|string',

            // Berkas Upload & Pernyataan
            'file_surat_permohonan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'setuju_pernyataan' => 'required|boolean|accepted',
        ]);

        DB::beginTransaction();

        try {
            $userId = auth()->id() ?? '00000000-0000-0000-0000-000000000000';

            // Generate Nomor Permohonan Berurutan: 0001/INSP/{BulanRomawi}/{Tahun}
            $romawiMap = [
                1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
                7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
            ];
            $bulanRomawi = $romawiMap[(int) now()->format('n')] ?? 'I';
            $suffix = '/INSP/' . $bulanRomawi . '/' . now()->format('Y');

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
                $filename = 'surat_inspeksi_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $fileSuratPath = $file->storeAs('permohonan/inspeksi', $filename, 'public');
            }

            // 1. Simpan Header Permohonan
            $permohonan = Permohonan::create([
                'id' => (string) Str::uuid(),
                'id_pt_ins' => null,
                'no_permohonan' => $noPermohonan,
                'is_split_bill' => false,
                'status_workflow' => 'PERMOHONAN',
                'status_bayar' => 'BELUM',
                'total_harga' => 0, // Akan dihitung melalui penawaran biaya admin
                'tgl_order' => now(),
                'created_by' => $userId,
                'ip_address' => $request->ip(),
            ]);

            // 2. Simpan Form Inspeksi
            $formInspeksi = FormInspeksi::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'no_surat_pemohon' => $dataPermohonan['no_surat_pemohon'] ?? null,
                'tgl_surat_pemohon' => $dataPermohonan['tgl_surat_pemohon'] ?? null,
                'tujuan_inspeksi' => $dataPermohonan['tujuan_inspeksi'],
                'jenis_inspeksi' => $dataSpesifikasi['jenis_inspeksi'],
                'komoditas' => $dataSpesifikasi['komoditas'],
                'kapasitas_karung' => $dataSpesifikasi['kapasitas_karung'],
                'spesifikasi_dimensi' => $dataSpesifikasi['spesifikasi_dimensi'] ?? null,
                'jumlah_partai_lot' => (int) ($dataSpesifikasi['jumlah_partai_lot'] ?? 1),
                'tgl_rencana_inspeksi' => $dataPelaksanaan['tgl_rencana_inspeksi'],
                'lokasi_inspeksi' => $dataPelaksanaan['lokasi_inspeksi'],
                'bahasa_laporan' => $dataPelaksanaan['bahasa_laporan'] ?? 'indonesia',
                'penerima_hasil_nama' => $dataPenerima['penerima_hasil_nama'],
                'penerima_hasil_alamat' => $dataPenerima['penerima_hasil_alamat'] ?? null,
                'penerima_hasil_email' => $dataPenerima['penerima_hasil_email'] ?? null,
                'biaya_nama' => $dataBiaya['biaya_nama'],
                'biaya_alamat' => $dataBiaya['biaya_alamat'] ?? null,
                'biaya_email' => $dataBiaya['biaya_email'] ?? null,
                'pemohon_pic_nama' => $dataPic['pemohon_pic_nama'],
                'pemohon_pic_kontak' => $dataPic['pemohon_pic_kontak'],
                'pemohon_pic_alamat' => $dataPic['pemohon_pic_alamat'] ?? null,
                'file_surat_permohonan' => $fileSuratPath,
                'setuju_pernyataan' => true,
                'pernyataan_at' => now(),
            ]);

            // 3. Hubungkan ke Master Lingkup Layanan
            $lingkup = MasterLingkupLayanan::where('slug', 'inspeksi')
                ->orWhere('slug', 'lembaga-inspeksi')
                ->orWhere('lingkup', 'LIKE', '%inspeksi%')
                ->first();

            if (!$lingkup) {
                $jenisLayanan = MasterJenisLayanan::where('slug', 'inspeksi')
                    ->orWhere('jenis_layanan', 'LIKE', '%inspeksi%')
                    ->first();

                if (!$jenisLayanan) {
                    $jenisLayanan = MasterJenisLayanan::create([
                        'id' => (string) Str::uuid(),
                        'jenis_layanan' => 'Inspeksi',
                        'slug' => 'inspeksi',
                        'is_active' => true,
                    ]);
                }

                $lingkup = MasterLingkupLayanan::create([
                    'id' => (string) Str::uuid(),
                    'jenis_layanan_id' => $jenisLayanan->id,
                    'lingkup' => 'Lembaga Inspeksi Teknik (Karung Plastik)',
                    'slug' => 'lembaga-inspeksi',
                    'kapabilitas' => true,
                    'is_active' => true,
                ]);
            }

            DetailPermohonan::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'formable_id' => $formInspeksi->id,
                'formable_type' => FormInspeksi::class,
                'lingkup_layanan_id' => $lingkup->id,
            ]);

            // 4. Catat Milestone Timeline Pelacakan
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'POLIMER',
                'milestone_code' => 'PERMOHONAN_MASUK',
                'judul' => 'Permohonan Inspeksi Diajukan',
                'deskripsi' => 'Permohonan inspeksi karung plastik #' . $permohonan->no_permohonan . ' berhasil diajukan dan menunggu verifikasi petugas.',
            ]);

            DB::commit();

            // 5. Kirim Notifikasi Internal Admin
            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Inspeksi Baru',
                    'Permohonan inspeksi karung plastik #' . $permohonan->no_permohonan . ' dari ' . $dataPic['pemohon_pic_nama'],
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin Inspeksi: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan jasa inspeksi berhasil diajukan!',
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
            Log::error('InspeksiController::store Error: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan permohonan inspeksi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menampilkan detail permohonan inspeksi
     */
    public function show(string $id): JsonResponse
    {
        try {
            $formInspeksi = FormInspeksi::with([
                'permohonan',
                'permohonan.creator',
                'permohonan.penawaranBiaya',
                'permohonan.trackingLogs',
            ])
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->first();

            if (!$formInspeksi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data permohonan inspeksi tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $formInspeksi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Memperbarui formulir permohonan jasa inspeksi karung plastik
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $formInspeksi = FormInspeksi::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->first();

        if (!$formInspeksi || !$formInspeksi->permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Data permohonan inspeksi tidak ditemukan',
            ], 404);
        }

        $permohonan = $formInspeksi->permohonan;
        $currentUser = auth()->user();
        $userId = auth()->id();

        // Validasi kepemilikan data (mitigasi IDOR)
        if ($permohonan->created_by !== $userId && (!$currentUser || !method_exists($currentUser, 'isPegawai') || !$currentUser->isPegawai())) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk mengubah permohonan ini.',
            ], 403);
        }

        // Hanya permohonan berstatus DRAFT atau REVISI atau PERMOHONAN yang dapat diubah
        if (!in_array($permohonan->status_workflow, ['DRAFT', 'REVISI', 'PERMOHONAN'])) {
            return response()->json([
                'success' => false,
                'message' => "Permohonan dengan status {$permohonan->status_workflow} tidak dapat diubah.",
            ], 400);
        }

        // Decode nested JSON jika dikirim dalam FormData multipart
        $dataPermohonan = is_string($request->input('dataPermohonan'))
            ? json_decode($request->input('dataPermohonan'), true)
            : $request->input('dataPermohonan', []);

        $dataSpesifikasi = is_string($request->input('dataSpesifikasi'))
            ? json_decode($request->input('dataSpesifikasi'), true)
            : $request->input('dataSpesifikasi', []);

        $dataPelaksanaan = is_string($request->input('dataPelaksanaan'))
            ? json_decode($request->input('dataPelaksanaan'), true)
            : $request->input('dataPelaksanaan', []);

        $dataPenerima = is_string($request->input('dataPenerima'))
            ? json_decode($request->input('dataPenerima'), true)
            : $request->input('dataPenerima', []);

        $dataBiaya = is_string($request->input('dataBiaya'))
            ? json_decode($request->input('dataBiaya'), true)
            : $request->input('dataBiaya', []);

        $dataPic = is_string($request->input('dataPic'))
            ? json_decode($request->input('dataPic'), true)
            : $request->input('dataPic', []);

        $request->merge([
            'dataPermohonan' => $dataPermohonan,
            'dataSpesifikasi' => $dataSpesifikasi,
            'dataPelaksanaan' => $dataPelaksanaan,
            'dataPenerima' => $dataPenerima,
            'dataBiaya' => $dataBiaya,
            'dataPic' => $dataPic,
        ]);

        $request->validate([
            'dataPermohonan.no_surat_pemohon' => 'nullable|string|max:100',
            'dataPermohonan.tgl_surat_pemohon' => 'nullable|date',
            'dataPermohonan.tujuan_inspeksi' => 'sometimes|required|string',
            'dataSpesifikasi.jenis_inspeksi' => 'sometimes|required|array|min:1',
            'dataSpesifikasi.komoditas' => 'sometimes|required|string|max:255',
            'dataSpesifikasi.kapasitas_karung' => 'sometimes|required|string|max:50',
            'dataSpesifikasi.spesifikasi_dimensi' => 'nullable|string',
            'dataSpesifikasi.jumlah_partai_lot' => 'sometimes|required|integer|min:1',
            'dataPelaksanaan.tgl_rencana_inspeksi' => 'sometimes|required|date',
            'dataPelaksanaan.lokasi_inspeksi' => 'sometimes|required|string',
            'dataPelaksanaan.bahasa_laporan' => 'sometimes|required|in:indonesia,inggris',
            'dataPenerima.penerima_hasil_nama' => 'sometimes|required|string|max:255',
            'dataBiaya.biaya_nama' => 'sometimes|required|string|max:255',
            'dataPic.pemohon_pic_nama' => 'sometimes|required|string|max:255',
            'dataPic.pemohon_pic_kontak' => 'sometimes|required|string|max:50',
            'file_surat_permohonan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('file_surat_permohonan')) {
                $file = $request->file('file_surat_permohonan');
                $filename = 'surat_inspeksi_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $formInspeksi->file_surat_permohonan = $file->storeAs('permohonan/inspeksi', $filename, 'public');
            }

            if (!empty($dataPermohonan['no_surat_pemohon'])) $formInspeksi->no_surat_pemohon = $dataPermohonan['no_surat_pemohon'];
            if (!empty($dataPermohonan['tgl_surat_pemohon'])) $formInspeksi->tgl_surat_pemohon = $dataPermohonan['tgl_surat_pemohon'];
            if (!empty($dataPermohonan['tujuan_inspeksi'])) $formInspeksi->tujuan_inspeksi = $dataPermohonan['tujuan_inspeksi'];
            if (!empty($dataSpesifikasi['jenis_inspeksi'])) $formInspeksi->jenis_inspeksi = $dataSpesifikasi['jenis_inspeksi'];
            if (!empty($dataSpesifikasi['komoditas'])) $formInspeksi->komoditas = $dataSpesifikasi['komoditas'];
            if (!empty($dataSpesifikasi['kapasitas_karung'])) $formInspeksi->kapasitas_karung = $dataSpesifikasi['kapasitas_karung'];
            if (isset($dataSpesifikasi['spesifikasi_dimensi'])) $formInspeksi->spesifikasi_dimensi = $dataSpesifikasi['spesifikasi_dimensi'];
            if (!empty($dataSpesifikasi['jumlah_partai_lot'])) $formInspeksi->jumlah_partai_lot = (int) $dataSpesifikasi['jumlah_partai_lot'];
            if (!empty($dataPelaksanaan['tgl_rencana_inspeksi'])) $formInspeksi->tgl_rencana_inspeksi = $dataPelaksanaan['tgl_rencana_inspeksi'];
            if (!empty($dataPelaksanaan['lokasi_inspeksi'])) $formInspeksi->lokasi_inspeksi = $dataPelaksanaan['lokasi_inspeksi'];
            if (!empty($dataPelaksanaan['bahasa_laporan'])) $formInspeksi->bahasa_laporan = $dataPelaksanaan['bahasa_laporan'];
            if (!empty($dataPenerima['penerima_hasil_nama'])) $formInspeksi->penerima_hasil_nama = $dataPenerima['penerima_hasil_nama'];
            if (isset($dataPenerima['penerima_hasil_alamat'])) $formInspeksi->penerima_hasil_alamat = $dataPenerima['penerima_hasil_alamat'];
            if (isset($dataPenerima['penerima_hasil_email'])) $formInspeksi->penerima_hasil_email = $dataPenerima['penerima_hasil_email'];
            if (!empty($dataBiaya['biaya_nama'])) $formInspeksi->biaya_nama = $dataBiaya['biaya_nama'];
            if (isset($dataBiaya['biaya_alamat'])) $formInspeksi->biaya_alamat = $dataBiaya['biaya_alamat'];
            if (isset($dataBiaya['biaya_email'])) $formInspeksi->biaya_email = $dataBiaya['biaya_email'];
            if (!empty($dataPic['pemohon_pic_nama'])) $formInspeksi->pemohon_pic_nama = $dataPic['pemohon_pic_nama'];
            if (!empty($dataPic['pemohon_pic_kontak'])) $formInspeksi->pemohon_pic_kontak = $dataPic['pemohon_pic_kontak'];
            if (isset($dataPic['pemohon_pic_alamat'])) $formInspeksi->pemohon_pic_alamat = $dataPic['pemohon_pic_alamat'];

            $formInspeksi->save();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan inspeksi berhasil diperbarui!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('InspeksiController::update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui permohonan inspeksi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengajukan ulang permohonan inspeksi setelah revisi
     */
    public function ajukanUlang(Request $request, string $id): JsonResponse
    {
        $formInspeksi = FormInspeksi::with('permohonan')
            ->where('id', $id)
            ->orWhere('permohonan_id', $id)
            ->first();

        if (!$formInspeksi || !$formInspeksi->permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Data permohonan inspeksi tidak ditemukan',
            ], 404);
        }

        $permohonan = $formInspeksi->permohonan;
        $currentUser = auth()->user();
        $userId = auth()->id();

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

        // Jalankan update data jika ada payload baru
        if ($request->has('dataPermohonan') || $request->has('dataSpesifikasi') || $request->has('dataPelaksanaan')) {
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
                'judul' => 'Permohonan Inspeksi Diajukan Ulang',
                'deskripsi' => 'Pemohon telah melakukan revisi permohonan #' . $permohonan->no_permohonan . ' dan mengajukan kembali untuk diverifikasi.',
            ]);

            DB::commit();

            try {
                $adminIds = NotifHelper::getAdminUserIds();
                NotifHelper::notifyMany(
                    $adminIds,
                    'Permohonan Inspeksi Diajukan Ulang',
                    'Permohonan inspeksi karung plastik #' . $permohonan->no_permohonan . ' telah diajukan ulang oleh pemohon.',
                    route('permohonan.layanan.detail', $permohonan->id)
                );
            } catch (\Exception $notifEx) {
                Log::warning('Gagal kirim notifikasi admin ajukan ulang inspeksi: ' . $notifEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan inspeksi berhasil diajukan ulang!',
                'data' => [
                    'id' => $permohonan->id,
                    'no_permohonan' => $permohonan->no_permohonan,
                    'status_workflow' => 'PERMOHONAN',
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('InspeksiController::ajukanUlang Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengajukan ulang permohonan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
