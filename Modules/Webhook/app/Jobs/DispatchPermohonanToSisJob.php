<?php

namespace Modules\Webhook\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\Db2\Permohonan;
use Modules\Webhook\Services\SisSyncBridgingService;

class DispatchPermohonanToSisJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;
    public int $backoff = 30;


    public function __construct(public string $permohonanId) {}

    public function handle(SisSyncBridgingService $service): void {
        
        $permohonan = Permohonan::find($this->permohonanId);

        if (!$permohonan) {
            return;
        }

        $service->syncPermohonanToSis($permohonan);
    }

}
