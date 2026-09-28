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
        Schema::table('form_kalibrasi', function (Blueprint $table) {
            if (!Schema::hasColumn('form_kalibrasi', 'ruang_lingkup_akreditasi')) {
                $table->enum('ruang_lingkup_akreditasi', ['Masuk Ruang Lingkup', 'Tidak Masuk Ruang Lingkup'])
                    ->default('Masuk Ruang Lingkup')
                    ->after('lokasi_pelaksanaan')
                    ->comment('Status akreditasi: Masuk Ruang Lingkup / Tidak Masuk Ruang Lingkup');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_kalibrasi', function (Blueprint $table) {
            if (Schema::hasColumn('form_kalibrasi', 'ruang_lingkup_akreditasi')) {
                $table->dropColumn('ruang_lingkup_akreditasi');
            }
        });
    }
};
