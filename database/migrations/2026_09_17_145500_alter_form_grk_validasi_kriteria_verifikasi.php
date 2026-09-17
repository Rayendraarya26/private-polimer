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
        Schema::table('form_grk_validasi', function (Blueprint $table) {
            $table->string('kriteria_verifikasi', 50)->default('14064-2')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_grk_validasi', function (Blueprint $table) {
            $table->enum('kriteria_verifikasi', ['14064-1', 'lainnya'])->default('14064-1')->change();
        });
    }
};
