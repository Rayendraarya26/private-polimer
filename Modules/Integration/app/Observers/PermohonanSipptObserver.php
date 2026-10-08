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
        // 1. Cek perubahan status penyelesaian (DONE / SELESAI)
        $isWorkflowDone = $permohonan->wasChanged('status_workflow')
            && in_array(strtoupper(trim($permohonan->status_workflow)), ['DONE', 'SELESAI']);

        // 2. Cek perubahan status pembayaran (LUNAS)
        $isBayarLunas = $permohonan->wasChanged('status_bayar')
            && strtoupper(trim($permohonan->status_bayar)) === 'LUNAS';

        if ($isWorkflowDone || $isBayarLunas) {
            Log::info("[SIPPT Observer] Permohonan {$permohonan->no_permohonan} memenuhi kriteria sync (Workflow: {$permohonan->status_workflow}, Bayar: {$permohonan->status_bayar}). Dispatching SyncPermohonanToSipptJob.");
            SyncPermohonanToSipptJob::dispatch($permohonan);
        }
    }
}
