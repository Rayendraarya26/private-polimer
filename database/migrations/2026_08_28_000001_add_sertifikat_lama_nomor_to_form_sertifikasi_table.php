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
        Schema::table('form_sertifikasi', function (Blueprint $table) {
            if (!Schema::hasColumn('form_sertifikasi', 'sertifikat_lama_nomor')) {
                $table->string('sertifikat_lama_nomor')->nullable()->after('referensi_sertifikasi_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_sertifikasi', function (Blueprint $table) {
            if (Schema::hasColumn('form_sertifikasi', 'sertifikat_lama_nomor')) {
                $table->dropColumn('sertifikat_lama_nomor');
            }
        });
    }
};
