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
        Schema::create('master_parameter_pengujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('komoditas_id')->constrained('master_komoditas_pengujian')->cascadeOnDelete()->comment('Relasi ke master_komoditas_pengujian');
            $table->string('kode', 50)->nullable()->comment('Kode parameter (misal: PAR-KRT-01)');
            $table->string('nama', 255)->comment('Nama parameter uji');
            $table->string('metode_uji', 255)->nullable()->comment('Standar acuan / metode uji (SNI / ASTM / ISO)');
            $table->string('satuan', 100)->nullable()->comment('Satuan hasil uji atau satuan tarif');
            $table->integer('waktu_jam')->default(0)->comment('Waktu pengerjaan uji (jam)');
            $table->decimal('tarif_umum', 15, 2)->default(0)->comment('Tarif Pengujian Umum / PNBP (Rp)');
            $table->decimal('tarif_mahasiswa', 15, 2)->default(0)->comment('Tarif Pengujian Mahasiswa (Rp)');
            $table->text('deskripsi')->nullable()->comment('Penjelasan / ruang lingkup parameter uji');
            $table->boolean('is_active')->default(true)->comment('Status keaktifan parameter');
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_parameter_pengujian');
    }
};
