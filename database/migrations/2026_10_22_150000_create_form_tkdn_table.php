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
        if (!Schema::hasTable('form_tkdn')) {
            Schema::create('form_tkdn', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

                // Identitas Perusahaan & Alamat
                $table->string('nama_perusahaan', 255);
                $table->text('alamat')->nullable();

                // Wilayah
                $table->string('provinsi_id', 50)->nullable();
                $table->string('provinsi_nama', 255)->nullable();
                $table->string('kabupaten_id', 50)->nullable();
                $table->string('kabupaten_nama', 255)->nullable();

                // Rincian Pekerjaan & Finansial
                $table->text('uraian_pekerjaan');
                $table->decimal('biaya', 15, 2)->default(0);
                $table->date('tanggal_bayar');

                // Metadata pencatat (Bendahara)
                $table->uuid('dicatat_oleh')->nullable();

                $table->timestampsTz();
                $table->softDeletesTz();

                $table->index('permohonan_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_tkdn');
    }
};

