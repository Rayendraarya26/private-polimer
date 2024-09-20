<?php

namespace Modules\Integration\Console;

use App\Enums\IntegrationType;
use App\Enums\Option;
use App\Models\Db1\MasterLayanan;
use Illuminate\Console\Command;
use Modules\Integration\Jobs\SyncNewPermohonanJob;

class SyncNewPermohonanCmd extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'integration:sync-new-permohonan {type=new}';

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
        $type = $this->argument('type');

        if (!in_array($type, [IntegrationType::NEW->value, IntegrationType::INITIAL->value])) {
            $this->error('Invalid type. Use new or initial');
            return;
        }

        $this->info('Sinkronisasi permohonan ' . $type);

        // Get ALL Layanan
        $listLayanan = MasterLayanan::query()
            ->where('is_active', '=', Option::YES)
            ->get();

        foreach ($listLayanan as $layanan) {
            // Dispatch Job
            SyncNewPermohonanJob::dispatchSync($layanan, $type);
            $this->info(sprintf('Sinkronisasi pemohonan pada layanan %s', $layanan->name));
        }

        $this->info('Sinkronisasi sedang berjalan di background proses.');
    }
}
