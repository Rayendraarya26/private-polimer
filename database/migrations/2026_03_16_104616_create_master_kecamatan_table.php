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
        Schema::create('master_kecamatan', function (Blueprint $table) {
            $table->increments('kec_id'); 
            $table->unsignedSmallInteger('kab_id'); 
            $table->string('kec_nama')->index();
            $table->timestamps();

            $table->foreign('kab_id')->references('kab_id')->on('master_kabupaten')
                ->onUpdate('cascade')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_kecamatan');
    }
};
