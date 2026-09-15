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
                if (!Schema::hasColumn('form_sertifikasi', 'jenis_pengajuan')) {
                    $table->string('jenis_pengajuan', 50)->default('baru')->after('permohonan_id');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'sertifikat_lama_id')) {
                    $table->string('sertifikat_lama_id', 100)->nullable()->after('jenis_pengajuan');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'sertifikat_lama_nomor')) {
                    $table->string('sertifikat_lama_nomor', 255)->nullable()->after('sertifikat_lama_id');
                }
                if (!Schema::hasColumn('form_sertifikasi', 'komoditas_json')) {
                    $table->json('komoditas_json')->nullable()->after('sertifikat_lama_nomor');
                }

                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_karyawan_total')) {
                    $table->integer('jumlah_karyawan_total')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_manajemen')) {
                    $table->integer('jumlah_manajemen')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_administrasi')) {
                    $table->integer('jumlah_administrasi')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_operasional')) {
                    $table->integer('jumlah_operasional')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_part_time')) {
                    $table->integer('jumlah_part_time')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_shift_1')) {
                    $table->integer('jumlah_shift_1')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_shift_2')) {
                    $table->integer('jumlah_shift_2')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_shift_3')) {
                    $table->integer('jumlah_shift_3')->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'jumlah_non_permanen')) {
                    $table->integer('jumlah_non_permanen')->default(0);
                }

                if (!Schema::hasColumn('form_sertifikasi', 'luas_tanah')) {
                    $table->decimal('luas_tanah', 10, 2)->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'luas_bangunan')) {
                    $table->decimal('luas_bangunan', 10, 2)->default(0);
                }
                if (!Schema::hasColumn('form_sertifikasi', 'pabrik_json')) {
                    $table->json('pabrik_json')->nullable();
                }

                if (!Schema::hasColumn('form_sertifikasi', 'file_pertanyaan_tambahan')) {
                    $table->string('file_pertanyaan_tambahan', 500)->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'file_manual_mutu')) {
                    $table->string('file_manual_mutu', 500)->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'file_proses_produksi')) {
                    $table->string('file_proses_produksi', 500)->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'file_denah_lokasi')) {
                    $table->string('file_denah_lokasi', 500)->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'file_daftar_peralatan')) {
                    $table->string('file_daftar_peralatan', 500)->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'file_surat_permohonan')) {
                    $table->string('file_surat_permohonan', 500)->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'file_dokumen_pendukung_json')) {
                    $table->json('file_dokumen_pendukung_json')->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'file_dokumen_pendukung')) {
                    $table->json('file_dokumen_pendukung')->nullable();
                }
                if (!Schema::hasColumn('form_sertifikasi', 'setuju_pernyataan')) {
                    $table->boolean('setuju_pernyataan')->default(false);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Safe down
    }
};
