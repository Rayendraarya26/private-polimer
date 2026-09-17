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
        Schema::create('form_grk_verifikasi_emisi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_grk_verifikasi_id')
                ->constrained('form_grk_verifikasi')
                ->cascadeOnDelete();

            $table->string('kategori_id', 50)->comment('ID Kategori, misal: kat_1, kat_2');
            $table->string('kategori_nama')->comment('Nama Kategori GRK');
            $table->string('subkategori_code', 20)->comment('Kode Subkategori, misal: 1.1, 1.2');
            $table->string('subkategori_nama')->comment('Nama Subkategori GRK');
            $table->boolean('is_checked')->default(false)->comment('Status apakah dipilih oleh pemohon');
            $table->string('sumber', 500)->nullable()->comment('Sumber Emisi / Serapan');
            $table->decimal('jumlah', 18, 4)->nullable()->comment('Jumlah Emisi / Serapan dalam ton CO2e');
            $table->text('justifikasi')->nullable()->comment('Justifikasi teknis');

            $table->timestampsTz();

            $table->index(['form_grk_verifikasi_id', 'subkategori_code'], 'idx_grk_emisi_form_code');
            $table->index('is_checked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_grk_verifikasi_emisi');
    }
};
