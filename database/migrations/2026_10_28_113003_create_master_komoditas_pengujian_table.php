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
        Schema::create('master_komoditas_pengujian', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 50)->nullable()->comment('Kode komoditas (misal: KMD-KRT, KMD-PLS)');
            $table->string('nama', 255)->comment('Nama komoditas pengujian');
            $table->text('ruang_lingkup')->nullable()->comment('Deskripsi ruang lingkup pengujian');
            $table->integer('waktu_jam')->default(0)->comment('Estimasi waktu pengerjaan (jam)');
            $table->integer('spm')->default(0)->comment('Standar Pelayanan Minimal (hari)');
            $table->boolean('is_active')->default(true)->comment('Status keaktifan komoditas');
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_komoditas_pengujian');
    }
};
