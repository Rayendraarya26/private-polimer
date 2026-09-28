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
            if (!Schema::hasColumn('form_kalibrasi', 'jenis_pelanggan')) {
                $table->enum('jenis_pelanggan', ['Internal', 'Eksternal'])
                    ->default('Eksternal')
                    ->after('alamat_pemohon')
                    ->comment('Jenis pelanggan kalibrasi: Internal BBKKP / Eksternal Umum');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_kalibrasi', function (Blueprint $table) {
            if (Schema::hasColumn('form_kalibrasi', 'jenis_pelanggan')) {
                $table->dropColumn('jenis_pelanggan');
            }
        });
    }
};
