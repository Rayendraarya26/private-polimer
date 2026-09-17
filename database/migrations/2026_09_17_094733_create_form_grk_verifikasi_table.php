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
        Schema::create('form_grk_verifikasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            $table->string('merek_sample')->comment('Verifikasi GRK / Merek');
            $table->string('acuan_peraturan')->comment('Acuan Regulasi / Standard');
            $table->text('ruang_lingkup_diajukan')->comment('Ruang Lingkup yang Diajukan');
            $table->text('uraian_kebutuhan')->comment('Uraian Kebutuhan Sertifikasi/Verifikasi');

            $table->string('nama_pemilik');
            $table->string('nama_pimpinan');
            $table->string('nama_pj')->comment('Nama Penanggung Jawab Program');
            $table->integer('jumlah_fasilitas')->default(1);
            $table->enum('kriteria_verifikasi', ['14064-1', 'lainnya'])->default('14064-1');
            $table->string('kriteria_lainnya')->nullable();
            $table->date('periode_mulai')->nullable();
            $table->date('periode_selesai')->nullable();
            $table->integer('jumlah_karyawan')->nullable();
            $table->text('deskripsi_aktivitas');

            $table->enum('organization_boundary', ['internal', 'external'])->default('internal')
                ->comment('internal = Operasional, external = Saham');
            $table->json('reporting_boundary')->comment('Kategori 1 s/d 6 yang dipilih');
            $table->json('jenis_inventarisasi')->comment('Emisi GRK / Serapan GRK');
            $table->json('jenis_gas_emisi')->comment('CO2, CH4, N2O, HFCs, PFCs, SF6');
            $table->enum('metodologi_pengumpulan', [
                'Sistem Manual',
                'Sistem Terkomputerisasi',
                'Kombinasi'
            ])->default('Sistem Manual');
            $table->string('tingkat_transfer_data');
            $table->enum('materialitas_tipe', ['default', 'program'])->default('default')
                ->comment('default = <= 5%, program = custom persentase');
            $table->string('materialitas_custom', 50)->nullable();
            $table->enum('tingkat_jaminan', ['reasonable', 'limited'])->default('reasonable')
                ->comment('reasonable = wajar, limited = terbatas');
            $table->decimal('total_emisi_ton_co2e', 18, 4)->default(0.0000);
            $table->decimal('total_serapan_ton_co2e', 18, 4)->default(0.0000);

            $table->boolean('use_konsultan')->default(false);
            $table->string('konsultan_nama')->nullable();
            $table->string('konsultan_institusi')->nullable();
            $table->boolean('is_share_external')->default(false);
            $table->string('pihak_eksternal')->nullable();

            $table->boolean('pernyataan_perubahan')->default(false);
            $table->boolean('pernyataan_pemohon')->default(false);
            $table->timestampTz('pernyataan_at')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('permohonan_id');
            $table->index('organization_boundary');
            $table->index('tingkat_jaminan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_grk_verifikasi');
    }
};
