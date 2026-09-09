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
        Schema::create('sertifikasi_komite', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();
            $table->foreignUuid('audit_id')->nullable()->constrained('sertifikasi_audit')->nullOnDelete();
            
            $table->string('nomor_sidang', 100)->index();
            $table->date('tanggal_sidang');
            $table->enum('status_sidang', ['DIJADWALKAN', 'SELESAI', 'DITUNDA'])->default('DIJADWALKAN')->index();
            $table->text('catatan_sidang')->nullable();
            
            $table->timestampsTz();
            $table->softDeletesTz();
        });

        Schema::create('sertifikasi_komite_anggota', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('komite_id')->constrained('sertifikasi_komite')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('sys_user')->cascadeOnDelete();
            $table->enum('peran', ['KETUA', 'ANGGOTA', 'SEKRETARIS'])->default('ANGGOTA');
            $table->timestampsTz();
        });

        Schema::create('sertifikasi_komite_rekomendasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('komite_id')->constrained('sertifikasi_komite')->cascadeOnDelete();
            $table->enum('rekomendasi', ['TERBIT_SERTIFIKAT', 'AUDIT_ULANG', 'TOLAK'])->index();
            
            $table->text('catatan_rekomendasi')->nullable();
            $table->text('catatan_khusus')->nullable();
            $table->string('file_berita_acara')->nullable()->comment('File PDF Berita Acara Sidang Komite');
            
            $table->foreignUuid('direkomendasikan_oleh')->nullable()->constrained('sys_user')->nullOnDelete();
            $table->timestampTz('direkomendasikan_pada')->nullable();
            
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sertifikasi_komite_rekomendasi');
        Schema::dropIfExists('sertifikasi_komite_anggota');
        Schema::dropIfExists('sertifikasi_komite');
    }
};
