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
        Schema::create('pelanggan_pabrik', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pelanggan_id')->constrained('pelanggan')->cascadeOnDelete();
            $table->unsignedBigInteger('sis_perusahaan_id')->nullable()->index()->comment('ID Perusahaan/Pabrik legacy di database SIS');
            $table->string('nama_pabrik');
            $table->text('alamat_pabrik')->nullable();
            $table->string('provinsi_id')->nullable();
            $table->string('kabupaten_id')->nullable();
            $table->string('kecamatan_id')->nullable();
            $table->string('kontak_pabrik')->nullable();
            $table->string('email_pabrik')->nullable();
            $table->string('npwp_pabrik')->nullable();
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
        Schema::dropIfExists('pelanggan_pabrik');
    }
};
