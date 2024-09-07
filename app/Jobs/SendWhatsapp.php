<?php

namespace App\Jobs;

use App\Libraries\WhatsappService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWhatsapp implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public WhatsappService $service)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->service->send();
    }
}
