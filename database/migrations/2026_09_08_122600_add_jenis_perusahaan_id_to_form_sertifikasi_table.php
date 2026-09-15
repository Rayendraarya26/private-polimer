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
        if (Schema::hasTable('form_sertifikasi') && !Schema::hasColumn('form_sertifikasi', 'jenis_perusahaan_id')) {
            Schema::table('form_sertifikasi', function (Blueprint $table) {
                $table->unsignedSmallInteger('jenis_perusahaan_id')->nullable()->default(1)->after('nama_perusahaan');
            });
        }

        if (Schema::hasTable('pelanggan_perusahaan') && !Schema::hasColumn('pelanggan_perusahaan', 'jenis_perusahaan_id')) {
            Schema::table('pelanggan_perusahaan', function (Blueprint $table) {
                $table->unsignedSmallInteger('jenis_perusahaan_id')->nullable()->default(1)->after('badan_hukum');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('form_sertifikasi') && Schema::hasColumn('form_sertifikasi', 'jenis_perusahaan_id')) {
            Schema::table('form_sertifikasi', function (Blueprint $table) {
                $table->dropColumn('jenis_perusahaan_id');
            });
        }

        if (Schema::hasTable('pelanggan_perusahaan') && Schema::hasColumn('pelanggan_perusahaan', 'jenis_perusahaan_id')) {
            Schema::table('pelanggan_perusahaan', function (Blueprint $table) {
                $table->dropColumn('jenis_perusahaan_id');
            });
        }
    }
};
