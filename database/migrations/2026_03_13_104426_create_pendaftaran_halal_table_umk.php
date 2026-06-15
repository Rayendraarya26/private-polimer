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
        Schema::create('pendaftaran_halal_table_umk', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Relasi User
            $table->foreignUuid('user_id')
                ->references('id')
                ->on('sys_user')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Data Peserta
            $table->string('nama_lengkap');
            $table->string('gender');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('pendidikan');
            $table->string('whatsapp');
            $table->string('email');
            $table->string('nik_peserta');
            $table->string('agama');
            $table->text('alamat_peserta');

            // Data Instansi / Usaha
            $table->string('nama_instansi');
            $table->text('alamat_instansi');
            $table->string('jenis_produk');

            // Informasi Pelatihan
            $table->text('hal_dipelajari');

            // Sumber Informasi
            $table->string('info_sumber');
            $table->string('info_sumber_lainnya')->nullable();

            // Persetujuan
            $table->boolean('setuju_syarat')->default(false);

            // Upload File
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
        Schema::dropIfExists('pendaftaran_halal_table_umk');
    }
};