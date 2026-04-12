<?php

use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuditController::class, 'show'])->name('home');
Route::post('/audit', [AuditController::class, 'store'])->name('audit.store');
Route::get('/audit/thank-you', [AuditController::class, 'thankYou'])->name('audit.thankyou');
