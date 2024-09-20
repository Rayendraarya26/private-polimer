<?php

namespace Modules\Integration\Jobs;

use App\Models\Db1\MasterLayanan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Client\ConnectionException;
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
        public string $type = 'new',
    ) {
    }

    /**
     * Execute the job.
     * @throws ConnectionException
     */
    public function handle(): void
    {
        // laravel http with x-api-key
        $response = Http::timeout(300)->withHeaders([
            'X-API-KEY' => config('integration.api-key'),
            'accept'    => 'application/json',
        ])
            ->post($this->layanan->integration_url, [
                'sync' => $this->type,
            ]);

        // log response
        Log::info(sprintf('Syncing permohonan %s: #%s', $this->type, $this->layanan->code), [
            'response' => $response->json(),
        ]);
    }
}
