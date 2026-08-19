<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiKomite;
use App\Models\Db2\SertifikasiKomiteAnggota;
use App\Models\Db2\SertifikasiKomiteRekomendasi;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class KomiteSertifikasiController extends Controller
{
    /**
     * Jadwalkan Sidang Komite Teknis Sertifikasi.
     */
    public function jadwalkanSidang(Request $request, string $permohonanId): JsonResponse
    {
        $permohonan = Permohonan::findOrFail($permohonanId);

        $validated = $request->validate([
            'audit_id'       => 'nullable|uuid',
            'nomor_sidang'   => 'required|string|max:100',
            'tanggal_sidang' => 'required|date',
            'catatan_sidang' => 'nullable|string',
            'anggota'        => 'required|array|min:1',
            'anggota.*.user_id' => 'required|uuid',
            'anggota.*.peran'   => 'required|in:KETUA,ANGGOTA,SEKRETARIS',
        ]);

        DB::beginTransaction();
        try {
            $komite = SertifikasiKomite::create([
                'id'             => (string) Str::uuid(),
                'permohonan_id'  => $permohonan->id,
                'audit_id'       => $validated['audit_id'] ?? null,
                'nomor_sidang'   => $validated['nomor_sidang'],
                'tanggal_sidang' => $validated['tanggal_sidang'],
                'status_sidang'  => 'DIJADWALKAN',
                'catatan_sidang' => $validated['catatan_sidang'] ?? null,
            ]);

            foreach ($validated['anggota'] as $ang) {
                SertifikasiKomiteAnggota::create([
                    'id'        => (string) Str::uuid(),
                    'komite_id' => $komite->id,
                    'user_id'   => $ang['user_id'],
                    'peran'     => $ang['peran'],
                ]);
            }

            $permohonan->update([
                'status_workflow' => 'SIDANG_KOMITE',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Sidang Komite Sertifikasi #{$komite->nomor_sidang} berhasil dijadwalkan.",
                'data'    => $komite->load('anggota'),
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error jadwalkan sidang komite: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Simpan Hasil Evaluasi & Rekomendasi Keputusan Sidang Komite.
     */
    public function simpanRekomendasi(Request $request, string $komiteId): JsonResponse
    {
        $komite = SertifikasiKomite::findOrFail($komiteId);

        $validated = $request->validate([
            'rekomendasi'         => 'required|in:TERBIT_SERTIFIKAT,AUDIT_ULANG,TOLAK',
            'catatan_rekomendasi' => 'required|string',
            'catatan_khusus'      => 'nullable|string',
            'file_berita_acara'   => 'nullable|file|mimes:pdf|max:15360',
        ]);

        DB::beginTransaction();
        try {
            $filePath = null;
            if ($request->hasFile('file_berita_acara')) {
                $filePath = $request->file('file_berita_acara')->store('sertifikasi/berita_acara', 'public');
            }

            $rekomendasi = SertifikasiKomiteRekomendasi::updateOrCreate(
                ['komite_id' => $komite->id],
                [
                    'id'                   => (string) Str::uuid(),
                    'rekomendasi'          => $validated['rekomendasi'],
                    'catatan_rekomendasi'  => $validated['catatan_rekomendasi'],
                    'catatan_khusus'       => $validated['catatan_khusus'] ?? null,
                    'file_berita_acara'    => $filePath,
                    'direkomendasikan_oleh'=> auth()->id(),
                    'direkomendasikan_pada'=> now(),
                ]
            );

            $komite->update([
                'status_sidang' => 'SELESAI',
            ]);

            // Update Permohonan Status Workflow based on decision
            $permohonan = $komite->permohonan;
            if ($permohonan) {
                if ($validated['rekomendasi'] === 'TERBIT_SERTIFIKAT') {
                    $permohonan->update(['status_workflow' => 'PENERBITAN_SERTIFIKAT']);
                } elseif ($validated['rekomendasi'] === 'TOLAK') {
                    $permohonan->update(['status_workflow' => 'DITOLAK']);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Keputusan Sidang Komite berhasil disimpan dengan rekomendasi: {$validated['rekomendasi']}.",
                'data'    => $rekomendasi,
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
