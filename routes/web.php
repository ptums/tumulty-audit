<?php

use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/audit', [AuditController::class, 'show'])->name('audit.show');
Route::post('/audit', [AuditController::class, 'store'])->name('audit.store');
Route::get('/audit/thank-you', [AuditController::class, 'thankYou'])->name('audit.thankyou');
