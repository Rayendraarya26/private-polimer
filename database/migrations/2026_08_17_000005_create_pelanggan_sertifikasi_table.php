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
        Schema::create('pelanggan_sertifikasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pelanggan_id')->nullable()->constrained('pelanggan')->cascadeOnDelete();
            $table->foreignUuid('pelanggan_pabrik_id')->nullable()->constrained('pelanggan_pabrik')->nullOnDelete();
            $table->foreignUuid('permohonan_id')->nullable()->constrained('permohonan')->nullOnDelete();
            $table->unsignedBigInteger('sis_sertifikat_id')->nullable()->unique()->comment('Unique key penanda integrasi/idempotensi SIS');
            
            $table->string('nomor_sertifikat', 150)->index();
            $table->string('nama_produk')->nullable();
            $table->string('standar_sni_iso')->nullable();
            $table->date('tanggal_terbit')->nullable();
            $table->date('tanggal_kadaluarsa')->nullable();
            $table->enum('status', ['on_going', 'expired', 'suspended', 'revoked'])->default('on_going')->index();
            $table->text('url_pdf_sertifikat_lama')->nullable()->comment('Path / URL ke file fisik PDF sertifikat lama atau TTE baru');
            $table->text('url_pdf_sertifikat_tte')->nullable()->comment('URL file sertifikat TTE BSrE');
            $table->json('metadata')->nullable()->comment('Metadata tambahan ruang lingkup atau surveilans');
            
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggan_sertifikasi');
    }
};
