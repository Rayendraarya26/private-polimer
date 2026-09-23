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
        Schema::create('form_inspeksi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // 1. Data Surat Permohonan & Tujuan
            $table->string('no_surat_pemohon', 100)->nullable()->comment('Nomor surat permohonan dari pemohon');
            $table->date('tgl_surat_pemohon')->nullable()->comment('Tanggal surat permohonan pemohon');
            $table->text('tujuan_inspeksi')->comment('Tujuan pelaksanaan inspeksi, e.g. mampu produksi kemasan Bulog');

            // 2. Jenis & Objek Inspeksi Karung
            $table->json('jenis_inspeksi')->comment('["kuantitas", "kualitas"]');
            $table->string('komoditas', 255)->default('Karung Plastik Beras Bantuan Pangan');
            $table->string('kapasitas_karung', 50)->default('10 kg');
            $table->text('spesifikasi_dimensi')->nullable()->comment('Dimensi, mesh/anyaman, gramatur, jahitan, printing');
            $table->integer('jumlah_partai_lot')->default(1)->comment('Jumlah lot / partai karung yang diinspeksi');

            // 3. Pelaksanaan Inspeksi & Bahasa Laporan
            $table->date('tgl_rencana_inspeksi')->comment('Rencana tanggal inspeksi lapangan/on-site');
            $table->text('lokasi_inspeksi')->comment('Alamat gudang / pabrik tempat inspeksi dilakukan');
            $table->enum('bahasa_laporan', ['indonesia', 'inggris'])->default('indonesia');

            // 4. Instansi Penerima Hasil Inspeksi (e.g. Perum BULOG)
            $table->string('penerima_hasil_nama', 255)->default('Perum BULOG');
            $table->text('penerima_hasil_alamat')->nullable();
            $table->string('penerima_hasil_email', 255)->nullable();

            // 5. Penanggung Biaya Inspeksi
            $table->string('biaya_nama', 255);
            $table->text('biaya_alamat')->nullable();
            $table->string('biaya_email', 255)->nullable();

            // 6. Identitas Pemohon / PIC Lapangan
            $table->string('pemohon_pic_nama', 255);
            $table->string('pemohon_pic_kontak', 50);
            $table->text('pemohon_pic_alamat')->nullable();
            $table->string('file_surat_permohonan', 500)->nullable()->comment('Path file upload scan surat permohonan');

            // 7. Pernyataan & Integritas
            $table->boolean('setuju_pernyataan')->default(false);
            $table->timestampTz('pernyataan_at')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_inspeksi');
    }
};
