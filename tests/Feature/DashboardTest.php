<?php

namespace Tests\Feature;

use App\Models\AuditResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    private function submission(array $overrides = []): AuditResponse
    {
        return AuditResponse::create(array_merge([
            'team_size'               => '1-10',
            'same_features'           => 'sometimes',
            'team_embraces_tools'     => 'embrace_quickly',
            'asks_for_tools'          => 'occasionally',
            'tech_decision_owner'     => 'founder_ceo',
            'manual_work_scale'       => 3,
            'manual_data_entry_hours' => '3-5hrs',
            'lost_leads'              => 'not_sure',
            'paying_no_results'       => 'yes',
            'primary_goal'            => 'grow_revenue',
            'success_vision'          => 'A great team.',
            'holding_back'            => 'lack_of_time',
            'tried_before'            => 'Tried Zapier.',
            'automate_one_thing'      => 'Email follow-ups.',
            'first_name'              => 'Jane',
            'company_name'            => 'Acme',
            'email'                   => 'jane@example.com',
        ], $overrides));
    }

    public function test_dashboard_requires_auth(): void
    {
        $this->get('/admin/dashboard')->assertRedirect('/admin/login');
    }

    public function test_dashboard_renders_for_authenticated_user(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/dashboard')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Dashboard')
                ->has('metrics')
                ->has('recentSubmissions')
                ->has('trends')
            );
    }

    public function test_dashboard_metrics_reflect_submissions(): void
    {
        $this->submission();
        $this->submission(['email' => 'bob@example.com']);

        $this->actingAs($this->admin())
            ->get('/admin/dashboard')
            ->assertInertia(fn ($page) => $page
                ->where('metrics.total', 2)
            );
    }

    public function test_submissions_list_renders(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/submissions')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Admin/SubmissionsList'));
    }

    public function test_submission_detail_renders(): void
    {
        $record = $this->submission();

        $this->actingAs($this->admin())
            ->get("/admin/submissions/{$record->id}")
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/SubmissionDetail')
                ->has('submission')
            );
    }

    public function test_notes_can_be_saved(): void
    {
        $record = $this->submission();

        $this->actingAs($this->admin())
            ->patch("/admin/submissions/{$record->id}/notes", [
                'notes' => 'Great lead — follow up Monday.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('audit_responses', [
            'id'    => $record->id,
            'notes' => 'Great lead — follow up Monday.',
        ]);
    }

    public function test_notes_can_be_cleared(): void
    {
        $record = $this->submission();
        $record->update(['notes' => 'Old note.']);

        $this->actingAs($this->admin())
            ->patch("/admin/submissions/{$record->id}/notes", ['notes' => null])
            ->assertRedirect();

        $this->assertDatabaseHas('audit_responses', [
            'id'    => $record->id,
            'notes' => null,
        ]);
    }

    public function test_integration_status_column_exists_on_submission(): void
    {
        $record = $this->submission();
        $this->assertNull($record->integration_status);

        $record->update(['integration_status' => 'synced']);
        $this->assertSame('synced', $record->fresh()->integration_status);
    }
}
