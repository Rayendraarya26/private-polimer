<?php

namespace App\Jobs;

use App\Models\Db2\Permohonan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Integration\Services\SisSyncBridgingService;

class SyncPermohonanToSisJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $permohonanId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $permohonan = Permohonan::find($this->permohonanId);

        if (!$permohonan) {
            Log::warning('SyncPermohonanToSisJob - Permohonan not found', [
                'permohonan_id' => $this->permohonanId,
            ]);
            return;
        }

        try {
            $bridgingService = new SisSyncBridgingService();
            $result = $bridgingService->syncPermohonanToSis($permohonan);

            if ($result['success']) {
                Log::info('SyncPermohonanToSisJob - Sync completed', [
                    'permohonan_id' => $this->permohonanId,
                    'message'       => $result['message'] ?? 'OK',
                ]);
            } else {
                Log::warning('SyncPermohonanToSisJob - Sync returned failure', [
                    'permohonan_id' => $this->permohonanId,
                    'message'       => $result['message'] ?? 'Unknown error',
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('SyncPermohonanToSisJob - Exception during sync', [
                'permohonan_id' => $this->permohonanId,
                'error'         => $e->getMessage(),
            ]);

            throw $e; // Re-throw so the job retries
        }
    }
}
