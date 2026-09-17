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
        Schema::create('master_kalibrasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('kalibrasi', 255)->comment('Nama alat / item kalibrasi');
            $table->decimal('tarif_satuan', 15, 2)->default(0)->comment('Tarif Satuan (Rp)');
            $table->decimal('tarif_internal', 15, 2)->default(0)->comment('Biaya / Tarif Internal (Rp)');
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_kalibrasi');
    }
};
