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
        Schema::table('master_faq', function (Blueprint $table) {
            if (!Schema::hasColumn('master_faq', 'question_en')) {
                $table->string('question_en')->nullable()->after('question');
            }
            if (!Schema::hasColumn('master_faq', 'answer_en')) {
                $table->longText('answer_en')->charset('binary')->nullable()->after('answer');
            }
        });

        Schema::table('master_layanan', function (Blueprint $table) {
            if (!Schema::hasColumn('master_layanan', 'name_en')) {
                $table->string('name_en')->nullable()->after('name');
            }
            if (!Schema::hasColumn('master_layanan', 'description_en')) {
                $table->string('description_en')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_faq', function (Blueprint $table) {
            if (Schema::hasColumn('master_faq', 'question_en')) {
                $table->dropColumn('question_en');
            }
            if (Schema::hasColumn('master_faq', 'answer_en')) {
                $table->dropColumn('answer_en');
            }
        });

        Schema::table('master_layanan', function (Blueprint $table) {
            if (Schema::hasColumn('master_layanan', 'name_en')) {
                $table->dropColumn('name_en');
            }
            if (Schema::hasColumn('master_layanan', 'description_en')) {
                $table->dropColumn('description_en');
            }
        });
    }
};
