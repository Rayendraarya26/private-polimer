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
        Schema::create('sippt_ref_kabupaten', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 20)->unique();
            $table->string('kode_provinsi', 20)->index();
            $table->string('nama', 255);
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sippt_ref_kabupaten');
    }
};
