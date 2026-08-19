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
        Schema::create('sertifikasi_lks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('audit_id')->constrained('sertifikasi_audit')->cascadeOnDelete();
            $table->string('nomor_lks', 100)->index();
            $table->enum('kategori', ['MAYOR', 'MINOR', 'OBSERVASI'])->default('MINOR')->index();
            
            $table->string('klausul_standar')->nullable()->comment('Klausul SNI/ISO terkait');
            $table->text('deskripsi_temuan');
            $table->text('akar_masalah')->nullable();
            $table->text('tindakan_koreksi')->nullable();
            $table->date('batas_waktu_revisi')->nullable();
            
            $table->enum('status_lks', ['OPEN', 'SUBMITTED', 'VERIFIED_CLOSED', 'REJECTED'])->default('OPEN')->index();
            $table->foreignUuid('diverifikasi_oleh')->nullable()->constrained('sys_user')->nullOnDelete();
            $table->timestampTz('diverifikasi_pada')->nullable();
            
            $table->timestampsTz();
            $table->softDeletesTz();
        });

        Schema::create('sertifikasi_lks_revisi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('lks_id')->constrained('sertifikasi_lks')->cascadeOnDelete();
            $table->text('keterangan_revisi');
            $table->string('file_bukti_perbaikan')->nullable()->comment('Bukti perbaikan / tindakan koreksi');
            $table->enum('status_revisi', ['DIAJUKAN', 'DITERIMA', 'DITOLAK'])->default('DIAJUKAN');
            $table->text('catatan_auditor')->nullable();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sertifikasi_lks_revisi');
        Schema::dropIfExists('sertifikasi_lks');
    }
};
