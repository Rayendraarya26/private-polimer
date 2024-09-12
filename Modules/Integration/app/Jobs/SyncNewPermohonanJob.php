<?php

namespace Modules\Integration\Jobs;

use App\Models\Db1\MasterLayanan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncNewPermohonanJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public MasterLayanan $layanan,
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // laravel http with x-api-key
        $response = Http::withHeaders([
            'X-API-KEY' => config('integration.api-key'),
            'accept'    => 'application/json',
        ])
            ->post($this->layanan->integration_url, [
                'sync' => 'new',
            ]);

        // log response
        Log::info(sprintf('Syncing permohonan baru: #%s', $this->layanan->code), [
            'response' => $response->json(),
        ]);
    }
}
