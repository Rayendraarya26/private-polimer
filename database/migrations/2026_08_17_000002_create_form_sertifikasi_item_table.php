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
        Schema::create('form_sertifikasi_item', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_sertifikasi_id')->constrained('form_sertifikasi')->cascadeOnDelete();
            $table->unsignedBigInteger('komoditi_id')->nullable()->index();
            $table->string('nama_produk');
            $table->string('merk_dagang')->nullable();
            $table->string('tipe_jenis')->nullable();
            $table->string('standar_sni_iso')->nullable();
            $table->string('ruang_lingkup')->nullable();
            $table->decimal('estimasi_tarif', 15, 2)->default(0);
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_sertifikasi_item');
    }
};
