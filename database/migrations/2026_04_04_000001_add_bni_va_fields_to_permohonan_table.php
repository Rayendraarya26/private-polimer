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
        Schema::table('permohonan', function (Blueprint $table) {
            if (!Schema::hasColumn('permohonan', 'va_trx_id')) {
                $table->string('va_trx_id', 50)->nullable()->after('va')->index();
            }
            if (!Schema::hasColumn('permohonan', 'va_expired_at')) {
                $table->timestampTz('va_expired_at')->nullable()->after('va_trx_id');
            }
            if (!Schema::hasColumn('permohonan', 'va_status')) {
                $table->string('va_status', 30)->default('PENDING')->after('va_expired_at')->index();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            if (Schema::hasColumn('permohonan', 'va_status')) {
                $table->dropColumn('va_status');
            }
            if (Schema::hasColumn('permohonan', 'va_expired_at')) {
                $table->dropColumn('va_expired_at');
            }
            if (Schema::hasColumn('permohonan', 'va_trx_id')) {
                $table->dropColumn('va_trx_id');
            }
        });
    }
};
