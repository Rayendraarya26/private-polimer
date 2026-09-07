<?php

namespace Modules\Webhook\Services;
use App\Models\Db2\Permohonan; 
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
        $this->sisBaseUrl   = rtrim(env('SIS_API_BASE_URL', 'https://sis.bbkkp.go.id/api/v1'), '/');
        $this->apiKey       = env('SIS_API_KEY', 'bbkkp_sis_secure_api_key_2026');
        $this->sharedSecret = env('WEBHOOK_SHARED_SECRET', 'bbkkp_polimer_sis_hmac_secret_2026');
    }

    public function syncPermohonanToSis(Permohonan $permohonan): array
    {
        $permohonan->load(['formSertifikasi', 'detailPembayaran', 'creator.pelanggan.detail']);
        $form       = $permohonan->formSertifikasi?->first();
        $perusahaan = $permohonan->creator?->pelanggan?->detail;


        $payload = [
            'external_permohonan_id' => $permohonan->id, 
            'no_permohonan'          => $permohonan->no_permohonan, 
            'tgl_permohonan'         => $permohonan->tgl_order?->format('Y-m-d'),
            'tipe_pengajuan'         => strtolower($form?->jenis_pengajuan ?? 'baru'),
            'sertifikat_lama_nomor'  => $form?->sertifikat_lama_nomor, 
            'pemohon'                => [
                'email'           => $form?->email ?? $permohonan->creator?->email,
                'nama_perusahaan' => $form?->nama_perusahaan ?? $perusahaan?->nama, 
                'badan_hukum'     => $perusahaan?->bentuk_badan_usaha ?? 'PT',
                'nomor_akta'      => $form?->nomor_akta_pendirian ?? $perusahaan?->no_akta_pendirian,
                'pimpinan'        => $form?->nama_pimpinan ?? $perusahaan?->pimpinan, 
                'pemilik'         => $form?->nama_pemilik ?? $perusahaan?->pemilik,
                'wakil_manajemen' => $form?->nama_wakil_manajemen ?? $perusahaan?->pj_nama, 
                'no_telp'         => $form?->no_telp ?? $perusahaan?->telepon, 
                'no_whatsapp'     => $form?->no_whatsapp ?? $perusahaan?->whatsapp,
                'alamat'          => $form?->alamat_kantor ?? $perusahaan?->alamat,
            ],
            'ketenagakerjaan' => [
            'jumlah_karyawan_total' => $form?->jumlah_karyawan_total ?? 0,
            'jumlah_manajemen'      => $form?->jumlah_manajemen ?? 0,
            'jumlah_administrasi'   => $form?->jumlah_administrasi ?? 0,
            'jumlah_operasional'    => $form?->jumlah_operasional ?? 0,
            'jumlah_part_time'      => $form?->jumlah_part_time ?? 0,
            'jumlah_shift_1'        => $form?->jumlah_shift_1 ?? 0,
            'jumlah_shift_2'        => $form?->jumlah_shift_2 ?? 0,
            'jumlah_shift_3'        => $form?->jumlah_shift_3 ?? 0,
            'luas_tanah'            => $form?->luas_tanah ?? 0,
            'luas_bangunan'         => $form?->luas_bangunan ?? 0,
            ],
            'pabrik' => $form?->pabrik_json ?? [],
            'komoditas' => $form?->komoditas_json ?? [],
            'dokumen_berkas' => $form?->file_dokumen_pendukung_json ?? [],
            'keuangan' => [
                'invoice_number' => $permohonan->invoice_number,
                'kuitansi_number'=> $permohonan->kuitansi_number,
                'total_bayar' => $permohonan->detailPembayaran->sum('subtotal'),
                'status_bayar' => 'LUNAS',
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
}

