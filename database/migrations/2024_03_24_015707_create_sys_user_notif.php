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
        Schema::create('sys_user_notif', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->references('id')->on('sys_user')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->string('content')->nullable();
            $table->string('link')->nullable()->default(null);
            $table->enum('is_read', ['yes', 'no'])->nullable()->default(Option::NO);
            $table->timestampTz('created_at')->nullable()->useCurrent();
            $table->timestampTz('updated_at')->nullable();

            $table->index(["user_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_user_notif');
    }
};
