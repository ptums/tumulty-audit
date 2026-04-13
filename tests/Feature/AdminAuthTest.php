<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'email'    => 'peter@tumulty.dev',
            'password' => Hash::make('secret'),
        ]);
    }

    public function test_login_page_renders(): void
    {
        $this->get('/admin/login')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Admin/Login'));
    }

    public function test_authenticated_user_redirected_away_from_login(): void
    {
        $this->actingAs($this->createAdmin())
            ->get('/admin/login')
            ->assertRedirect('/admin/dashboard');
    }

    public function test_valid_credentials_redirect_to_dashboard(): void
    {
        $this->createAdmin();

        $this->post('/admin/login', [
            'email'    => 'peter@tumulty.dev',
            'password' => 'secret',
        ])->assertRedirect('/admin/dashboard');
    }

    public function test_invalid_credentials_return_error(): void
    {
        $this->createAdmin();

        $this->post('/admin/login', [
            'email'    => 'peter@tumulty.dev',
            'password' => 'wrong-password',
        ])->assertSessionHasErrors('email');
    }

    public function test_protected_routes_redirect_guests_to_admin_login(): void
    {
        $this->get('/admin/dashboard')->assertRedirect('/admin/login');
        $this->get('/admin/submissions')->assertRedirect('/admin/login');
    }

    public function test_logout_clears_session_and_redirects(): void
    {
        $this->actingAs($this->createAdmin())
            ->post('/admin/logout')
            ->assertRedirect('/admin/login');

        $this->assertGuest();
    }
}
