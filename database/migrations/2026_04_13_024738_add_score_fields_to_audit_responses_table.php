<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_responses', function (Blueprint $table) {
            $table->unsignedSmallInteger('score')->nullable()->after('integration_status');
            $table->string('grade')->nullable()->after('score');
            $table->string('score_label')->nullable()->after('grade');
            $table->json('score_breakdown')->nullable()->after('score_label');
        });
    }

    public function down(): void
    {
        Schema::table('audit_responses', function (Blueprint $table) {
            $table->dropColumn(['score', 'grade', 'score_label', 'score_breakdown']);
        });
    }
};
