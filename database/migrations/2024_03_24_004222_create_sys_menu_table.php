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
        Schema::create('sys_menu', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('parent_id')->nullable();
            $table->string('name')->nullable();
            $table->string('desc')->nullable();
            $table->enum('is_active', ['yes', 'no'])->default('yes');
            $table->string('icon')->nullable();
            $table->integer('order')->nullable()->default('1');
            $table->timestampTz('created_at')->nullable()->useCurrent();
            $table->timestampTz('updated_at')->nullable();

            $table->unique(["parent_id", "name"]);
        });

        Schema::table('sys_menu', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('sys_menu')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_menu');
    }
};
