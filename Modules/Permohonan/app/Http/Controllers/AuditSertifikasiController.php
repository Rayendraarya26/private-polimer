<?php

namespace Modules\Permohonan\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiAudit;
use App\Models\Db2\SertifikasiAuditTim;
use App\Models\Db2\SertifikasiLks;
use App\Models\Db2\SertifikasiLksRevisi;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuditSertifikasiController extends Controller
{
    /**
     * Jadwalkan Audit Tahap 1, Tahap 2, atau Surveilans.
     */
    public function jadwalkanAudit(Request $request, string $permohonanId): JsonResponse
    {
        $permohonan = Permohonan::findOrFail($permohonanId);

        $validated = $request->validate([
            'tipe_audit'       => 'required|in:TAHAP_1,TAHAP_2,SURVEILANS,RESERTIFIKASI',
            'lead_auditor_id'  => 'required|uuid',
            'tanggal_mulai'    => 'required|date',
            'tanggal_selesai'  => 'required|date|after_or_equal:tanggal_mulai',
            'auditor_ids'      => 'nullable|array',
            'auditor_ids.*'    => 'uuid',
            'metadata'         => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $audit = SertifikasiAudit::create([
                'id'              => (string) Str::uuid(),
                'permohonan_id'   => $permohonan->id,
                'tipe_audit'      => $validated['tipe_audit'],
                'lead_auditor_id' => $validated['lead_auditor_id'],
                'tanggal_mulai'   => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'status_audit'    => 'PLANNED',
                'metadata'        => $validated['metadata'] ?? null,
            ]);

            // Assign Lead Auditor in Tim
            SertifikasiAuditTim::create([
                'id'       => (string) Str::uuid(),
                'audit_id' => $audit->id,
                'user_id'  => $validated['lead_auditor_id'],
                'peran'    => 'LEAD_AUDITOR',
            ]);

            // Assign Additional Auditors / Experts
            if (!empty($validated['auditor_ids'])) {
                foreach ($validated['auditor_ids'] as $auditorId) {
                    if ($auditorId !== $validated['lead_auditor_id']) {
                        SertifikasiAuditTim::create([
                            'id'       => (string) Str::uuid(),
                            'audit_id' => $audit->id,
                            'user_id'  => $auditorId,
                            'peran'    => 'AUDITOR',
                        ]);
                    }
                }
            }

            // Update Permohonan Status Workflow
            $permohonan->update([
                'status_workflow' => 'PROSES_AUDIT',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Jadwal Audit {$validated['tipe_audit']} berhasil ditetapkan.",
                'data'    => $audit->load('tim'),
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error jadwalkan audit: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Simpan evaluasi dan kesimpulan hasil audit.
     */
    public function updateHasilAudit(Request $request, string $auditId): JsonResponse
    {
        $audit = SertifikasiAudit::findOrFail($auditId);

        $validated = $request->validate([
            'status_audit'     => 'required|in:IN_PROGRESS,COMPLETED,CANCELLED',
            'kesimpulan_audit' => 'required|string',
            'laporan_audit'    => 'nullable|file|mimes:pdf|max:15360',
        ]);

        DB::beginTransaction();
        try {
            $filePath = $audit->laporan_audit_file;
            if ($request->hasFile('laporan_audit')) {
                $filePath = $request->file('laporan_audit')->store('sertifikasi/laporan_audit', 'public');
            }

            $audit->update([
                'status_audit'       => $validated['status_audit'],
                'kesimpulan_audit'   => $validated['kesimpulan_audit'],
                'laporan_audit_file' => $filePath,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hasil evaluasi audit berhasil diperbarui.',
                'data'    => $audit,
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Tambahkan temuan Lembar Ketidaksesuaian (LKS).
     */
    public function storeLks(Request $request, string $auditId): JsonResponse
    {
        $audit = SertifikasiAudit::findOrFail($auditId);

        $validated = $request->validate([
            'kategori'           => 'required|in:MAYOR,MINOR,OBSERVASI',
            'klausul_standar'    => 'required|string|max:150',
            'deskripsi_temuan'   => 'required|string',
            'batas_waktu_revisi' => 'required|date',
        ]);

        $count = SertifikasiLks::where('audit_id', $auditId)->count() + 1;
        $nomorLks = 'LKS/' . date('Ymd') . '/' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $lks = SertifikasiLks::create([
            'id'                 => (string) Str::uuid(),
            'audit_id'           => $audit->id,
            'nomor_lks'          => $nomorLks,
            'kategori'           => $validated['kategori'],
            'klausul_standar'    => $validated['klausul_standar'],
            'deskripsi_temuan'   => $validated['deskripsi_temuan'],
            'batas_waktu_revisi' => $validated['batas_waktu_revisi'],
            'status_lks'         => 'OPEN',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Temuan LKS #{$nomorLks} berhasil ditambahkan.",
            'data'    => $lks,
        ], 201);
    }

    /**
     * Verifikasi tindakan perbaikan dan penutupan (Close) LKS oleh Lead Auditor.
     */
    public function verifikasiLks(Request $request, string $lksId): JsonResponse
    {
        $lks = SertifikasiLks::findOrFail($lksId);

        $validated = $request->validate([
            'status_lks'      => 'required|in:VERIFIED_CLOSED,REJECTED',
            'catatan_auditor' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $isClosed = $validated['status_lks'] === 'VERIFIED_CLOSED';

            $lks->update([
                'status_lks'        => $validated['status_lks'],
                'diverifikasi_oleh' => auth()->id(),
                'diverifikasi_pada' => now(),
            ]);

            // Update latest revision record status if exists
            $latestRevisi = SertifikasiLksRevisi::where('lks_id', $lksId)->latest()->first();
            if ($latestRevisi) {
                $latestRevisi->update([
                    'status_revisi'   => $isClosed ? 'DITERIMA' : 'DITOLAK',
                    'catatan_auditor' => $validated['catatan_auditor'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $isClosed
                    ? "Temuan LKS #{$lks->nomor_lks} berhasil diverifikasi dan DITUTUP (Closed)."
                    : "Tindakan perbaikan LKS #{$lks->nomor_lks} ditolak. Menunggu perbaikan ulang pelanggan.",
                'data'    => $lks,
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
