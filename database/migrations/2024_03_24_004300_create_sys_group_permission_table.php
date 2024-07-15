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
        Schema::create('sys_group_permission', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('group_id')->references('id')->on('sys_group')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid('action_id')->references('id')->on('sys_menu_action')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestampTz('created_at')->nullable()->useCurrent();
            $table->timestampTz('updated_at')->nullable();

            $table->index(["action_id"]);
            $table->unique(["group_id", "action_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_group_permission');
    }
};
