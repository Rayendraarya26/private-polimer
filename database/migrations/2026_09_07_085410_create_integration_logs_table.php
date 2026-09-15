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
        Schema::create('integration_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('permohonan_id')->nullable()->constrained('permohonan')->nullOnDelete();
            $table->enum('arah', ['OUTGOING_TO_SIS', 'INCOMING_FROM_SIS'])->index();
            $table->string('endpoint', 255);
            $table->string('method', 10)->default('POST');
            $table->json('payload_request');
            $table->json('payload_response')->nullable();
            $table->integer('http_status')->nullable()->index();
            $table->enum('status', ['SUCCESS', 'FAILED', 'PENDING_RETRY'])->default('SUCCESS')->index();
            $table->integer('retry_count')->default(0);
            $table->text('error_message')->nullable();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integration_logs');
    }
};
