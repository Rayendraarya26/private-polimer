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
        Schema::create('data_integrasi_layanan', function (Blueprint $table) {
            $table->uuid('id')->primary();
			$table->foreignUuid('layanan_id')->references('id')->on('master_layanan')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid('user_id')->references('id')->on('sys_user')->cascadeOnUpdate()->cascadeOnDelete();
			$table->string('kode_order');
			$table->string('id_order');
			// $table->string('kode_order')->nullable();
			$table->timestampTz('tanggal_order')->nullable();
			$table->enum('status_order', ['permohonan', 'pembayaran', 'proses' , 'review', 'selesai'])->default('permohonan');
			$table->string('file_attachment')->nullable()->comment('Untuk file sertifikat');; // sertifikat
            $table->boolean('is_given_feedback')->default(false);
            $table->json('feedback_json')->nullable();
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_integrasi_layanan');
    }
};
