<?php

namespace Tests\Feature;

use App\Models\AuditResponse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_page_loads(): void
    {
        $response = $this->get('/audit');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Audit/Index'));
    }

    public function test_thank_you_page_loads(): void
    {
        $response = $this->get('/audit/thank-you');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Audit/ThankYou'));
    }

    public function test_valid_submission_stores_response_and_redirects(): void
    {
        $response = $this->post('/audit', $this->validPayload());

        $response->assertRedirect('/audit/thank-you');
        $this->assertDatabaseHas('audit_responses', [
            'email'        => 'jane@example.com',
            'first_name'   => 'Jane',
            'company_name' => 'Acme Inc.',
        ]);
    }

    public function test_submission_is_soft_deletable(): void
    {
        $this->post('/audit', $this->validPayload());

        $record = AuditResponse::first();
        $record->delete();

        $this->assertSoftDeleted('audit_responses', ['id' => $record->id]);
    }

    public function test_submission_fails_with_missing_fields(): void
    {
        $response = $this->post('/audit', []);

        $response->assertSessionHasErrors([
            'team_size',
            'email',
            'first_name',
        ]);
    }

    public function test_submission_fails_with_invalid_radio_value(): void
    {
        $payload = $this->validPayload();
        $payload['team_size'] = 'not-a-valid-option';

        $response = $this->post('/audit', $payload);

        $response->assertSessionHasErrors(['team_size']);
    }

    public function test_submission_fails_with_invalid_email(): void
    {
        $payload = $this->validPayload();
        $payload['email'] = 'not-an-email';

        $response = $this->post('/audit', $payload);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_submission_fails_with_out_of_range_scale(): void
    {
        $payload = $this->validPayload();
        $payload['manual_work_scale'] = 6;

        $response = $this->post('/audit', $payload);

        $response->assertSessionHasErrors(['manual_work_scale']);
    }

    private function validPayload(): array
    {
        return [
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
            'success_vision'          => 'A fully automated sales pipeline.',
            'holding_back'            => 'lack_of_time',
            'tried_before'            => 'We tried Zapier but it broke constantly.',
            'automate_one_thing'      => 'Lead follow-up emails.',
            'first_name'              => 'Jane',
            'company_name'            => 'Acme Inc.',
            'email'                   => 'jane@example.com',
        ];
    }
}
