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
        Schema::create('pertanyaan_pelanggan_pesan', function (Blueprint $table) {
            $table->uuid('id')->primary();
			$table->foreignUuid('created_by')->references('id')->on('sys_user')->cascadeOnUpdate()->cascadeOnDelete();
			$table->foreignUuid('pertanyaan_id')->references('id')->on('pertanyaan_pelanggan')->cascadeOnUpdate()->cascadeOnDelete();
			$table->text('pesan');
			$table->enum('is_replied', ['yes', 'no'])->default('no');
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pertanyaan_pelanggan_pesan');
    }
};
