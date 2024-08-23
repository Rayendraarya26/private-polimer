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
        Schema::create('master_topik_pertanyaan', function (Blueprint $table) {
            $table->uuid('id')->primary();
			// $table->foreignUuid('layanan_id')->nullable()->references('id')->on('master_layanan')->cascadeOnUpdate()->cascadeOnDelete();
            // $table->string('layanan_id');
			$table->foreignUuid('layanan_id')->nullable()->references('id')->on('master_layanan');
            $table->string('name');
            $table->string('desc')->nullable();
            $table->timestampTz('created_at')->nullable()->useCurrent();
            $table->timestampTz('updated_at')->nullable();
        });
		
		
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_topik_pertanyaan');
		Schema::table('master_topik_pertanyaan', function (Blueprint $table) {
            $table->char('layanan_id', 36)->nullable()->change();
        });
    }
};
