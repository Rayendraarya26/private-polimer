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
        Schema::create('pertanyaan_pelanggan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pelanggan_id')->constrained('pelanggan')->cascadeOnDelete();
			$table->foreignUuid('closed_by')->nullable()->references('id')->on('sys_user')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('topik');
            $table->string('layanan')->nullable();
            $table->enum('status', ['closed', 'opened'])->default('opened');
            $table->enum('is_review', ['no', 'yes'])->default('no');
            $table->enum('rating', [0, 1, 2, 3, 4, 5])->nullable();
            $table->text('testimoni')->nullable();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pertanyaan_pelanggan');
		Schema::table('pertanyaan_pelanggan', function (Blueprint $table) {
            $table->char('closed_by', 36)->nullable()->change();
        });
    }
};
