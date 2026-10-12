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
            if (Schema::hasColumn('form_kalibrasi', 'master_klasifikasi_kalibasi_id')) {
                $table->dropColumn('master_klasifikasi_kalibasi_id');
            }
            if (!Schema::hasColumn('form_kalibrasi', 'jenis_klasifikasi')) {
                $table->uuid('jenis_klasifikasi')
                    ->nullable()
                    ->after('ruang_lingkup_akreditasi')
                    ->comment('ID Master Klasifikasi Kalibrasi SIPPT');
            }
        });

        // Update jenis_klasifikasi pada permohonan kalibrasi yang sudah ada
        $defaultKlasifikasi = \Illuminate\Support\Facades\DB::table('master_klasifikasi_kalibasi')
            ->where('klasifikasi', 'MASSA DAN BESARAN TERKAIT')
            ->first() ?: \Illuminate\Support\Facades\DB::table('master_klasifikasi_kalibasi')->first();

        if ($defaultKlasifikasi) {
            \Illuminate\Support\Facades\DB::table('form_kalibrasi')
                ->whereNull('jenis_klasifikasi')
                ->update(['jenis_klasifikasi' => $defaultKlasifikasi->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_kalibrasi', function (Blueprint $table) {
            if (Schema::hasColumn('form_kalibrasi', 'jenis_klasifikasi')) {
                $table->dropColumn('jenis_klasifikasi');
            }
        });
    }
};
