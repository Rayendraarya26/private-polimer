<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('form_miniplant', function (Blueprint $table) {
            $table->string('jasa_diminta', 20)->nullable()->comment('Jenis jasa: proses / mesin')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_miniplant', function (Blueprint $table) {
            $table->string('jasa_diminta', 20)->nullable(false)->comment('Jenis jasa: proses / mesin')->change();
        });
    }
};

