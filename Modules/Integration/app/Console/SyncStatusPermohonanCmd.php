<?php

namespace Modules\Integration\Console;

use App\Enums\DataIntegrasiLayananStatusOrder;
use App\Models\Db1\DataIntegrasiLayanan;
use Illuminate\Console\Command;
use Modules\Integration\Jobs\SyncStatusPermohonanJob;

class SyncStatusPermohonanCmd extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'integration:sync-permohonan';

    /**
     * The console command description.
     */
    protected $description = 'Sinkronisasi status permohonan dengan layanan eksternal.';

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
        $this->info('Syncing status permohonan dimulai');

        // Get ALL Layanan
        $listDIL = DataIntegrasiLayanan::query()
            ->with('layanan')
            ->where('status_order', '!=', DataIntegrasiLayananStatusOrder::SELESAI)
            ->get();

        foreach ($listDIL as $permohonan) {
            // Dispatch Job
            SyncStatusPermohonanJob::dispatch($permohonan->layanan, $permohonan->id_order);
            $this->info(sprintf('Syncing layanan: #%s', $permohonan->kode_order));
        }

        $this->info('Syncing status permohonan selesai.');
    }
}
