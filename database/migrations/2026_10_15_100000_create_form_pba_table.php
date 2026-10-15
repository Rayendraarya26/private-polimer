<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_pba', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();

            // Identitas Perusahaan & Alamat
            $table->string('nama_perusahaan', 255);
            $table->text('alamat_perusahaan')->comment('Alamat kantor / legal perusahaan');
            $table->text('alamat_pengiriman')->comment('Alamat tujuan pengiriman ekspedisi bahan acuan');

            // Wilayah untuk pengiriman & pemetaan API SIPPT
            $table->string('provinsi_id', 50)->nullable();
            $table->string('provinsi_nama', 255)->nullable();
            $table->string('kabupaten_id', 50)->nullable();
            $table->string('kabupaten_nama', 255)->nullable();

            // Narahubung / Contact Person (PIC)
            $table->string('contact_person', 255);
            $table->string('no_kontak', 50)->comment('No Telp / WhatsApp aktif');
            $table->string('email', 255);

            // Rincian Produk Sesuai Referensi Google Form Acuan
            // Pilihan: Plastisitas, Viskositas Mooney, atau kustom lainnya
            $table->string('produk_pesanan', 100)->comment('Plastisitas, Viskositas Mooney, atau Lainnya');
            $table->string('produk_lainnya', 255)->nullable()->comment('Spesifikasi jika memilih produk lainnya');
            $table->integer('jumlah')->default(1)->comment('Kuantitas jumlah yang dipesan');
            $table->string('satuan', 50)->default('Sampel/Unit');

            // Catatan & Dokumen Pendukung
            $table->text('keterangan')->nullable();
            $table->text('catatan')->nullable();
            $table->string('file_surat_permohonan', 500)->nullable()->comment('Path berkas surat permohonan / PO');

            // Pernyataan & Konfirmasi
            $table->boolean('pernyataan_konfirmasi')->default(true);
            $table->timestampTz('disetujui_pada')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('permohonan_id');
            $table->index('produk_pesanan');
        });

        // Inisialisasi master data layanan Produsen Bahan Acuan (PBA) jika belum ada
        $jenisLayanan = DB::table('master_jenis_layanan')
            ->where('slug', 'produsen-bahan-acuan')
            ->orWhere('slug', 'bahan-acuan')
            ->first();

        if (!$jenisLayanan) {
            $jenisLayananId = (string) Str::uuid();
            DB::table('master_jenis_layanan')->insert([
                'id'            => $jenisLayananId,
                'slug'          => 'produsen-bahan-acuan',
                'jenis_layanan' => 'Produsen Bahan Acuan (PBA)',
                'is_active'     => 1,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            DB::table('master_lingkup_layanan')->insert([
                'id'               => (string) Str::uuid(),
                'jenis_layanan_id' => $jenisLayananId,
                'lingkup'          => 'Standar Material Bahan Acuan (CRM)',
                'slug'             => 'pba-standar-material',
                'kapabilitas'      => 1,
                'is_active'        => 1,
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_pba');
    }
};
