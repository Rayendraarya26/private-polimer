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
            if (!Schema::hasColumn('permohonan', 'tte_invoice_requested')) {
                $table->boolean('tte_invoice_requested')->default(false)->after('invoice_generated_at');
            }
            if (!Schema::hasColumn('permohonan', 'tte_invoice_requested_at')) {
                $table->timestamp('tte_invoice_requested_at')->nullable()->after('tte_invoice_requested');
            }
            if (!Schema::hasColumn('permohonan', 'tte_kuitansi_requested')) {
                $table->boolean('tte_kuitansi_requested')->default(false)->after('kuitansi_generated_at');
            }
            if (!Schema::hasColumn('permohonan', 'tte_kuitansi_requested_at')) {
                $table->timestamp('tte_kuitansi_requested_at')->nullable()->after('tte_kuitansi_requested');
            }
            if (!Schema::hasColumn('permohonan', 'kuitansi_pdf_tte')) {
                $table->string('kuitansi_pdf_tte')->nullable()->after('tte_kuitansi_requested_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonan', function (Blueprint $table) {
            $cols = [
                'tte_invoice_requested',
                'tte_invoice_requested_at',
                'tte_kuitansi_requested',
                'tte_kuitansi_requested_at',
                'kuitansi_pdf_tte',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('permohonan', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
