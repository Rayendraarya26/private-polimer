<?php

namespace Modules\Integration\Services\Sippt;

use App\Models\Db2\Permohonan;
use App\Models\Db2\SipptSyncLog;
use Exception;
use Illuminate\Support\Facades\Log;

class SipptSyncService
{
    public function __construct(
        protected SipptApiClient $apiClient,
        protected SipptMapperRegistry $mapperRegistry
    ) {}

    /**
     * Sinkronisasi transaksi permohonan ke API SIPPT BSKJI.
     */
    public function syncPermohonan(Permohonan $permohonan, bool $force = false): SipptSyncLog
    {
        // 1. Idempotency check: jika sudah pernah berhasil di-sync dan bukan force, return log lama
        $existingSuccess = SipptSyncLog::where('permohonan_id', $permohonan->id)
            ->where('status', 'success')
            ->first();

        if ($existingSuccess && !$force) {
            Log::info("[SIPPT Sync] Permohonan {$permohonan->no_permohonan} sudah tersinkronisasi sebelumnya. Skip.");
            return $existingSuccess;
        }

        // 2. Resolve Mapper
        $mapper = $this->mapperRegistry->resolve($permohonan);
        $moduleName = $mapper->getModuleName();
        $endpoint = $this->apiClient->buildModuleEndpoint($moduleName, 'insert');

        // 3. Transform data ke payload SIPPT API
        $payload = $mapper->map($permohonan);

        // 4. Siapkan Sync Log awal
        $syncLog = SipptSyncLog::create([
            'permohonan_id'   => $permohonan->id,
            'modul'           => $moduleName,
            'no_order'        => (string) $permohonan->no_permohonan,
            'endpoint'        => $endpoint,
            'method'          => 'POST',
            'request_payload' => $payload,
            'status'          => 'pending',
            'retry_count'     => 0,
        ]);

        // 5. Eksekusi Request ke API SIPPT
        $result = $this->apiClient->executeRequest('POST', $endpoint, $payload);

        // 6. Update Status Sync Log
        $isSuccess = $result['success'] && (
            // Beberapa endpoint BSKJI mengembalikan status: true atau message: Data berhasil
            empty($result['data']) ||
            ($result['data']['status'] ?? true) === true ||
            str_contains(strtolower($result['data']['message'] ?? ''), 'berhasil')
        );

        $syncLog->update([
            'response_payload' => $result['data'] ?: ($result['body'] ? ['raw' => $result['body']] : null),
            'http_status_code' => $result['http_status'],
            'status'           => $isSuccess ? 'success' : 'failed',
            'last_error'       => $isSuccess ? null : ($result['error'] ?: ($result['data']['message'] ?? 'Unknown error')),
            'synced_at'        => $isSuccess ? now() : null,
        ]);

        if ($isSuccess) {
            Log::info("[SIPPT Sync] Berhasil sinkronisasi permohonan {$permohonan->no_permohonan} ke modul [{$moduleName}].");
        } else {
            Log::error("[SIPPT Sync] Gagal sinkronisasi permohonan {$permohonan->no_permohonan} ke modul [{$moduleName}]: {$syncLog->last_error}");
        }

        return $syncLog;
    }

    /**
     * Membatalkan / non-aktifkan data permohonan di SIPPT (soft-delete di server BSKJI).
     */
    public function cancelSync(Permohonan $permohonan): ?SipptSyncLog
    {
        $lastLog = SipptSyncLog::where('permohonan_id', $permohonan->id)
            ->where('status', 'success')
            ->latest()
            ->first();

        if (!$lastLog) {
            Log::info("[SIPPT Cancel] Tidak ada data sukses sebelumnya untuk permohonan {$permohonan->no_permohonan}.");
            return null;
        }

        $moduleName = $lastLog->modul;
        $endpoint = $this->apiClient->buildModuleEndpoint($moduleName, 'non_aktif');
        $payload = [
            [
                'no_order' => (string) $permohonan->no_permohonan,
            ],
        ];

        $result = $this->apiClient->executeRequest('POST', $endpoint, $payload);

        $cancelLog = SipptSyncLog::create([
            'permohonan_id'    => $permohonan->id,
            'modul'            => $moduleName,
            'no_order'         => (string) $permohonan->no_permohonan,
            'endpoint'         => $endpoint,
            'method'           => 'POST',
            'request_payload'  => $payload,
            'response_payload' => $result['data'] ?: ($result['body'] ? ['raw' => $result['body']] : null),
            'http_status_code' => $result['http_status'],
            'status'           => $result['success'] ? 'cancelled' : 'failed',
            'last_error'       => $result['success'] ? null : $result['error'],
            'synced_at'        => $result['success'] ? now() : null,
        ]);

        if ($result['success']) {
            Log::info("[SIPPT Cancel] Berhasil menonaktifkan order {$permohonan->no_permohonan} di SIPPT.");
        }

        return $cancelLog;
    }

    /**
     * Mengirimkan data Proyeksi Penerimaan tahunan ke SIPPT BSKJI.
     */
    public function syncProyeksiPenerimaan(string $jenisLayanan, int $proyeksiNominal, int $tahun): SipptSyncLog
    {
        $endpoint = $this->apiClient->buildModuleEndpoint('proyeksi_penerimaan', 'insert');
        $payload = [
            [
                'jenis_layanan'       => strtoupper($jenisLayanan),
                'proyeksi_penerimaan' => (string) $proyeksiNominal,
                'tahun'               => (string) $tahun,
            ],
        ];

        $result = $this->apiClient->executeRequest('POST', $endpoint, $payload);

        $isSuccess = $result['success'] && (
            empty($result['data']) ||
            ($result['data']['status'] ?? true) === true ||
            str_contains(strtolower($result['data']['message'] ?? ''), 'berhasil')
        );

        return SipptSyncLog::create([
            'permohonan_id'    => null,
            'modul'            => 'proyeksi_penerimaan',
            'no_order'         => "PROYEKSI/{$tahun}/" . strtoupper($jenisLayanan),
            'endpoint'         => $endpoint,
            'method'           => 'POST',
            'request_payload'  => $payload,
            'response_payload' => $result['data'] ?: ($result['body'] ? ['raw' => $result['body']] : null),
            'http_status_code' => $result['http_status'],
            'status'           => $isSuccess ? 'success' : 'failed',
            'last_error'       => $isSuccess ? null : ($result['error'] ?: ($result['data']['message'] ?? 'Proyeksi sync error')),
            'synced_at'        => $isSuccess ? now() : null,
        ]);
    }

    /**
     * Mengulang sinkronisasi (retry) untuk log yang sebelumnya berstatus failed.
     */
    public function retryFailed(SipptSyncLog $log): SipptSyncLog
    {
        if ($log->status === 'success') {
            return $log;
        }

        $log->increment('retry_count');

        $result = $this->apiClient->executeRequest($log->method, $log->endpoint, $log->request_payload);

        $isSuccess = $result['success'] && (
            empty($result['data']) ||
            ($result['data']['status'] ?? true) === true ||
            str_contains(strtolower($result['data']['message'] ?? ''), 'berhasil')
        );

        $log->update([
            'response_payload' => $result['data'] ?: ($result['body'] ? ['raw' => $result['body']] : null),
            'http_status_code' => $result['http_status'],
            'status'           => $isSuccess ? 'success' : 'failed',
            'last_error'       => $isSuccess ? null : ($result['error'] ?: ($result['data']['message'] ?? 'Retry error')),
            'synced_at'        => $isSuccess ? now() : null,
        ]);

        return $log;
    }
}
