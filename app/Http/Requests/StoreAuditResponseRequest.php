<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAuditResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Step 1 — Team
            'team_size'            => ['required', Rule::in(['1-10', '11-50', '51-200', '200+'])],
            'same_features'        => ['required', Rule::in(['yes_always', 'sometimes', 'rarely', 'we_dont_know'])],
            'team_embraces_tools'  => ['required', Rule::in(['embrace_quickly', 'need_time', 'usually_resistant'])],
            'asks_for_tools'       => ['required', Rule::in(['constantly', 'occasionally', 'rarely', 'never'])],
            'tech_decision_owner'  => ['required', Rule::in(['founder_ceo', 'operations_lead', 'it_department', 'nobody'])],

            // Step 2 — Pain Points
            'manual_work_scale'       => ['required', 'integer', 'min:1', 'max:5'],
            'manual_data_entry_hours' => ['required', Rule::in(['0-2hrs', '3-5hrs', '6-10hrs', '10+hrs'])],
            'lost_leads'              => ['required', Rule::in(['yes', 'no', 'not_sure'])],
            'paying_no_results'       => ['required', Rule::in(['yes', 'no', 'not_sure'])],

            // Step 3 — Goals
            'primary_goal'       => ['required', Rule::in(['grow_revenue', 'reduce_costs', 'improve_cx', 'scale_operations'])],
            'success_vision'     => ['required', 'string'],
            'holding_back'       => ['required', Rule::in(['lack_of_time', 'wrong_tools', 'team_capacity', 'no_clear_strategy', 'budget'])],
            'tried_before'       => ['required', 'string'],
            'automate_one_thing' => ['required', 'string'],

            // Step 4 — Contact
            'first_name'   => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:255'],
            'email'        => ['required', 'email', 'max:255'],
        ];
    }
}
