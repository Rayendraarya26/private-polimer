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
        Schema::create('master_miniplant', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 20)->comment('Kode fasilitas: PA, RPK, F, MKP');
            $table->string('jenis_jasa', 50)->comment('Jenis jasa: proses / mesin');
            $table->string('nama', 255)->comment('Nama perlakuan / jasa miniplant');
            $table->string('satuan', 100)->comment('Satuan perlakuan (misal: per pc, sqft, jam, per kg, dll)');
            $table->decimal('biaya', 15, 2)->default(0)->comment('Biaya perlakuan (Rp)');
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
        Schema::dropIfExists('master_miniplant');
    }
};
