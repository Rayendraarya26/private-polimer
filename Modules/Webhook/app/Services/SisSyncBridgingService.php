<?php

namespace Modules\Webhook\Services;
use App\Models\Db2\Permohonan;
use App\Models\Db2\Billing;
use App\Models\Db2\IntegrationLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SisSyncBridgingService
{
    protected string $sisBaseUrl;
    protected string $apiKey;
    protected string $sharedSecret;

    public function __construct()
    {
        $this->sisBaseUrl = rtrim(env('SIS_API_BASE_URL', 'https://sis.bbkkp.go.id/api/v1'), '/');
        $this->apiKey = env('SIS_API_KEY', 'bbkkp_sis_secure_api_key_2026');
        $this->sharedSecret = env('WEBHOOK_SHARED_SECRET', 'bbkkp_polimer_sis_hmac_secret_2026');
    }

    public function syncPermohonanToSis(Permohonan $permohonan): array
    {
        $permohonan->load(['formSertifikasi', 'detailPembayaran', 'creator.pelanggan.detail', 'penawaranBiaya']);
        $form = $permohonan->formSertifikasi?->first();
        $perusahaan = $permohonan->creator?->pelanggan?->detail;
        $penawaran = $permohonan->penawaranBiaya;

        $filePenawaranUrl = null;
        if ($permohonan->file_surat_penawaran) {
            $filePenawaranUrl = asset('storage/' . $permohonan->file_surat_penawaran);
        } elseif ($penawaran?->file_surat_penawaran) {
            $filePenawaranUrl = asset('storage/' . $penawaran->file_surat_penawaran);
        } elseif ($permohonan->catatan_admin && str_ends_with(strtolower($permohonan->catatan_admin), '.pdf')) {
            $filePenawaranUrl = asset('storage/' . $permohonan->catatan_admin);
        }

        $totalNominal = (float) ($permohonan->harga_permohonan ?? ($penawaran?->total_nominal ?? $permohonan->detailPembayaran->sum('subtotal')));

        $statusPenawaranSis = 'belum';
        if ($permohonan->status_bayar === 'LUNAS' || $permohonan->status_penawaran === 'setuju' || ($penawaran?->status_persetujuan ?? null) === 'DISETUJUI') {
            $statusPenawaranSis = 'setuju';
        } elseif ($filePenawaranUrl || $totalNominal > 0 || $permohonan->status_workflow === 'PEMBAYARAN' || $permohonan->status_penawaran === 'proses') {
            $statusPenawaranSis = 'proses';
        }

        $payload = [
            'external_permohonan_id' => $permohonan->id,
            'no_permohonan' => $permohonan->no_permohonan,
            'status_workflow' => $permohonan->status_workflow,
            'tgl_permohonan' => $permohonan->tgl_order?->format('Y-m-d') ?? $permohonan->created_at?->format('Y-m-d'),
            'tipe_pengajuan' => strtolower($form?->jenis_pengajuan ?? 'baru'),
            'sertifikat_lama_nomor' => $form?->sertifikat_lama_nomor,
            'pemohon' => [
                'email' => $form?->email ?? $permohonan->creator?->email,
                'nama_perusahaan' => $form?->nama_perusahaan ?? $perusahaan?->nama,
                'badan_hukum' => $perusahaan?->bentuk_badan_usaha ?? 'PT',
                'jenis_perusahaan_id' => (int) ($form?->jenis_perusahaan_id ?? ($perusahaan?->jenis_perusahaan_id ?? 1)),
                'jenis_perusahaan' => $form?->jenis_perusahaan ?? ($perusahaan?->jenis ?? 'Produsen / Pabrikan'),
                'nomor_akta' => $form?->nomor_akta_pendirian ?? $perusahaan?->no_akta_pendirian,
                'npwp' => $form?->npwp ?? $perusahaan?->npwp,
                'nib' => $form?->nib ?? $perusahaan?->nib,
                'pimpinan' => $form?->nama_pimpinan ?? $perusahaan?->pimpinan,
                'pemilik' => $form?->nama_pemilik ?? $perusahaan?->pemilik,
                'wakil_manajemen' => $form?->nama_wakil_manajemen ?? $perusahaan?->pj_nama,
                'no_telp' => $form?->no_telp ?? $perusahaan?->telepon,
                'no_whatsapp' => $form?->no_whatsapp ?? $perusahaan?->whatsapp,
                'alamat' => $form?->alamat_kantor ?? $perusahaan?->alamat,
            ],
            'ketenagakerjaan' => [
                'jumlah_karyawan_total' => $form?->jumlah_karyawan_total ?? 0,
                'jumlah_manajemen' => $form?->jumlah_manajemen ?? 0,
                'jumlah_administrasi' => $form?->jumlah_administrasi ?? 0,
                'jumlah_operasional' => $form?->jumlah_operasional ?? 0,
                'jumlah_part_time' => $form?->jumlah_part_time ?? 0,
                'jumlah_shift_1' => $form?->jumlah_shift_1 ?? 0,
                'jumlah_shift_2' => $form?->jumlah_shift_2 ?? 0,
                'jumlah_shift_3' => $form?->jumlah_shift_3 ?? 0,
                'luas_tanah' => $form?->luas_tanah ?? 0,
                'luas_bangunan' => $form?->luas_bangunan ?? 0,
            ],
            'pabrik' => $form?->pabrik_json ?? [],
            'komoditas' => $form?->komoditas_json ?? [],
            'dokumen_berkas' => $form?->file_dokumen_pendukung_json ?? [],
            'file_kuesioner' => $form?->file_pertanyaan_tambahan ?? null,
            'tagihan_biaya' => [
                'total_nominal' => $totalNominal,
                'file_penawaran_url' => $filePenawaranUrl,
                'status_tagihan' => $statusPenawaranSis,
                'nomor_surat' => $penawaran?->nomor_surat_penawaran ?? null,
            ],
            'keuangan' => [
                'invoice_number' => $permohonan->invoice_number,
                'kuitansi_number' => $permohonan->kuitansi_number,
                'total_bayar' => $totalNominal,
                'status_bayar' => $permohonan->status_bayar === 'LUNAS' ? 'LUNAS' : 'BELUM',
            ],
        ];

        $rawJson = json_encode($payload);
        $timestamp = now()->toISOString();
        $signature = hash_hmac('sha256', $timestamp . '.' . $rawJson, $this->sharedSecret);

        $endpointUrl = $this->sisBaseUrl . '/bridge/permohonan/create-from-polimer';

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey,
                'X-Webhook-Timestamp' => $timestamp,
                'X-Webhook-Signature' => $signature,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($endpointUrl, $payload);

            $resJson = $response->json();

            // Catat log
            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'arah' => 'OUTGOING_TO_SIS',
                'endpoint' => $endpointUrl,
                'method' => 'POST',
                'payload_request' => $payload,
                'payload_response' => $resJson,
                'http_status' => $response->status(),
                'status' => $response->successful() ? 'SUCCESS' : 'FAILED',
                'error_message' => $response->successful() ? null : ($resJson['message'] ?? 'HTTP Error'),
            ]);

            if ($response->successful() && isset($resJson['data']['sis_mohon_id'])) {
                $permohonan->update([
                    'sis_mohon_id' => $resJson['data']['sis_mohon_id'],
                    'sis_sync_status' => 'SYNCED',
                    'sis_synced_at' => now(),
                ]);
                return ['success' => true, 'data' => $resJson];
            }

            return ['success' => false, 'message' => $resJson['message'] ?? 'Sync gagal'];

        } catch (\Throwable $e) {
            Log::error('SisSyncBridgingService Error: ' . $e->getMessage());
            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'arah' => 'OUTGOING_TO_SIS',
                'endpoint' => $endpointUrl,
                'method' => 'POST',
                'payload_request' => $payload,
                'payload_response' => null,
                'http_status' => 500,
                'status' => 'FAILED',
                'error_message' => $e->getMessage(),
            ]);

            throw $e;

        }
    }


    public function updatePaymentStatusToSis(Permohonan $permohonan): array
    {
        $endpoint = $this->sisBaseUrl . '/bridge/permohonan/update-payment-status';

        $payload = [
            'external_permohonan_id' => $permohonan->id,
            'no_permohonan' => $permohonan->no_permohonan,
            'status_bayar' => 'LUNAS',
            'kuitansi_number' => $permohonan->kuitansi_number,
            'total_bayar' => (float) $permohonan->total_harga,
            'paid_at' => now()->toIso8601String(),
        ];

        $rawJson = json_encode($payload);
        $timestamp = now()->toISOString();
        $signature = hash_hmac('sha256', $timestamp . '.' . $rawJson, $this->sharedSecret);

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey,
                'X-Webhook-Timestamp' => $timestamp,
                'X-Webhook-Signature' => $signature,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout(15)->post($endpoint, $payload);

            $resJson = $response->json();

            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'arah' => 'OUTGOING_TO_SIS',
                'endpoint' => $endpoint,
                'method' => 'POST',
                'payload_request' => $payload,
                'payload_response' => $resJson,
                'http_status' => $response->status(),
                'status' => $response->successful() ? 'SUCCESS' : 'FAILED',
                'error_message' => $response->successful() ? null : ($resJson['message'] ?? 'HTTP Error'),
            ]);

            return [
                'status_code' => $response->status(),
                'body' => $resJson,
            ];
        } catch (\Throwable $e) {
            Log::error('updatePaymentStatusToSis error: ' . $e->getMessage());
            return [
                'status_code' => 500,
                'body' => ['success' => false, 'message' => $e->getMessage()],
            ];
        }
    }


    public function syncPenawaranBiayaToSis(Permohonan $permohonan): array
    {
        $penawaran = $permohonan->penawaranBiaya;

        $fileUrl = null;
        if ($permohonan->file_surat_penawaran) {
            $fileUrl = asset('storage/' . $permohonan->file_surat_penawaran);
        } elseif ($penawaran?->file_surat_penawaran) {
            $fileUrl = asset('storage/' . $penawaran->file_surat_penawaran);
        } elseif ($permohonan->catatan_admin && str_ends_with(strtolower($permohonan->catatan_admin), '.pdf')) {
            $fileUrl = asset('storage/' . $permohonan->catatan_admin);
        }

        $totalNominal = (float) ($permohonan->harga_permohonan ?? ($penawaran?->total_nominal ?? $permohonan->detailPembayaran->sum('subtotal')));
        $statusPenawaran = $permohonan->status_penawaran ?: 'proses';

        $endpointUrl = $this->sisBaseUrl . '/bridge/permohonan/sync-penawaran-biaya';
        $payload = [
            'external_permohonan_id' => $permohonan->id,
            'no_permohonan' => $permohonan->no_permohonan,
            'total_nominal' => $totalNominal,
            'file_penawaran_url' => $fileUrl,
            'status_tagihan' => $statusPenawaran,
            'nomor_surat' => $penawaran?->nomor_surat_penawaran ?? null,
            'updated_at' => now()->toIso8601String(),
        ];

        $rawJson = json_encode($payload);
        $timestamp = now()->toISOString();
        $signature = hash_hmac('sha256', $timestamp . '.' . $rawJson, $this->sharedSecret);

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey,
                'X-Webhook-Timestamp' => $timestamp,
                'X-Webhook-Signature' => $signature,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($endpointUrl, $payload);

            $resJson = $response->json();

            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan->id,
                'arah' => 'OUTGOING_TO_SIS',
                'endpoint' => $endpointUrl,
                'method' => 'POST',
                'payload_request' => $payload,
                'payload_response' => $resJson,
                'http_status' => $response->status(),
                'status' => $response->successful() ? 'SUCCESS' : 'FAILED',
                'error_message' => $response->successful() ? null : ($resJson['message'] ?? 'HTTP Error'),
            ]);

            return ['success' => $response->successful(), 'data' => $resJson];
        } catch (\Throwable $e) {
            Log::error('Gagal syncPenawaranBiayaToSis: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function syncBillingToSis(Billing $billing): array
    {
        $billing->load(['items', 'permohonan.formSertifikasi']);
        $permohonan = $billing->permohonan;
        $form = $permohonan?->formSertifikasi?->first();

        $fileInvoiceUrl = $billing->file_invoice ? asset('storage/' . $billing->file_invoice) : null;

        $itemsPayload = [];
        foreach ($billing->items as $itm) {
            $itemsPayload[] = [
                'bil_tipe' => strtolower($itm->tipe_item) === 'surveilans' ? 'surveilans' : 'lain-lain',
                'mohon_id' => $permohonan?->id,
                'bil_desc' => sprintf("[%s] %s (%s %s @ Rp %s)", $itm->tipe_item, $itm->nama_komponen, $itm->qty, $itm->satuan, number_format($itm->harga_satuan, 0, ',', '.')),
                'bil_total' => $itm->subtotal,
            ];
        }

        $endpointUrl = $this->sisBaseUrl . '/bridge/billing/sync';

        $payload = [
            'external_permohonan_id' => $permohonan?->id,
            'no_permohonan' => $permohonan?->no_permohonan,
            'cust_email' => $form?->email ?? $permohonan?->creator?->email,
            'bill_nomor_billing' => $billing->no_billing,
            'bill_billing_date' => $billing->billing_date?->format('Y-m-d H:i:s'),
            'bill_due_date' => $billing->due_date?->format('Y-m-d H:i:s'),
            'bill_harus_lunas' => $billing->harus_lunas,
            'bill_total' => (float) $billing->total_nominal,
            'bill_invoice_url' => $fileInvoiceUrl,
            'status_pembayaran' => $billing->status_pembayaran,
            'data_billing_item' => $itemsPayload,
            'created_at' => now()->toIso8601String(),
        ];

        $rawJson = json_encode($payload);
        $timestamp = now()->toISOString();
        $signature = hash_hmac('sha256', $timestamp . '.' . $rawJson, $this->sharedSecret);

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey,
                'X-Webhook-Timestamp' => $timestamp,
                'X-Webhook-Signature' => $signature,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($endpointUrl, $payload);

            $resJson = $response->json();

            IntegrationLog::create([
                'id' => (string) Str::uuid(),
                'permohonan_id' => $permohonan?->id,
                'arah' => 'OUTGOING_TO_SIS',
                'endpoint' => $endpointUrl,
                'method' => 'POST',
                'payload_request' => $payload,
                'payload_response' => $resJson,
                'http_status' => $response->status(),
                'status' => $response->successful() ? 'SUCCESS' : 'FAILED',
                'error_message' => $response->successful() ? null : ($resJson['message'] ?? 'HTTP Error'),
            ]);

            if ($response->successful() && isset($resJson['data']['bill_id'])) {
                return [
                    'success' => true,
                    'sis_bill_id' => $resJson['data']['bill_id'],
                    'message' => 'Billing berhasil disinkronkan ke SIS'
                ];
            }

            return ['success' => false, 'message' => $resJson['message'] ?? 'Gagal response SIS'];

        } catch (\Throwable $e) {
            Log::error('Gagal syncBillingToSis: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Mengirim persetujuan temuan & lampiran berkas perbaikan Tahap 1 dari Polimer ke SIS
     */
    public function syncApproveTemuanTahap1ToSis(Permohonan $permohonan, array $data): array
    {
        $endpointUrl = $this->sisBaseUrl . '/bridge/permohonan/approve-temuan-tahap1';

        $payload = [
            'external_permohonan_id' => $permohonan->id,
            'status'                 => $data['status'] ?? 'setuju',
            'catatan'                => $data['catatan'] ?? null,
            'file_perbaikan_url'     => $data['file_perbaikan_url'] ?? null,
            'file_perbaikan_name'    => $data['file_perbaikan_name'] ?? null,
            'submitted_at'           => now()->toIso8601String(),
        ];

        $rawJson = json_encode($payload);
        $timestamp = now()->toISOString();
        $signature = hash_hmac('sha256', $timestamp . '.' . $rawJson, $this->sharedSecret);

        try {
            $response = Http::withHeaders([
                'X-API-KEY'           => $this->apiKey,
                'X-Webhook-Timestamp' => $timestamp,
                'X-Webhook-Signature' => $signature,
                'Content-Type'        => 'application/json',
                'Accept'              => 'application/json',
            ])->timeout(30)->post($endpointUrl, $payload);

            $resJson = $response->json();

            IntegrationLog::create([
                'id'               => (string) Str::uuid(),
                'permohonan_id'    => $permohonan->id,
                'arah'             => 'OUTGOING_TO_SIS',
                'endpoint'         => $endpointUrl,
                'method'           => 'POST',
                'payload_request'  => $payload,
                'payload_response' => $resJson,
                'http_status'      => $response->status(),
                'status'           => $response->successful() ? 'SUCCESS' : 'FAILED',
                'error_message'    => $response->successful() ? null : ($resJson['message'] ?? 'HTTP Error'),
            ]);

            if ($response->successful() && ($resJson['success'] ?? false)) {
                return [
                    'success' => true,
                    'message' => $resJson['message'] ?? 'Temuan Tahap 1 berhasil disetujui di SIS',
                    'data'    => $resJson['data'] ?? [],
                ];
            }

            return [
                'success' => false,
                'message' => $resJson['message'] ?? 'Gagal memproses persetujuan temuan di SIS',
            ];

        } catch (\Throwable $e) {
            Log::error('Gagal syncApproveTemuanTahap1ToSis: ' . $e->getMessage());

            IntegrationLog::create([
                'id'               => (string) Str::uuid(),
                'permohonan_id'    => $permohonan->id,
                'arah'             => 'OUTGOING_TO_SIS',
                'endpoint'         => $endpointUrl,
                'method'           => 'POST',
                'payload_request'  => $payload,
                'payload_response' => null,
                'http_status'      => 500,
                'status'           => 'FAILED',
                'error_message'    => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
}

