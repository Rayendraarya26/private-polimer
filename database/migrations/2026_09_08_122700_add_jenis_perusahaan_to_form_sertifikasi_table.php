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
        if (Schema::hasTable('form_sertifikasi') && !Schema::hasColumn('form_sertifikasi', 'jenis_perusahaan')) {
            Schema::table('form_sertifikasi', function (Blueprint $table) {
                $table->string('jenis_perusahaan', 100)->nullable()->default('Produsen / Pabrikan')->after('jenis_perusahaan_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('form_sertifikasi') && Schema::hasColumn('form_sertifikasi', 'jenis_perusahaan')) {
            Schema::table('form_sertifikasi', function (Blueprint $table) {
                $table->dropColumn('jenis_perusahaan');
            });
        }
    }
};
