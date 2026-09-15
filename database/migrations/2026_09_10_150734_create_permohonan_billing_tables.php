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
        // 1. Tabel Master Header Billing
        if (!Schema::hasTable('permohonan_billing')) {
            Schema::create('permohonan_billing', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('no_billing', 100)->unique()->comment('Nomor tagihan resmi (contoh: BIL-20260910-001)');
                $table->uuid('permohonan_id')->nullable()->index()->comment('Relasi ke tabel permohonan');
                $table->uuid('pelanggan_id')->nullable()->index()->comment('Relasi ke profil pelanggan/perusahaan');
                
                // Atribut Tanggal
                $table->date('billing_date')->comment('Tanggal penerbitan billing');
                $table->date('due_date')->comment('Tanggal jatuh tempo pembayaran');
                
                // Nominal & Aturan Pembayaran
                $table->decimal('total_nominal', 16, 2)->default(0)->comment('Total grand tagihan biaya');
                $table->enum('harus_lunas', ['ya', 'tidak'])->default('tidak')->comment('Apakah wajib lunas sebelum bisa dijadwalkan audit');
                
                // Dokumen Berkas
                $table->string('file_invoice')->nullable()->comment('Path berkas surat penawaran/invoice PDF');
                $table->text('catatan')->nullable()->comment('Catatan tambahan untuk pelanggan');
                
                // Status Pembayaran & Verifikasi
                $table->enum('status_pembayaran', ['MENUNGGU_PEMBAYARAN', 'VERIFIKASI', 'LUNAS', 'BATAL'])->default('MENUNGGU_PEMBAYARAN');
                $table->timestamp('tgl_lunas')->nullable();
                $table->string('file_bukti_bayar')->nullable();
                $table->string('metode_pembayaran')->nullable();
                
                // Bridging SIS Sync Reference
                $table->unsignedBigInteger('sis_bill_id')->nullable()->index()->comment('ID bill_id pada tabel sis_billing di SIS');
                $table->string('sis_sync_status', 50)->default('PENDING')->comment('PENDING, SYNCED, FAILED');
                $table->timestamp('sis_synced_at')->nullable();
                
                $table->string('created_by')->nullable();
                $table->timestamps();
            });
        }

        // 2. Tabel Rincian Komponen / Item Billing
        if (!Schema::hasTable('permohonan_billing_item')) {
            Schema::create('permohonan_billing_item', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('billing_id')->index();
                
                // Tipe Item & Referensi Teknis
                $table->string('tipe_item', 50)->default('Permohonan')->comment('Permohonan, Surveilans, Lain-lain');
                $table->uuid('mohon_id')->nullable()->index()->comment('ID permohonan di Polimer');
                $table->string('sertifikat_id', 100)->nullable()->comment('Nomor / ID sertifikat jika surveilans');
                
                // Rincian Komponen Biaya
                $table->string('nama_komponen')->comment('Contoh: Audit Tahap 1, Mandays Auditor, Uji Lab');
                $table->string('satuan', 50)->default('Mandays')->comment('Mandays, Paket, Sampel, Hari');
                $table->decimal('qty', 10, 2)->default(1);
                $table->decimal('harga_satuan', 16, 2)->default(0);
                $table->decimal('subtotal', 16, 2)->default(0);
                $table->text('keterangan')->nullable();

                // Referensi Item SIS
                $table->unsignedBigInteger('sis_itms_bil_id')->nullable()->comment('ID itms_bil_id di tabel sis_billing_items');

                $table->timestamps();

                $table->foreign('billing_id')
                    ->references('id')
                    ->on('permohonan_billing')
                    ->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonan_billing_item');
        Schema::dropIfExists('permohonan_billing');
    }
};