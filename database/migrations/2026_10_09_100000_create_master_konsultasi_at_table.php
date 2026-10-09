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
        Schema::create('master_konsultasi_at', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 100)->unique()->comment('Slug layanan, nilai layanan_kode');
            $table->string('kategori', 50)->default('konsultasi')->comment('konsultasi, audit_teknologi, indi_4_0, lainnya');
            $table->string('nama', 255);
            $table->text('deskripsi')->nullable();
            $table->integer('urutan')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['kategori', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_konsultasi_at');
    }
};
