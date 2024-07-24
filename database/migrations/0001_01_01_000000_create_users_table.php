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
        Schema::create('sys_user', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('nip')->nullable()->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('is_active', ['yes', 'no'])->default(Option::YES);
            $table->enum('is_banned', ['yes', 'no'])->default(Option::NO);
            $table->enum('2fa_enable', ['yes', 'no'])->default(Option::NO);
            $table->string('2fa_secret')->nullable();
            $table->boolean('force_update_password')->default(false);
            $table->string('picture')->nullable()->default('avatars/default.png');
            $table->rememberToken();
            $table->timestampTz('last_login')->nullable();
            $table->timestampTz('password_updated_at')->nullable()->useCurrent();
            $table->timestampTz('active_at')->nullable();
            $table->timestampTz('banned_at')->nullable();
            $table->timestampsTz();
        });

        Schema::create('sys_password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestampTz('created_at')->nullable();
        });

        Schema::create('sys_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_user');
        Schema::dropIfExists('sys_password_reset_tokens');
        Schema::dropIfExists('sys_sessions');
    }
};
