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
        Schema::create('form_konsultasi_at', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')
                ->constrained('permohonan')
                ->cascadeOnDelete();

            $table->foreignId('master_konsultasi_at_id')
                ->nullable()
                ->constrained('master_konsultasi_at')
                ->nullOnDelete();

            $table->string('nama_pemohon', 255)->comment('Nama Pemohon');
            $table->string('no_telp', 50)->comment('Nomor Telpon Pemohon');
            $table->string('email_pemohon', 150)->nullable()->comment('Email Pemohon');
            $table->text('alamat_pemohon')->comment('Alamat Pemohon');
            $table->string('layanan_kode', 100)->index()->comment('Snapshot kode layanan');
            $table->string('layanan_nama', 255)->comment('Snapshot nama layanan saat diajukan');
            $table->string('layanan_lainnya', 255)->nullable()->comment('Terisi jika layanan_kode = lainnya');
            $table->text('catatan_dokumen')->nullable();

            $table->string('status_layanan', 30)->default('pengajuan')->index();
            $table->timestamp('sis_synced_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('form_konsultasi_at_dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('form_konsultasi_at_id')
                ->constrained('form_konsultasi_at')
                ->cascadeOnDelete();

            $table->string('nama_file_asli', 255);
            $table->string('file_path', 500);
            $table->string('file_extension', 20);
            $table->string('file_mime_type', 100);
            $table->unsignedBigInteger('file_size')->default(0)->comment('Byte');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_konsultasi_at_dokumen');
        Schema::dropIfExists('form_konsultasi_at');
    }
};
