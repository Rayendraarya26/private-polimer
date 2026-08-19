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
        if (!Schema::hasTable('form_lsp')) {
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
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_lsp');
    }
};
