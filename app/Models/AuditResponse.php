<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditResponse extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'team_size',
        'same_features',
        'team_embraces_tools',
        'asks_for_tools',
        'tech_decision_owner',
        'manual_work_scale',
        'manual_data_entry_hours',
        'lost_leads',
        'paying_no_results',
        'primary_goal',
        'success_vision',
        'holding_back',
        'tried_before',
        'automate_one_thing',
        'first_name',
        'company_name',
        'email',
        'notes',
        'integration_status',
    ];

    protected $casts = [
        'manual_work_scale' => 'integer',
    ];
}
