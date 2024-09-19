<?php

use App\Enums\DataIntegrasiLayananStatusOrder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
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
            $table->timestampTz('tanggal_order')->nullable();
            $table->enum('status_order', DataIntegrasiLayananStatusOrder::toArray())->default(DataIntegrasiLayananStatusOrder::PERMOHONAN);
            $table->json('file_attachment')->nullable()->comment('Untuk file sertifikat');
            $table->boolean('is_given_feedback')->default(false);
            $table->json('feedback_json')->nullable();
            $table->timestampTz('feedback_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestampTz('last_sync_at')->nullable();
            $table->timestampsTz();
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
