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
        Schema::table('permohonan', function (Blueprint $table) {
            if (!Schema::hasColumn('permohonan','sis_mohon_id')){
                $table->unsignedBigInteger('sis_mohon_id')->nullable()->index()->after('no_permohonan');
            }
            if (!Schema::hasColumn('permohonan','sis_sync_status')){
                $table->enum('sis_sync_status', ['NOT_SYNCED', 'SYNCED', 'FAILED'])->default('NOT_SYNCED')->index()->after('sis_mohon_id');
            }
            if (!Schema::hasColumn('permohonan','sis_synced_at')){
                $table->timestampTz('sis_synced_at')->nullable()->after('sis_sync_status');
            }
            if (!Schema::hasColumn('permohonan','nomor_sertifikat')){
                $table->string('nomor_sertifikat', 100)->nullable()->after('sis_synced_at');
            }
            if (!Schema::hasColumn('permohonan','tanggal_sertifikat_terbit')){
                $table->date('tanggal_sertifikat_terbit')->nullable()->after('nomor_sertifikat');
            }
            if (!Schema::hasColumn('permohonan','tanggal_sertifikat_kadaluarsa')){
                $table->date('tanggal_sertifikat_kadaluarsa')->nullable()->after('tanggal_sertifikat_terbit');
            }
            if (!Schema::hasColumn('permohonan','file_sertifikat_final')){
                $table->string('file_sertifikat_final', 500)->nullable()->after('tanggal_sertifikat_kadaluarsa');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            $table->dropColumn([
                'sis_mohon_id',
                'sis_sync_status',
                'sis_synced_at',
                'nomor_sertifikat',
                'tanggal_sertifikat_terbit',
                'tanggal_sertifikat_kadaluarsa',
                'file_sertifikat_final'
            ]);
        });
    }
};
