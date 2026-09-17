<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_grk_verifikasi_dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_grk_verifikasi_id')
                ->constrained('form_grk_verifikasi')
                ->cascadeOnDelete();

            $table->string('kode_dokumen', 100)->comment('Kode dokumen, misal: dokumen-organisasi');
            $table->string('nama_dokumen')->comment('Nama / Judul Dokumen Persyaratan');
            $table->text('keterangan')->nullable()->comment('Nomor dokumen atau keterangan tidak ada');
            $table->string('file_path', 500)->nullable()->comment('Path file upload jika diunggah');
            $table->enum('status_ketersediaan', [
                'TERSEDIA',
                'TIDAK_TERSEDIA',
                'MENUNGGU_UPLOAD',
                'TERVERIFIKASI'
            ])->default('TERSEDIA');
            $table->text('catatan_verifikator')->nullable()->comment('Catatan hasil evaluasi verifikator');
            $table->timestampTz('verified_at')->nullable();

            $table->timestampsTz();

            $table->index(['form_grk_verifikasi_id', 'kode_dokumen'], 'idx_grk_dok_form_kode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_grk_verifikasi_dokumen');
    }
};
