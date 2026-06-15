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
        Schema::create('pendaftaran_halal_table_reg', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->references('id')->on('sys_user')->cascadeOnUpdate()->cascadeOnDelete();
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
            
            // Data Perusahaan
            $table->string('nama_instansi');
            $table->text('alamat_instansi');
            $table->string('jenis_produk');
            $table->string('pengalaman_kerja');
            
            // Informasi Pelatihan
            $table->text('masalah_materi');
            $table->text('hal_dipelajari');
            
            // Sumber Informasi, Program & Persetujuan
            $table->string('info_sumber');
            $table->string('info_sumber_lainnya')->nullable();
            $table->string('program'); 
            $table->boolean('setuju_syarat')->default(false);
            
            // File Uploads (Menyimpan Path String)
            $table->string('file_ktp')->nullable();
            $table->string('file_foto')->nullable();
            $table->string('file_bukti_bayar')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_halal_table_reg');
    }
};
