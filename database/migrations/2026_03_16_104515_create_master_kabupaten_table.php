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
        Schema::create('master_kabupaten', function (Blueprint $table) {
            $table->smallIncrements('kab_id'); 
            $table->unsignedSmallInteger('prov_id'); 
            $table->string('kab_nama')->index();
            $table->timestamps();

            $table->foreign('prov_id')->references('prov_id')->on('master_provinsi')
                ->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_kabupaten');
    }
};
