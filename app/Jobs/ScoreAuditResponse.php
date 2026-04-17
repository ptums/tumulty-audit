<?php

namespace App\Jobs;

use App\Models\AuditResponse;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ScoreAuditResponse implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(public readonly AuditResponse $auditResponse) {}

    public function handle(): void
    {
        $baseUrl = rtrim(env('API_BASE_URL', 'https://tumulty-score-api.peter-686.workers.dev'), '/');

        $response = Http::timeout(15)->post("{$baseUrl}/score", [
            // Step 1 — Team
            'team_size'       => $this->auditResponse->team_size,
            'unused_features' => $this->auditResponse->same_features,
            'tool_adoption'   => $this->auditResponse->team_embraces_tools,
            'asks_for_tools'  => $this->auditResponse->asks_for_tools,
            'tech_owner'      => $this->auditResponse->tech_decision_owner,

            // Step 2 — Pain Points
            'manual_work'          => $this->auditResponse->manual_work_scale,
            'data_entry_hours'     => $this->auditResponse->manual_data_entry_hours,
            'lost_leads'           => $this->auditResponse->lost_leads,
            'tech_not_delivering'  => $this->auditResponse->paying_no_results,

            // Step 3 — Goals
            'primary_goal'       => $this->auditResponse->primary_goal,
            'success_description' => $this->auditResponse->success_vision,
            'biggest_blocker'    => $this->auditResponse->holding_back,
            'tried_before'       => $this->auditResponse->tried_before,
            'automate_one_thing' => $this->auditResponse->automate_one_thing,
        ]);

        if ($response->failed()) {
            Log::error('Scoring API error', [
                'submission_id' => $this->auditResponse->id,
                'status'        => $response->status(),
                'body'          => $response->body(),
            ]);

            $this->fail($response->toException());

            return;
        }

        $result = $response->json();

        $this->auditResponse->update([
            'score'           => $result['score'],
            'grade'           => $result['grade'],
            'score_label'     => $result['label'] ?? null,
            'score_breakdown' => $result['breakdown'] ?? null,
        ]);
    }
}
