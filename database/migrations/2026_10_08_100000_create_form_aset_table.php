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
        Schema::create('form_aset', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // Jenis Sewa (sewa_lapangan, sewa_bangunan, sewa_alat, sewa_mobil, sewa_ruangan)
            $table->string('jenis_sewa', 50)->comment('sewa_lapangan, sewa_bangunan, sewa_alat, sewa_mobil, sewa_ruangan');

            // Detail Sewa
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->integer('durasi_hari')->default(1);
            $table->text('keperluan_penggunaan');
            $table->text('catatan_tambahan')->nullable();

            // Identitas Pemohon (snapshot at submission time)
            $table->string('pemohon_nama', 255);
            $table->string('pemohon_nik_nib', 50)->nullable();
            $table->text('pemohon_alamat')->nullable();
            $table->string('pemohon_telepon', 50)->nullable();
            $table->string('pemohon_email', 255)->nullable();

            // Berkas Pendukung
            $table->string('file_surat_permohonan', 500)->nullable()->comment('Path file upload scan surat permohonan / kuasa');

            // Pernyataan & Integritas
            $table->boolean('setuju_pernyataan')->default(false);
            $table->timestampTz('pernyataan_at')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_aset');
    }
};
