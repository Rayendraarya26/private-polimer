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
        Schema::create('form_sertifikasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            $table->string('jenis_pengajuan', 50)->default('baru');
            $table->string('sertifikat_lama_id', 100)->nullable();
            $table->string('sertifikat_lama_nomor', 255)->nullable();
            
            $table->json('komoditas_json')->nullable();

            $table->integer('jumlah_karyawan_total')->default(0);
            $table->integer('jumlah_manajemen')->default(0);
            $table->integer('jumlah_administrasi')->default(0);
            $table->integer('jumlah_operasional')->default(0);
            $table->integer('jumlah_part_time')->default(0);
            $table->integer('jumlah_shift_1')->default(0);
            $table->integer('jumlah_shift_2')->default(0);
            $table->integer('jumlah_shift_3')->default(0);
            $table->integer('jumlah_non_permanen')->default(0);

            $table->decimal('luas_tanah', 10, 2)->default(0);
            $table->decimal('luas_bangunan', 10, 2)->default(0);
            $table->json('pabrik_json')->nullable();
            
            $table->string('file_pertanyaan_tambahan', 500)->nullable();
            $table->string('file_manual_mutu', 500)->nullable();
            $table->string('file_proses_produksi', 500)->nullable();
            $table->string('file_denah_lokasi', 500)->nullable();
            $table->string('file_daftar_peralatan', 500)->nullable();
            $table->string('file_surat_permohonan', 500)->nullable();
            $table->json('file_dokumen_pendukung')->nullable();
            
            $table->boolean('setuju_pernyataan')->default(false);

            $table->timestamps();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_sertifikasi');
    }
};
