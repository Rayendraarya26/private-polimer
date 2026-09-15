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
        if (Schema::hasTable('form_sertifikasi')) {
            Schema::table('form_sertifikasi', function (Blueprint $table) {
                if (!Schema::hasColumn('form_sertifikasi', 'tipe_pengajuan')) {
                    $table->string('tipe_pengajuan', 50)->nullable()->after('jenis_pengajuan');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'referensi_sertifikasi_id')) {
                    $table->string('referensi_sertifikasi_id', 100)->nullable()->after('sertifikat_lama_nomor');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'nama_perusahaan')) {
                    $table->string('nama_perusahaan', 255)->nullable()->after('referensi_sertifikasi_id');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'nomor_akta_pendirian')) {
                    $table->string('nomor_akta_pendirian', 255)->nullable()->after('nama_perusahaan');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'nama_pemilik')) {
                    $table->string('nama_pemilik', 255)->nullable()->after('nomor_akta_pendirian');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'nama_pimpinan')) {
                    $table->string('nama_pimpinan', 255)->nullable()->after('nama_pemilik');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'nama_wakil_manajemen')) {
                    $table->string('nama_wakil_manajemen', 255)->nullable()->after('nama_pimpinan');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'alamat_kantor')) {
                    $table->text('alamat_kantor')->nullable()->after('nama_wakil_manajemen');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'kontak_person')) {
                    $table->string('kontak_person', 255)->nullable()->after('alamat_kantor');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'no_telp')) {
                    $table->string('no_telp', 50)->nullable()->after('kontak_person');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'no_whatsapp')) {
                    $table->string('no_whatsapp', 50)->nullable()->after('no_telp');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'email')) {
                    $table->string('email', 255)->nullable()->after('no_whatsapp');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'kuesioner_kelayakan')) {
                    $table->json('kuesioner_kelayakan')->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'dokumen_persyaratan')) {
                    $table->json('dokumen_persyaratan')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('form_sertifikasi')) {
            Schema::table('form_sertifikasi', function (Blueprint $table) {
                $columns = [
                    'tipe_pengajuan',
                    'referensi_sertifikasi_id',
                    'nama_perusahaan',
                    'nomor_akta_pendirian',
                    'nama_pemilik',
                    'nama_pimpinan',
                    'nama_wakil_manajemen',
                    'alamat_kantor',
                    'kontak_person',
                    'no_telp',
                    'no_whatsapp',
                    'email',
                    'kuesioner_kelayakan',
                    'dokumen_persyaratan',
                ];
                foreach ($columns as $column) {
                    if (Schema::hasColumn('form_sertifikasi', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }
    }
};
