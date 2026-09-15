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
        Schema::create('form_sertifikasi_pabrik', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_sertifikasi_id')->constrained('form_sertifikasi')->cascadeOnDelete();
            $table->string('nama_pabrik');
            $table->text('alamat_pabrik');
            $table->string('provinsi_id')->nullable();
            $table->string('kabupaten_id')->nullable();
            $table->string('kecamatan_id')->nullable();
            $table->string('kontak_pabrik')->nullable();
            $table->string('email_pabrik')->nullable();
            $table->integer('jumlah_karyawan')->default(0);
            $table->string('luas_fasilitas')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_sertifikasi_pabrik');
    }
};
