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
        Schema::create('permohonan_penawaran_biaya', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();
            $table->string('nomor_surat_penawaran', 100)->nullable();
            $table->string('file_surat_penawaran', 500);
            $table->decimal('total_nominal', 15, 2);
            $table->enum('status_persetujuan', ['MENUNGGU', 'DISETUJUI', 'DITOLAK'])->default('MENUNGGU')->index();
            $table->text('alasan_penolakan')->nullable();
            $table->timestampTz('responded_at')->nullable();
            $table->foreignUuid('created_by')->constrained('sys_user')->cascadeOnDelete();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonan_penawaran_biaya');
    }
};
