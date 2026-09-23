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
        Schema::create('form_halal', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')
                ->references('id')
                ->on('permohonan')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Jalur & Jenis Pengajuan
            $table->string('jalur_pendaftaran')->default('reguler'); // 'reguler' | 'self_declare'
            $table->string('jenis_pendaftaran')->default('baru'); // 'baru' | 'pengembangan'
            $table->string('kode_fasilitasi')->nullable(); // Jika melalui jalur fasilitasi

            // Data Pelaku Usaha & Penanggung Jawab
            $table->string('nama_usaha');
            $table->string('skala_usaha')->default('mikro'); // 'mikro', 'kecil', 'menengah', 'besar', 'luar_negeri'
            $table->string('nib');
            $table->string('npwp')->nullable();
            $table->string('pj_nama');
            $table->string('pj_kontak');
            $table->string('pj_email')->nullable();
            $table->text('pj_alamat')->nullable();

            // Fasilitas Produksi (Pabrik & Outlet)
            $table->json('pabrik_json')->nullable(); // Array: [{ nama, alamat, status_pabrik }]
            $table->json('outlet_json')->nullable(); // Array: [{ nama, alamat }]
            $table->string('file_denah_lokasi')->nullable();

            // Penyelia Halal
            $table->string('penyelia_nama');
            $table->string('penyelia_nik');
            $table->string('penyelia_agama')->default('Islam');
            $table->string('penyelia_kontak');
            $table->string('penyelia_no_sk')->nullable();
            $table->date('penyelia_tgl_sk')->nullable();
            $table->string('penyelia_no_sertifikat')->nullable();
            $table->date('penyelia_tgl_sertifikat')->nullable();
            $table->string('file_sk_penyelia')->nullable();
            $table->string('file_ktp_penyelia')->nullable();
            $table->string('file_sertifikat_penyelia')->nullable();

            // Bahan & Kemasan (Array of objects)
            $table->json('bahan_json')->nullable(); // [{ jenis_bahan, nama_bahan, produsen, supplier, lembaga_penerbit, no_sertifikat, tgl_berlaku }]

            // Produk & Alur Proses
            $table->json('produk_json')->nullable(); // [{ klasifikasi, rincian, nama_produk, merk, foto_path }]
            $table->text('alur_proses')->nullable();
            $table->string('file_alur_proses')->nullable();

            // Dokumen Persyaratan & Manual SJPH
            $table->string('file_surat_permohonan')->nullable();
            $table->string('file_manual_sjph')->nullable();

            // Pernyataan & Integritas Halal
            $table->boolean('pernyataan_bebas_babi')->default(true);
            $table->boolean('pernyataan_komitmen_sjph')->default(true);
            $table->timestamp('pernyataan_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_halal');
    }
};
