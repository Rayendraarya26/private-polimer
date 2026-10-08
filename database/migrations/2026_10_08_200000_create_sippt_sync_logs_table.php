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
        Schema::create('sippt_sync_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->nullable()->constrained('permohonan')->nullOnDelete();
            $table->string('modul', 50)->index();
            $table->string('no_order', 100)->index();
            $table->string('endpoint', 255);
            $table->string('method', 10)->default('POST');
            $table->json('request_payload');
            $table->json('response_payload')->nullable();
            $table->enum('status', ['pending', 'success', 'failed', 'cancelled'])->default('pending')->index();
            $table->integer('http_status_code')->nullable()->index();
            $table->integer('retry_count')->default(0);
            $table->text('last_error')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sippt_sync_logs');
    }
};
