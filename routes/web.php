<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Support\Facades\Route;

// ── Public audit ──────────────────────────────────────────────────────────────
Route::get('/', [AuditController::class, 'show'])->name('home');
Route::post('/audit', [AuditController::class, 'store'])->name('audit.store');
Route::get('/audit/thank-you', [AuditController::class, 'thankYou'])->name('audit.thankyou');

// ── Admin auth (guest only) ───────────────────────────────────────────────────
Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login.post');

// ── Protected admin ───────────────────────────────────────────────────────────
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/submissions', [SubmissionController::class, 'index'])->name('submissions.index');
    Route::get('/submissions/{auditResponse}', [SubmissionController::class, 'show'])->name('submissions.show');
    Route::patch('/submissions/{auditResponse}/notes', [SubmissionController::class, 'updateNotes'])->name('submissions.notes');
});
