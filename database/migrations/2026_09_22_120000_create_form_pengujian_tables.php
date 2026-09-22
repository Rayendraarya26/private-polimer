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
        // 1. Tabel Header Form Permohonan Pengujian Laboratorium
        Schema::create('form_pengujian', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // Data Administratif Laporan & Pemohon
            $table->enum('bahasa_laporan', ['id', 'en'])->default('id');
            $table->string('diajukan_oleh')->nullable();
            $table->boolean('biaya_sama_dengan_pemohon')->default(true);
            $table->string('biaya_ditanggung_oleh');
            $table->boolean('alamat_sama_dengan_pemohon')->default(true);
            $table->string('laporan_dialamatkan_kepada');
            $table->text('keterangan_permintaan')->nullable();

            // Pembayaran & Tarif
            $table->enum('cara_pembayaran', ['tunai', 'transfer', 'dibayar_di_belakang'])->default('transfer');
            $table->enum('kategori_tarif', ['umum', 'mahasiswa_pp54'])->default('umum');
            $table->string('jenis_uji')->nullable();

            // Opsi Tambahan Uji
            $table->boolean('permintaan_evaluasi')->default(false);
            $table->text('catatan_evaluasi')->nullable();
            $table->boolean('menyaksikan_uji')->default(false);
            $table->text('catatan_menyaksikan')->nullable();

            // Data BAPC & Surat Pengantar
            $table->string('tanggal_bapc')->nullable();
            $table->string('no_bapc')->nullable();
            $table->string('no_sample')->nullable();
            $table->string('merek_kode')->nullable();
            $table->string('no_surat_pengantar')->nullable();
            $table->date('tgl_surat_pengantar')->nullable();

            // Berkas Unggahan
            $table->string('file_surat_pengantar')->nullable();
            $table->string('file_ktm')->nullable();

            // Kalkulasi Biaya
            $table->decimal('total_estimasi_biaya', 15, 2)->default(0);

            $table->timestampsTz();
            $table->softDeletesTz();
        });

        // 2. Tabel Rincian Sampel Pengujian
        Schema::create('form_pengujian_sample', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_pengujian_id')->constrained('form_pengujian')->cascadeOnDelete();
            $table->integer('urutan')->default(1);
            $table->string('nama_sampel');
            $table->string('bentuk_sampel')->nullable();
            $table->integer('jumlah_sampel')->default(1);
            $table->string('satuan_sampel', 50)->default('Pcs');
            $table->string('no_lot_bets')->nullable();
            $table->string('kondisi_sampel', 100)->default('Baik');
            $table->integer('master_komoditi_id')->nullable();
            $table->decimal('subtotal', 15, 2)->default(0);

            $table->timestampsTz();
            $table->softDeletesTz();
        });

        // 3. Tabel Parameter Uji Terpilih per Sampel
        Schema::create('form_pengujian_sample_parameter', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_pengujian_sample_id')->constrained('form_pengujian_sample')->cascadeOnDelete();
            $table->integer('master_parameter_id')->nullable();
            $table->string('kode_parameter', 100)->nullable();
            $table->string('nama_parameter');
            $table->string('metode_uji')->nullable();
            $table->string('satuan', 100)->nullable();
            $table->decimal('tarif', 15, 2)->default(0);

            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_pengujian_sample_parameter');
        Schema::dropIfExists('form_pengujian_sample');
        Schema::dropIfExists('form_pengujian');
    }
};
