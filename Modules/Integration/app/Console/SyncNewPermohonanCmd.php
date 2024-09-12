<?php

namespace Modules\Integration\Console;

use App\Enums\Option;
use App\Models\Db1\MasterLayanan;
use Illuminate\Console\Command;
use Modules\Integration\Jobs\SyncNewPermohonanJob;

class SyncNewPermohonanCmd extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'integration:sync-new-permohonan';

    /**
     * The console command description.
     */
    protected $description = 'Sinkronisasi permohonan baru dari layanan eksternal ke Polimer';

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
        $this->info('Syncing permohonan baru');

        // Get ALL Layanan
        $listLayanan = MasterLayanan::query()
            ->where('is_active', '=', Option::YES)
            ->get();

        foreach ($listLayanan as $layanan) {
            // Dispatch Job
            SyncNewPermohonanJob::dispatch($layanan);
            $this->info(sprintf('Syncing pemohonan pada layanan %s', $layanan->name));
        }

        $this->info('Syncing permohonan selesai.');
    }
}
