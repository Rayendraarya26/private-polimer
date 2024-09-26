<?php

namespace Modules\System\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class RotateLogCmd extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sys:rotate-log';

    /**
     * The console command description.
     */
    protected $description = 'Rotate log with logrotate';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Execute Bash command logrotate
        $result = Process::run('/usr/sbin/logrotate -fv /etc/logrotate.d/laravel-*.logrotate');

        $this->info($result->output());
    }
}
