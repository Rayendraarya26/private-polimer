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
        Schema::create('pendaftaran_transformasi_table_industri', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')->references('id')->on('sys_user')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('nama_lengkap');
            $table->string('gender'); 
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('pendidikan');
            $table->string('whatsapp');
            $table->string('email'); 
            
            // Data Perusahaan
            $table->string('nama_instansi');
            $table->text('alamat_instansi');
            $table->string('jenis_produk');
            $table->string('jabatan');
            $table->string('pengalaman_kerja');
            
            // Informasi Pelatihan
            $table->text('masalah_materi');
            $table->text('hal_dipelajari');
            $table->string('punya_pilot');
            $table->string('judul_pilot')->nullable();
            $table->string('status_projek');
            $table->string('status_projek_lainnya')->nullable();

            
            // Program & Persetujuan
            $table->string('program'); 
            $table->boolean('setuju_syarat')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_transformasi_table_industri');
    }
};
