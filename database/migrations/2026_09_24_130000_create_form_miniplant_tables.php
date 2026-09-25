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
        // 1. Tabel Header Form Permohonan Miniplant
        Schema::create('form_miniplant', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')
                ->constrained('permohonan')
                ->cascadeOnDelete();

            // Pilihan Jenis Layanan Miniplant (Langkah 1)
            $table->string('jenis_layanan_kode', 10)->index()->comment('Kode jenis layanan: F, RPK, PA, MKP');
            $table->string('jenis_layanan_nama', 150)->nullable()->comment('Snapshot nama jenis layanan miniplant');

            // Detail Permohonan (Langkah 2)
            $table->string('jasa_diminta', 20)->comment('Jenis jasa: proses / mesin');
            $table->string('jenis_barang', 255)->comment('Nama bahan/sampel/barang');
            $table->integer('jumlah_barang')->default(1)->comment('Jumlah spesimen/barang');
            $table->text('perlakuan_diminta')->nullable()->comment('Uraian proses/perlakuan yang diminta');

            // Parameter Mesin (Opsional jika jasa = mesin)
            $table->string('tekanan_nilai', 50)->nullable();
            $table->string('tekanan_satuan', 20)->nullable();
            $table->string('waktu_nilai', 50)->nullable();
            $table->string('waktu_satuan', 20)->nullable();
            $table->string('temperatur_nilai', 50)->nullable();
            $table->string('temperatur_satuan', 20)->nullable();

            // Informasi Pelanggan (Langkah 4)
            $table->string('nama_pemohon', 255)->comment('Nama PIC/pemohon');
            $table->string('no_telp', 50)->comment('No telepon/WhatsApp pemohon');
            $table->text('alamat_pemohon')->comment('Alamat lengkap pemohon');

            // Ringkasan & Persetujuan (Langkah 5)
            $table->decimal('estimasi_total_biaya', 14, 2)->default(0)->comment('Estimasi total biaya permohonan');
            $table->boolean('setuju_pernyataan')->default(false)->comment('Status persetujuan ketentuan');
            $table->timestampTz('pernyataan_at')->nullable()->comment('Waktu persetujuan ketentuan');

            $table->timestampsTz();
            $table->softDeletesTz();
        });

        // 2. Tabel Rincian Item Perlakuan Miniplant (Langkah 3)
        Schema::create('form_miniplant_item', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_miniplant_id')
                ->constrained('form_miniplant')
                ->cascadeOnDelete();

            $table->foreignId('master_miniplant_id')
                ->nullable()
                ->constrained('master_miniplant')
                ->nullOnDelete();

            $table->string('kode', 10)->comment('Kode fasilitas: F, RPK, PA, MKP');
            $table->string('nama_perlakuan_snapshot', 255)->comment('Snapshot nama perlakuan saat diajukan');
            $table->string('satuan_snapshot', 50)->comment('Snapshot satuan tarif PNBP');
            $table->decimal('tarif_satuan_snapshot', 12, 2)->default(0)->comment('Snapshot tarif PNBP per unit');
            $table->integer('jumlah')->default(1)->comment('Jumlah perlakuan yang dipesan');
            $table->decimal('subtotal', 14, 2)->default(0)->comment('Subtotal biaya = tarif * jumlah');
            $table->text('keterangan')->nullable()->comment('Catatan khusus perlakuan');

            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_miniplant_item');
        Schema::dropIfExists('form_miniplant');
    }
};
