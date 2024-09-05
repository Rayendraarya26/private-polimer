<?php

namespace Modules\Integration\Console;

use Illuminate\Console\Command;

class SyncUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integration:sync-user-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync User from Apps, PUK, SIL, dan SIS';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Sync all user to polimer');

        $this->call('integration:sync-user-apps');
        $this->call('integration:sync-user-puk');
        $this->call('integration:sync-user-sil');
        $this->call('integration:sync-user-sis');
    }
}
