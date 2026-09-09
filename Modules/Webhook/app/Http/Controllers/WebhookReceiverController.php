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
            'external_permohonan_id' => 'required|uuid', 
            'milestone_code' => 'required|string',
            'milestone_title' => 'required|string',
            'milestone_description' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $permohonan = Permohonan::find($validated['external_permohonan_id']);
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

            // Simpan ke tracking timeline 
            PermohonanTrackingLog::create([
                'id'            => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'sumber'        => 'SIS',
                'milestone_code'=> $validated['milestone_code'],
                'judul'         => $validated['milestone_title'],
                'deskripsi'     => $validated['milestone_description'] ?? null,
                'metadata'      => $validated['metadata'] ?? null,
                'created_at'    => now(),
            ]);

            // Kirim notifikasi ke pelanggan
            SysUserNotif::create([
                'user_id'   => $permohonan->created_by,
                'title'     => $validated['milestone_title'],
                'content'   => $validated['milestone_description'] ?? 'Ada pembaruan status sertifikasi industri.',
                'link'      => route('permohonan.layanan.detail', $permohonan->id),
                'is_read'   => 'no',
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
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()], 
            500);
        }
    }

    /**
     * Menerima notifikasi penerbitan e-Sertifikat resmi dari SIS
     */
    public function handleCertificateIssued(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sis_mohon_id'              => 'required|integer',
            'external_permohonan_id'    => 'required|uuid',
            'nomor_sertifikat'          => 'required|string',
            'tanggal_terbit'            => 'required|date', 
            'tanggal_kadaluarsa'        => 'required|date', 
            'sertifikat_file_url'       => 'required|url', 
        ]);

        $permohonan = Permohonan::find($validated['external_permohonan_id']);
        if (!$permohonan) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        }

        DB::beginTransaction();
        try {
            // Update tabel permohonan ke status selesai
            $permohonan->update([
                'status_workflow'               => 'DONE',
                'nomor_sertifikat'              => $validated['nomor_sertifikat'],
                'tanggal_sertifikat_terbit'     => $validated['tanggal_terbit'], 
                'tanggal_sertifikat_kadaluarsa' => $validated['tanggal_kadaluarsa'],
                'file_sertifikat_final'         => $validated['sertifikat_file_url'],
            ]);

            // Catat milestone selesai 
            PermohonanTrackingLog::create([
                'id'                => (string) Str::uuid(),
                'permohonan_id'     => $permohonan->id,
                'sumber'            => 'SIS',
                'milestone_code'    => 'SERTIFIKAT_DITERBITKAN',
                'judul'             => 'Sertifikasi Selesai - e-Sertifikat Terbit',
                'deskripsi' => 'Sertifikat resmi dengan nomor ' . $validated['nomor_sertifikat'] . ' telah terbit dan siap diunduh',
                'metadata' => ['file_url' => $validated['sertifikat_file_url']],
                'created_at' => now(),
            ]);

            // Notifikasi ke user 
            SysUserNotif::create([
                'user_id' => $permohonan->created_by,
                'title' => 'Sertifikat Industri Telah Terbit',
                'content' => 'Selamat! Sertifikat Industri Anda #'. $validated['nomor_sertifikat'],
                'link' => route('permohonan.layanan.detail', $permohonan->id),
                'is_read' => 'no',
            ]);


            DB::commit();
            return response()->json(['success' => true, 'message' => 'Sertifikat berhasil disinkronkan ke Polimer']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()], 
            500);
        }
    }
}

