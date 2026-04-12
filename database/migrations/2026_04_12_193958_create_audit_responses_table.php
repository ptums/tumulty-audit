<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_responses', function (Blueprint $table) {
            $table->id();

            // Step 1 — Team
            $table->string('team_size');
            $table->string('same_features');
            $table->string('team_embraces_tools');
            $table->string('asks_for_tools');
            $table->string('tech_decision_owner');

            // Step 2 — Pain Points
            $table->unsignedTinyInteger('manual_work_scale');
            $table->string('manual_data_entry_hours');
            $table->string('lost_leads');
            $table->string('paying_no_results');

            // Step 3 — Goals
            $table->string('primary_goal');
            $table->text('success_vision');
            $table->string('holding_back');
            $table->text('tried_before');
            $table->text('automate_one_thing');

            // Step 4 — Contact
            $table->string('first_name');
            $table->string('company_name');
            $table->string('email');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_responses');
    }
};
