<?php

namespace App\Jobs;

use App\Libraries\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNotif implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Notification $notification;
    protected bool $debug;

    /**
     * Create a new job instance.
     */
    public function __construct(Notification $notification, $debug = false)
    {
        $this->notification = $notification;
        $this->debug = $debug;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->notification->send($this->debug);
    }
}
