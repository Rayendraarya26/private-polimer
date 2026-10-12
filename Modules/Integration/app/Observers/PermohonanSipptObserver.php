<?php

namespace Modules\Integration\Observers;

use App\Models\Db2\Permohonan;
use Illuminate\Support\Facades\Log;
use Modules\Integration\Jobs\SyncPermohonanToSipptJob;

class PermohonanSipptObserver
{
    /**
     * Handle the Permohonan "updated" event.
     */
    public function updated(Permohonan $permohonan): void
    {
        $isWorkflowDone = in_array(strtoupper(trim((string) $permohonan->status_workflow)), ['DONE', 'SELESAI']);

        $isBayarLunas = strtoupper(trim((string) $permohonan->status_bayar)) === 'LUNAS';

        if ($isWorkflowDone && $isBayarLunas) {
            $hasRelevantChange = $permohonan->wasChanged('status_workflow') || $permohonan->wasChanged('status_bayar');

            if ($hasRelevantChange) {
                Log::info("[SIPPT Observer] Permohonan {$permohonan->no_permohonan} telah LUNAS dan SELESAI 100%. Dispatching SyncPermohonanToSipptJob.");
                try {
                    SyncPermohonanToSipptJob::dispatch($permohonan)->afterCommit();
                } catch (\Throwable $e) {
                    Log::warning("[SIPPT Observer] Gagal dispatch SyncPermohonanToSipptJob: " . $e->getMessage());
                }
            }
        }
    }
}
