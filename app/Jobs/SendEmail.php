<?php

namespace App\Jobs;

use App\Libraries\Mailer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Mailer $mailer;
    /**
     * Create a new job instance.
     */
    public function __construct(Mailer $email)
    {
        $this->mailer = $email;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->mailer->send();
    }
}
