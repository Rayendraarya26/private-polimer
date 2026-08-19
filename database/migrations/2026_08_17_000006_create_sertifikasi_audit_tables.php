<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sertifikasi_audit', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();
            $table->enum('tipe_audit', ['TAHAP_1', 'TAHAP_2', 'SURVEILANS', 'RESERTIFIKASI'])->default('TAHAP_1')->index();
            $table->foreignUuid('lead_auditor_id')->nullable()->constrained('sys_user')->nullOnDelete();
            
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->enum('status_audit', ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])->default('PLANNED')->index();
            
            $table->text('kesimpulan_audit')->nullable();
            $table->string('laporan_audit_file')->nullable()->comment('File PDF Laporan Hasil Audit (LHA)');
            $table->json('metadata')->nullable()->comment('Rincian rencana sampling, agenda audit, dan catatan lapangan');
            
            $table->timestampsTz();
            $table->softDeletesTz();
        });

        Schema::create('sertifikasi_audit_tim', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('audit_id')->constrained('sertifikasi_audit')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('sys_user')->cascadeOnDelete();
            $table->enum('peran', ['LEAD_AUDITOR', 'AUDITOR', 'TENAGA_AHLI', 'OBSERVER'])->default('AUDITOR');
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sertifikasi_audit_tim');
        Schema::dropIfExists('sertifikasi_audit');
    }
};
