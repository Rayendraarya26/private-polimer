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
        if (!Schema::hasTable('bni_va_logs')) {
            Schema::create('bni_va_logs', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('permohonan_id')->nullable()->constrained('permohonan')->nullOnDelete();
                $table->string('trx_id', 100)->index();
                $table->string('virtual_account', 50)->index();
                $table->decimal('amount', 15, 2)->default(0);
                $table->string('payment_status', 50)->default('PAID');
                $table->string('event_type', 50)->default('PAYMENT_CALLBACK');
                $table->json('raw_payload')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->timestampsTz();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bni_va_logs');
    }
};
