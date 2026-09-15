<?php

namespace Modules\Webhook\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Db2\Permohonan;
use App\Models\Db2\PermohonanTrackingLog;
use App\Models\Db2\IntegrationLog;
use App\Models\Db1\SysUserNotif;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class WebhookReceiverController extends Controller
{

    /**
     * Menerima pembaruan milestone (Jadwal, Audit Tahap 1/2, Rapat Komite) dari SIS
     */
    public function handleMilestone(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sis_mohon_id' => 'required|integer',
            'external_permohonan_id' => 'nullable|string',
            'milestone_code' => 'required|string',
            'milestone_title' => 'required|string',
            'milestone_description' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $permohonan = null;
        if (!empty($validated['external_permohonan_id'])) {
            $permohonan = Permohonan::find($validated['external_permohonan_id']);
        }
        if (!$permohonan && !empty($validated['sis_mohon_id'])) {
            $permohonan = Permohonan::where('sis_mohon_id', $validated['sis_mohon_id'])->first();
        }

        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan di Polimer'], 404);
        }

        DB::beginTransaction();
        try {
            if ($validated['milestone_code'] === 'KAJIAN_APPROVED_PJT') {
                $permohonan->update([
                    'status_workflow' => 'PENAWARAN_BIAYA',
                ]);
            }

            if ($validated['milestone_code'] === 'AUDIT_TAHAP_1_VERIFIED') {
                // Pertahankan workflow PROSES atau pastikan status aktif
                if (in_array($permohonan->status_workflow, ['PEMBAYARAN', 'LUNAS', 'PERMOHONAN'])) {
                    $permohonan->update([
                        'status_workflow' => 'PROSES',
                    ]);
                }
            }

            if (in_array($validated['milestone_code'], ['AUDIT_TAHAP_1_VERIFIED', 'LAPORAN_AUDIT_TAHAP_1_SUBMITTED'])) {
                $metadata = $validated = ['metadata'] ?? [];
                $audThp1Id = $metadata['aud_thp1_id'] ?? null;


                $rawAttachments = $permohonan->file_attachment;
                $currentAttachments = is_array($rawAttachments) ? $rawAttachments : (is_string($rawAttachments) ? json_decode($rawAttachments, true) : []);

                if (!is_array($currentAttachments)) {
                    $currentAttachments = [];
                }

                $codesToReplace = ['LAPORAN_AUDIT_TAHAP_1', 'TINJAUAN_AUDIT_TAHAP_1', 'NOTULEN_AUDIT_TAHAP_1'];
                $currentAttachments = array_values(array_filter($currentAttachments, function ($att) use ($codesToReplace) {
                    return !in_array($att['kode'], $codesToReplace);
                }));

                if (!empty($metadata['file_laporan_url'])) {
                    $currentAttachments[] = [
                        'kode' => 'LAPORAN_AUDIT_TAHAP_1',
                        'nama' => 'Laporan Hasil Audit Tahap 1',
                        'file_url' => $metadata['file_laporan_url'],
                        'path' => $metadata['file_laporan_path'],
                        'uploaded_at' => now()->toIso8601String(),
                        'actor' => $metadata['verified_by'] ?? 'Koordinator Sertifikasi',
                        'created_at' => now()->toIso8601String(),
                    ];
                }
                
            }

            if ($validated['milestone_code'] === 'PERNYATAAN_PERSETUJUAN_UPLOADED') {
                $metadata = $validated['metadata'] ?? [];
                $fileUrl = $metadata['file_url'] ?? null;

                if ($fileUrl) {
                    $rawAttachments = $permohonan->file_attachment;
                    $currentAttachments = is_array($rawAttachments)
                        ? $rawAttachments
                        : (is_string($rawAttachments) ? json_decode($rawAttachments, true) : []);

                    if (!is_array($currentAttachments)) {
                        $currentAttachments = [];
                    }

                    // Hapus duplikat entri pernyataan persetujuan sebelumnya jika ada
                    $currentAttachments = array_values(array_filter($currentAttachments, function ($att) {
                        return ($att['kode'] ?? '') !== 'PERNYATAAN_PERSETUJUAN';
                    }));

                    $currentAttachments[] = [
                        'kode' => 'PERNYATAAN_PERSETUJUAN',
                        'nama' => 'Surat Pernyataan Persetujuan Lembaga Sertifikasi',
                        'file_url' => $fileUrl,
                        'path' => $fileUrl,
                        'uploaded_at' => $metadata['uploaded_at'] ?? now()->toIso8601String(),
                        'actor' => $metadata['actor'] ?? 'Operator LSPro',
                        'created_at' => now()->toIso8601String(),
                    ];

                    $permohonan->update([
                        'file_attachment' => $currentAttachments,
                    ]);
                }
            }

            if ($validated['milestone_code'] === 'AUDIT_PLAN_TAHAP_1_UPLOADED' || $validated['milestone_code'] === 'AUDIT_PLAN_UPLOADED') {
                $metadata = $validated['metadata'] ?? [];
                $fileUrl = $metadata['file_url'] ?? null;

                if ($fileUrl) {
                    $rawAttachments = $permohonan->file_attachment;
                    $currentAttachments = is_array($rawAttachments)
                        ? $rawAttachments
                        : (is_string($rawAttachments) ? json_decode($rawAttachments, true) : []);

                    if (!is_array($currentAttachments)) {
                        $currentAttachments = [];
                    }

                    $currentAttachments = array_values(array_filter($currentAttachments, function ($att) {
                        return ($att['kode'] ?? '') !== 'AUDIT_PLAN_TAHAP_1';
                    }));

                    $currentAttachments[] = [
                        'kode' => 'AUDIT_PLAN_TAHAP_1',
                        'nama' => 'Rencana Jadwal Audit Tahap 1 (Audit Plan)',
                        'file_url' => $fileUrl,
                        'path' => $fileUrl,
                        'uploaded_at' => $metadata['uploaded_at'] ?? now()->toIso8601String(),
                        'actor' => $metadata['actor'] ?? 'Ketua Tim Auditor',
                        'created_at' => now()->toIso8601String(),
                    ];

                    $permohonan->update([
                        'file_attachment' => $currentAttachments,
                    ]);
                }
            }

            // Simpan ke tracking timeline 
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'SIS',
                'milestone_code' => $validated['milestone_code'],
                'judul' => $validated['milestone_title'],
                'deskripsi' => $validated['milestone_description'] ?? null,
                'metadata' => $validated['metadata'] ?? null,
                'created_at' => now(),
            ]);

            // Kirim notifikasi ke pelanggan
            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title' => $validated['milestone_title'],
                'content' => $validated['milestone_description'] ?? 'Ada pembaruan status sertifikasi industri.',
                'link' => route('permohonan.layanan.detail', $permohonan->id),
                'is_read' => 'no',
            ]);

            // Catat audit log
            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'arah' => 'INCOMING_FROM_SIS',
                'endpoint' => '/api/v1/webhook/sis/milestone',
                'method' => 'POST',
                'payload_request' => $request->all(),
                'payload_response' => ['success' => true, 'message' => 'Milestone dicatat'],
                'http_status' => 200,
                'status' => 'SUCCESS',
            ]);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Milestone berhasil diproses',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage()
                ],
                500
            );
        }
    }

    /**
     * Menerima notifikasi penerbitan e-Sertifikat resmi dari SIS
     */
    public function handleCertificateIssued(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sis_mohon_id' => 'required|integer',
            'external_permohonan_id' => 'nullable|string',
            'nomor_sertifikat' => 'required|string',
            'tanggal_terbit' => 'required|date',
            'tanggal_kadaluarsa' => 'required|date',
            'sertifikat_file_url' => 'required|url',
        ]);

        $permohonan = null;
        if (!empty($validated['external_permohonan_id'])) {
            $permohonan = Permohonan::find($validated['external_permohonan_id']);
        }
        if (!$permohonan && !empty($validated['sis_mohon_id'])) {
            $permohonan = Permohonan::where('sis_mohon_id', $validated['sis_mohon_id'])->first();
        }

        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        DB::beginTransaction();
        try {
            // Update tabel permohonan ke status selesai
            $permohonan->update([
                'status_workflow' => 'DONE',
                'nomor_sertifikat' => $validated['nomor_sertifikat'],
                'tanggal_sertifikat_terbit' => $validated['tanggal_terbit'],
                'tanggal_sertifikat_kadaluarsa' => $validated['tanggal_kadaluarsa'],
                'file_sertifikat_final' => $validated['sertifikat_file_url'],
            ]);

            // Catat milestone selesai 
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'SIS',
                'milestone_code' => 'SERTIFIKAT_DITERBITKAN',
                'judul' => 'Sertifikasi Selesai - e-Sertifikat Terbit',
                'deskripsi' => 'Sertifikat resmi dengan nomor ' . $validated['nomor_sertifikat'] . ' telah terbit dan siap diunduh',
                'metadata' => ['file_url' => $validated['sertifikat_file_url']],
                'created_at' => now(),
            ]);

            // Notifikasi ke user 
            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title' => 'Sertifikat Industri Telah Terbit',
                'content' => 'Selamat! Sertifikat Industri Anda #' . $validated['nomor_sertifikat'],
                'link' => route('permohonan.layanan.detail', $permohonan->id),
                'is_read' => 'no',
            ]);


            DB::commit();
            return response()->json(['success' => true, 'message' => 'Sertifikat berhasil disinkronkan ke Polimer']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage()
                ],
                500
            );
        }
    }
}

