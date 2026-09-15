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
        Schema::create('permohonan_tracking_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->nullable()->constrained('permohonan')->nullOnDelete();
            $table->enum('sumber', ['POLIMER', 'SIS'])->default('SIS');
            $table->string('milestone_code', 50)->index();
            $table->string('judul', 255);
            $table->text('deskripsi')->nullable();
            $table->json('metadata')->nullable()->comment('Audior, tanggal jadwal, klausul temuan, dll');
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonan_tracking_logs');
    }
};
