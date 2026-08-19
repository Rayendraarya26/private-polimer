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
        Schema::create('form_sertifikasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->constrained('permohonan')->cascadeOnDelete();
            $table->enum('tipe_pengajuan', ['BARU', 'PERPANJANG', 'PERUBAHAN', 'SURVEILANS'])->default('BARU')->index();
            $table->uuid('referensi_sertifikasi_id')->nullable()->index()->comment('ID sertifikat acuan jika perpanjangan atau surveilans');
            
            // Profil Perusahaan Pemohon
            $table->string('nama_perusahaan');
            $table->text('alamat_kantor');
            $table->string('kontak_person')->nullable();
            $table->string('no_telp')->nullable();
            $table->string('no_whatsapp')->nullable();
            $table->string('email')->nullable();
            
            // Dynamic Assessment & Uploaded Files
            $table->json('kuesioner_kelayakan')->nullable()->comment('Rekaman kuesioner kelayakan sertifikasi');
            $table->json('dokumen_persyaratan')->nullable()->comment('Path dokumen legalitas, manual mutu, alur proses');
            
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_sertifikasi');
    }
};
