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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
                $metadata = $validated['metadata'] ?? [];
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
                        'path' => $metadata['file_laporan_path'] ?? $metadata['file_laporan_url'],
                        'uploaded_at' => now()->toIso8601String(),
                        'actor' => $metadata['verified_by'] ?? 'Koordinator Sertifikasi',
                        'created_at' => now()->toIso8601String(),
                    ];

                    $permohonan->update([
                        'file_attachment' => $currentAttachments,
                    ]);
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
                'link' => '/app/#/permohonan',
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
     * Menerima notifikasi penerbitan e-Sertifikat resmi dari SIS dan menyimpan berkas sertifikat ke storage Polimer
     */
    public function handleCertificateIssued(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sis_mohon_id' => 'required|integer',
            'external_permohonan_id' => 'nullable|string',
            'nomor_sertifikat' => 'required|string',
            'tanggal_terbit' => 'required|date',
            'tanggal_kadaluarsa' => 'required|date',
            'sertifikat_file_url' => 'nullable|url',
            'file_name' => 'nullable|string',
            'file_base64' => 'nullable|string',
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

        $finalFileStoragePath = null;
        $nomorSlug = Str::slug(str_replace(['/', '\\'], '-', $validated['nomor_sertifikat'])) ?: 'sertifikat';

        // 1. Prioritas Utama: Simpan langsung berkas PDF yang dikirim SIS dalam Base64
        if (!empty($validated['file_base64'])) {
            $binaryContent = base64_decode($validated['file_base64']);
            if ($binaryContent !== false && strlen($binaryContent) > 0) {
                $ext = 'pdf';
                if (!empty($validated['file_name'])) {
                    $ext = pathinfo($validated['file_name'], PATHINFO_EXTENSION) ?: 'pdf';
                }
                $filename = 'sertifikat_' . $nomorSlug . '_' . $permohonan->id . '.' . $ext;
                $savePath = 'sertifikat/' . $filename;
                Storage::disk('public')->put($savePath, $binaryContent);
                $finalFileStoragePath = 'storage/' . $savePath;
            }
        }

        // 2. Fallback: Unduh dari remote URL jika berkas base64 belum disertakan
        if (!$finalFileStoragePath && !empty($validated['sertifikat_file_url'])) {
            $remoteUrl = $validated['sertifikat_file_url'];
            try {
                $fetchUrl = $remoteUrl;
                $sisInternal = config('services.sis.internal_url') ?: env('SIS_INTERNAL_URL');
                if ($sisInternal) {
                    $parsed = parse_url($remoteUrl);
                    $fetchUrl = rtrim($sisInternal, '/') . ($parsed['path'] ?? '') . (isset($parsed['query']) ? '?' . $parsed['query'] : '');
                } elseif (str_contains($fetchUrl, 'localhost:5100') || str_contains($fetchUrl, '127.0.0.1:5100')) {
                    $fetchUrl = str_replace(
                        ['http://localhost:5100', 'http://127.0.0.1:5100'],
                        'http://private-sis-wsl',
                        $fetchUrl
                    );
                }

                $dlResponse = Http::timeout(20)->get($fetchUrl);
                if ($dlResponse->successful() && strlen($dlResponse->body()) > 0) {
                    $filename = 'sertifikat_' . $nomorSlug . '_' . $permohonan->id . '.pdf';
                    $savePath = 'sertifikat/' . $filename;
                    Storage::disk('public')->put($savePath, $dlResponse->body());
                    $finalFileStoragePath = 'storage/' . $savePath;
                }
            } catch (\Throwable $e) {
                Log::warning("Gagal mengunduh berkas sertifikat dari SIS URL [{$remoteUrl}]: " . $e->getMessage());
            }

            if (!$finalFileStoragePath) {
                $finalFileStoragePath = $remoteUrl;
            }
        }

        DB::beginTransaction();
        try {
            // Update tabel permohonan ke status selesai dengan file sertifikat tersimpan di Polimer
            $permohonan->update([
                'status_workflow' => 'DONE',
                'nomor_sertifikat' => $validated['nomor_sertifikat'],
                'tanggal_sertifikat_terbit' => $validated['tanggal_terbit'],
                'tanggal_sertifikat_kadaluarsa' => $validated['tanggal_kadaluarsa'],
                'file_sertifikat_final' => $finalFileStoragePath,
            ]);

            // Catat milestone selesai 
            PermohonanTrackingLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber' => 'SIS',
                'milestone_code' => 'SERTIFIKAT_DITERBITKAN',
                'judul' => 'Sertifikasi Selesai - e-Sertifikat Terbit',
                'deskripsi' => 'Sertifikat resmi dengan nomor ' . $validated['nomor_sertifikat'] . ' telah terbit dan tersimpan di Polimer',
                'metadata' => [
                    'file_url' => $finalFileStoragePath,
                    'original_sis_url' => $validated['sertifikat_file_url'] ?? null,
                ],
                'created_at' => now(),
            ]);

            // Notifikasi ke user 
            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title' => 'Sertifikat Industri Telah Terbit',
                'content' => 'Selamat! Sertifikat Industri Anda #' . $validated['nomor_sertifikat'],
                'link' => '/app/#/permohonan',
                'is_read' => 'no',
            ]);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Sertifikat berhasil disinkronkan dan disimpan di Polimer',
                'stored_file' => $finalFileStoragePath,
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
}

