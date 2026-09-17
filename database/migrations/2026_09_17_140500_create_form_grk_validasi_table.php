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
        Schema::create('form_grk_validasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // Step 0: Informasi Umum
            $table->string('merek_sample')->comment('Validasi GRK / Merek');
            $table->string('acuan_peraturan')->comment('Acuan Regulasi / Standard');
            $table->text('ruang_lingkup_diajukan')->comment('Ruang Lingkup yang Diajukan');
            $table->text('uraian_kebutuhan')->comment('Uraian Kebutuhan Validasi GRK');

            // Step 1: Informasi Organisasi
            $table->string('nama_pemilik');
            $table->string('nama_pimpinan');
            $table->string('nama_pj')->comment('Nama Penanggung Jawab Program');
            $table->text('deskripsi_aktivitas')->comment('Deskripsi aktivitas perusahaan');

            // Step 2: Ruang Lingkup Proyek Validasi
            $table->text('batasan_proyek')->comment('Batasan Proyek Validasi');
            $table->json('jenis_proyek_grk')->comment('Pengurangan Emisi GRK / Peningkatan Serapan GRK');
            $table->date('periode_mulai')->nullable();
            $table->date('periode_selesai')->nullable();
            $table->string('kriteria_verifikasi', 50)->default('14064-2')->comment('14064-2, 14064-1, lainnya');
            $table->string('kriteria_lainnya')->nullable();
            $table->integer('jumlah_karyawan')->nullable();
            $table->text('ssr_kuantifikasi')->comment('Sumber/Source, Penyerap/Sink, dan/atau Penampung/Reservoir (SSR) GRK yang dikuantifikasi');
            $table->json('jenis_gas_emisi')->comment('CO2, CH4, N2O, HFCs, PFCs, SF6');
            $table->decimal('jumlah_emisi_proyek_kgco2e', 18, 4)->default(0.0000)->comment('Jumlah Emisi/Serapan GRK Proyek (kgCO2eq)');
            $table->decimal('jumlah_emisi_baseline_kgco2e', 18, 4)->default(0.0000)->comment('Jumlah Emisi/Serapan GRK Baseline (kgCO2eq)');
            $table->enum('materialitas_tipe', ['default', 'program'])->default('default')
                ->comment('default = <= 5%, program = custom persentase');
            $table->string('materialitas_custom', 50)->nullable();

            // Step 3: Informasi Tambahan
            $table->boolean('use_konsultan')->default(false);
            $table->string('konsultan_nama')->nullable();
            $table->string('konsultan_institusi')->nullable();
            $table->boolean('is_share_external')->default(false);
            $table->string('pihak_eksternal')->nullable();

            // Step 5: Pernyataan
            $table->boolean('pernyataan_perubahan')->default(false);
            $table->boolean('pernyataan_pemohon')->default(false);
            $table->timestampTz('pernyataan_at')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('permohonan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_grk_validasi');
    }
};
