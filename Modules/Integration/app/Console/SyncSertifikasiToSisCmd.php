<?php

namespace Modules\Integration\Console;

use App\Models\Db1\PelangganSertifikasi;
use App\Models\Db2\FormSertifikasi;
use App\Models\Db2\Permohonan;
use App\Models\Db2\SertifikasiAudit;
use App\Models\Db2\SertifikasiLks;
use Exception;
use Illuminate\Console\Command;
use Modules\Integration\Services\SisSyncBridgingService;

class SyncSertifikasiToSisCmd extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integration:sync-sertifikasi-sis {--chunk=50 : Batch size}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Continuous two-way synchronization of certification applications, audits, LKS, and certificates to Central SIS database';

    /**
     * Execute the console command.
     */
    public function handle(SisSyncBridgingService $bridgingService): int
    {
        $this->info('====================================================');
        $this->info('  Memulai Sinkronisasi Dua Arah Polimer ke SIS Pusat');
        $this->info('====================================================');

        $chunkSize = (int) $this->option('chunk');
        $successCount = 0;
        $failedCount = 0;

        // 1. Sync Active Applications
        $permohonanList = Permohonan::whereHas('detailPermohonan', function ($q) {
            $q->where('formable_type', FormSertifikasi::class);
        })->get();

        $this->info("Menemukan {$permohonanList->count()} permohonan sertifikasi untuk disinkronkan.");
        foreach ($permohonanList as $p) {
            $result = $bridgingService->syncPermohonanToSis($p);
            if ($result['success']) {
                $successCount++;
            } else {
                $failedCount++;
            }
        }

        // 2. Sync Audits
        $auditList = SertifikasiAudit::all();
        $this->info("Menemukan {$auditList->count()} data audit untuk disinkronkan.");
        foreach ($auditList as $audit) {
            $result = $bridgingService->syncAuditToSis($audit);
            if ($result['success']) {
                $successCount++;
            } else {
                $failedCount++;
            }
        }

        // 3. Sync LKS Findings
        $lksList = SertifikasiLks::all();
        $this->info("Menemukan {$lksList->count()} temuan LKS untuk disinkronkan.");
        foreach ($lksList as $lks) {
            $result = $bridgingService->syncLksToSis($lks);
            if ($result['success']) {
                $successCount++;
            } else {
                $failedCount++;
            }
        }

        // 4. Sync Issued Certificates
        $certList = PelangganSertifikasi::whereNotNull('nomor_sertifikat')->get();
        $this->info("Menemukan {$certList->count()} sertifikat resmi untuk disinkronkan.");
        foreach ($certList as $cert) {
            $result = $bridgingService->syncSertifikatToSis($cert);
            if ($result['success']) {
                $successCount++;
            } else {
                $failedCount++;
            }
        }

        $this->info('====================================================');
        $this->info("Sinkronisasi Selesai!");
        $this->info("Berhasil : {$successCount}");
        $this->info("Gagal    : {$failedCount}");
        $this->info('====================================================');

        return Command::SUCCESS;
    }
}
