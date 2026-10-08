<?php

namespace Modules\Integration\Console;

use App\Models\Db2\Permohonan;
use App\Models\Db2\SipptSyncLog;
use Illuminate\Console\Command;
use Modules\Integration\Services\Sippt\SipptSyncService;

class SipptRetrySyncCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sippt:retry-sync 
                            {--id= : ID permohonan spesifik untuk sinkronisasi}
                            {--order= : Nomor order/permohonan spesifik}
                            {--all : Coba ulang seluruh log sinkronisasi yang gagal}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mencoba ulang sinkronisasi SIPPT BSKJI untuk data yang gagal';

    /**
     * Execute the console command.
     */
    public function handle(SipptSyncService $syncService): int
    {
        $this->info('====================================================');
        $this->info('  Mencoba Ulang (Retry) Sinkronisasi SIPPT BSKJI');
        $this->info('====================================================');

        $permohonanId = $this->option('id');
        $noOrder = $this->option('order');
        $retryAll = $this->option('all');

        if ($permohonanId) {
            $permohonan = Permohonan::find($permohonanId);
            if (!$permohonan) {
                $this->error("Permohonan dengan ID [{$permohonanId}] tidak ditemukan.");
                return self::FAILURE;
            }
            $this->syncSingle($syncService, $permohonan);
            return self::SUCCESS;
        }

        if ($noOrder) {
            $permohonan = Permohonan::where('no_permohonan', $noOrder)->first();
            if (!$permohonan) {
                $this->error("Permohonan dengan nomor order [{$noOrder}] tidak ditemukan.");
                return self::FAILURE;
            }
            $this->syncSingle($syncService, $permohonan);
            return self::SUCCESS;
        }

        if ($retryAll) {
            $failedLogs = SipptSyncLog::where('status', 'failed')->get();
            if ($failedLogs->isEmpty()) {
                $this->info('Tidak ada log sinkronisasi SIPPT yang berstatus failed.');
                return self::SUCCESS;
            }

            $this->info("Menemukan {$failedLogs->count()} data sinkronisasi yang gagal. Memulai retry...");
            $success = 0;
            $failed = 0;

            foreach ($failedLogs as $log) {
                $this->line("• Mencoba ulang order: {$log->no_order} [Modul: {$log->modul}]...");
                $updatedLog = $syncService->retryFailed($log);

                if ($updatedLog->status === 'success') {
                    $this->info("  ✅ Sukses");
                    $success++;
                } else {
                    $this->error("  ❌ Gagal: {$updatedLog->last_error}");
                    $failed++;
                }
            }

            $this->newLine();
            $this->info("Hasil Retry: Sukses = {$success}, Gagal = {$failed}");
            return self::SUCCESS;
        }

        $this->warn('Silakan tentukan opsi: --all, --id=[ID], atau --order=[NO_ORDER]');
        return self::INVALID;
    }

    protected function syncSingle(SipptSyncService $syncService, Permohonan $permohonan): void
    {
        $this->line("Sinkronisasi permohonan: {$permohonan->no_permohonan}...");
        $log = $syncService->syncPermohonan($permohonan, true);

        if ($log->status === 'success') {
            $this->info("✅ Berhasil disinkronkan ke modul [{$log->modul}].");
        } else {
            $this->error("❌ Gagal: {$log->last_error}");
        }
    }
}
