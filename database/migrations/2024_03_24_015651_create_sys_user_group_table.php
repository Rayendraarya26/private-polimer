<?php

use App\Enums\Option;
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
        Schema::create('sys_user_group', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->references('id')->on('sys_user')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid('group_id')->references('id')->on('sys_group')->cascadeOnUpdate()->cascadeOnDelete();
            $table->enum('is_default', ['yes', 'no'])->default(Option::NO);
            $table->timestampTz('created_at')->nullable()->useCurrent();
            $table->timestampTz('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_user_group');
    }
};
