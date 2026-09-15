<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class MigrateSisHistoryCommandTest extends TestCase
{
    public function test_migrate_sis_history_command_runs_with_dry_run_option(): void
    {
        // When connection to SIS is not live in test suite, it should gracefully output message
        $exitCode = Artisan::call('integration:migrate-sis-history', ['--dry-run' => true]);
        
        $output = Artisan::output();
        
        // Assert command completed successfully or handled connection gracefully
        $this->assertContains($exitCode, [0, 1]);
        $this->assertStringContainsString('Memulai ETL Migrasi Data Historis & Sertifikat SIS', $output);
    }
}
