<?php

namespace Modules\Integration\Jobs;

use App\Models\Db2\Permohonan;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Integration\Services\Sippt\SipptSyncService;
use Throwable;

class SyncPermohonanToSipptJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [60, 300, 900]; // Retry setelah 1 menit, 5 menit, 15 menit

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Permohonan $permohonan,
        public bool $force = false
    ) {}

    /**
     * Execute the job.
     *
     * @throws Exception
     */
    public function handle(SipptSyncService $syncService): void
    {
        Log::info("[SIPPT Queue] Memulai eksekusi job sync SIPPT untuk permohonan {$this->permohonan->no_permohonan}");

        $log = $syncService->syncPermohonan($this->permohonan, $this->force);

        if ($log->status === 'failed') {
            throw new Exception("Sinkronisasi ke SIPPT gagal: " . ($log->last_error ?? 'Unknown error'));
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Log::error("[SIPPT Queue] Job sync SIPPT permanen gagal setelah {$this->tries} percobaan untuk permohonan {$this->permohonan->no_permohonan}: " . $exception->getMessage());
    }
}
