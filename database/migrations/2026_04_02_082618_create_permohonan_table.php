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
        Schema::create('permohonan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_pt_ins')->nullable()->index();
            $table->string('no_permohonan', 50)->unique();
            $table->boolean('is_split_bill')->default(false);
            $table->string('status_workflow', 50)->default('DRAFT')->index();
            $table->enum('status_bayar', ['BELUM', 'LUNAS', 'BATAL'])->default('BELUM')->index();
            $table->text('catatan_admin')->nullable();
            $table->dateTimeTz('tgl_order')->nullable();
            $table->json('file_attachment')->nullable()->comment('Untuk file sertifikat');
            $table->boolean('is_given_feedback')->default(false);
            $table->json('feedback_json')->nullable();
            $table->timestampTz('feedback_at')->nullable();
            $table->foreignUuid('created_by')->constrained('sys_user');
            $table->foreignUuid('updated_by')->nullable()->constrained('sys_user');
            $table->string('ip_address', 45)->nullable();
            $table->text('pdf_tte')->nullable();
            $table->string('va', 50)->nullable();
            $table->string('invoice_number')->nullable();
            $table->text('invoice_file')->nullable();
            $table->timestampTz('invoice_generated_at')->nullable();
            $table->string('kuitansi_number')->nullable();
            $table->string('kuitansi_file')->nullable();
            $table->timestampTz('kuitansi_generated_at')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();
        });
        Schema::create('master_jenis_layanan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug');
            $table->string('jenis_layanan')->index();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
        });
        Schema::create('master_lingkup_layanan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('jenis_layanan_id')->constrained('master_jenis_layanan')->cascadeOnDelete();
            $table->string('lingkup')->index();
            $table->string('slug');
            $table->boolean('kapabilitas')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
        });
        Schema::create('detail_pembayaran', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_pt_ins')->nullable()->index();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();
            $table->string('kode_tarif')->nullable()->index();
            $table->string('item_bayar')->nullable();
            $table->decimal('harga_satuan', 15, 2);
            $table->integer('kuantitas')->default(1);
            $table->decimal('subtotal', 15, 2);
            $table->dateTimeTz('tgl_bayar')->nullable();
            $table->string('bukti_bayar')->nullable();
            $table->timestampsTz();
        });
        Schema::create('detail_permohonan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();      
            $table->foreignUuid('lingkup_layanan_id')->constrained('master_lingkup_layanan')->cascadeOnDelete();
            $table->uuid('formable_id')->index();
            $table->string('formable_type')->index();
            $table->timestampsTz();
        });

        Schema::create('form_lsp', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();
            $table->string('nama_lengkap');
            $table->string('gender');
            $table->string('tempat_lahir');
            $table->string('nik_peserta');
            $table->date('tanggal_lahir');
            $table->string('kewarganegaraan');
            $table->string('kode_pos');
            $table->string('pendidikan');
            $table->string('whatsapp');
            $table->string('email');
            $table->string('alamat_peserta');
            $table->string('ktp_peserta');
            $table->string('ijazah')->nullable();
            $table->string('apl_01')->nullable();
            $table->string('apl_02')->nullable();
            $table->string('upload_lainya')->nullable();
            // Data Perusahaan
            $table->string('nama_instansi');
            $table->text('alamat_instansi');
            $table->string('jenis_produk');
            $table->string('jabatan');
            $table->string('pengalaman_kerja');
            $table->boolean('setuju_syarat')->default(false);
            $table->timestamps();
            $table->softDeletesTz();
        });
       
         Schema::create('form_pelatihan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOndelete();
            $table->string('nama_lengkap');
            $table->string('gender');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('pendidikan');
            $table->string('whatsapp');
            $table->string('email');
            $table->string('agama');
            $table->text('alamat_peserta');
            $table->string('nik_peserta');
            $table->string('ktp_peserta');
            $table->string('foto_peserta');
            $table->string('nama_instansi');
            $table->text('alamat_instansi');
            $table->string('jenis_produk');
            $table->text('masalah_materi');
            $table->string('hal_dipelajari');
            $table->boolean('setuju_syarat')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_lsp');
        Schema::dropIfExists('form_pelatihan');
        Schema::dropIfExists('master_lingkup_layanan');
        Schema::dropIfExists('master_jenis_layanan');
        Schema::dropIfExists('detail_pembayaran');
        Schema::dropIfExists('detail_permohonan');
        Schema::dropIfExists('permohonan');
    }
};
