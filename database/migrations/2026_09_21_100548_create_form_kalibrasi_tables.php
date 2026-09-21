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
        // 1. Tabel Header Form Permohonan Kalibrasi
        Schema::create('form_kalibrasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // Data Informasi Pelanggan
            $table->string('nama_pemohon', 255)->comment('Nama kontak/pemohon kalibrasi');
            $table->string('no_telp', 50)->comment('No telepon/WhatsApp pemohon');
            $table->string('hasil_kalibrasi_untuk', 255)->comment('Nama pemilik sertifikat kalibrasi / instansi');
            $table->text('alamat_pemohon')->comment('Alamat lengkap instansi pemohon');

            // Data Pelaksanaan & Pengiriman
            $table->enum('lokasi_pelaksanaan', ['LABKAL BBKKP', 'Tempat Client'])
                ->default('LABKAL BBKKP')
                ->comment('LABKAL BBKKP = In-House, Tempat Client = On-Site');
            $table->text('uraian_kalibrasi')->nullable()->comment('Catatan khusus / titik uji yang dikehendaki');
            $table->enum('bahasa_laporan', ['indonesia', 'inggris'])->default('indonesia');
            $table->string('nama_penerima_kirim', 255)->nullable()->comment('Nama penerima laporan hasil');
            $table->text('alamat_pengiriman')->nullable()->comment('Alamat tujuan pengiriman sertifikat');

            // Kalkulasi & Pernyataan
            $table->integer('total_alat')->default(1);
            $table->decimal('estimasi_total_tarif', 15, 2)->default(0);
            $table->boolean('setuju_pernyataan')->default(false);
            $table->timestampTz('pernyataan_at')->nullable();

            // Kolom Bridging / Integrasi SIS
            $table->string('status_sinkronisasi_sis', 50)->default('PENDING')->index();
            $table->string('no_order_sis', 100)->nullable()->index();
            $table->timestampTz('sis_synced_at')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();
        });

        // 2. Tabel Rincian Alat
        Schema::create('form_kalibrasi_alat', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_kalibrasi_id')->constrained('form_kalibrasi')->cascadeOnDelete();
            $table->integer('urutan')->default(1);
            $table->string('nama_alat', 255);
            $table->string('merk', 150)->nullable();
            $table->string('tipe_model', 150)->nullable();
            $table->integer('jumlah')->default(1);
            $table->string('kondisi', 100)->default('Baik / Normal');
            $table->decimal('subtotal_biaya', 15, 2)->default(0);

            $table->timestampsTz();
            $table->softDeletesTz();
        });

        // 3. Tabel Nomor Seri per Unit Alat
        Schema::create('form_kalibrasi_alat_seri', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_kalibrasi_alat_id')->constrained('form_kalibrasi_alat')->cascadeOnDelete();
            $table->integer('nomor_unit')->default(1);
            $table->string('nomor_seri', 150);

            $table->timestampsTz();
        });

        // 4. Tabel Parameter Kalibrasi per Alat (Relasi ke Master Kalibrasi)
        Schema::create('form_kalibrasi_alat_item', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_kalibrasi_alat_id')->constrained('form_kalibrasi_alat')->cascadeOnDelete();
            $table->foreignUuid('master_kalibrasi_id')->constrained('master_kalibrasi')->restrictOnDelete();

            $table->string('nama_kalibrasi_snapshot', 255);
            $table->decimal('tarif_satuan_snapshot', 15, 2)->default(0);
            $table->integer('jumlah')->default(1);
            $table->decimal('subtotal', 15, 2)->default(0);

            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_kalibrasi_alat_item');
        Schema::dropIfExists('form_kalibrasi_alat_seri');
        Schema::dropIfExists('form_kalibrasi_alat');
        Schema::dropIfExists('form_kalibrasi');
    }
};