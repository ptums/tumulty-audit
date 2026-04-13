<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_responses', function (Blueprint $table) {
            $table->text('notes')->nullable()->after('email');
            $table->string('integration_status')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('audit_responses', function (Blueprint $table) {
            $table->dropColumn(['notes', 'integration_status']);
        });
    }
};
