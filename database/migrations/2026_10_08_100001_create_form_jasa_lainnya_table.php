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
        Schema::create('form_jasa_lainnya', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // Data Pelanggan
            $table->string('pelanggan_nama', 255);
            $table->string('jenis_pelanggan', 50)->comment('perorangan, perusahaan, instansi_pemerintah, lembaga_organisasi');

            // Lokasi
            $table->string('negara', 100)->default('Indonesia');
            $table->string('provinsi_id', 50)->nullable();
            $table->string('provinsi_nama', 255)->nullable();
            $table->string('kabupaten_id', 50)->nullable();
            $table->string('kabupaten_nama', 255)->nullable();

            // Detail Jasa & Finansial
            $table->text('uraian');
            $table->decimal('total', 15, 2)->default(0);
            $table->date('tgl_bayar');

            // Metadata pencatat (Bendahara)
            $table->uuid('dicatat_oleh')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_jasa_lainnya');
    }
};
