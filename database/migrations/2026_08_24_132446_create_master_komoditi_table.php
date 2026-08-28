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
        Schema::create('master_komoditi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('lingkup_layanan_id')->nullable()->constrained('master_lingkup_layanan')->nullOnDelete();

            $table->string('nama_komoditi', 255);
            $table->string('nomor_sni', 100)->nullable();
            $table->text('deskripsi')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_komoditi');
    }
};
