<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuditResponseRequest;
use App\Models\AuditResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AuditController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Audit/Index');
    }

    public function store(StoreAuditResponseRequest $request): RedirectResponse
    {
        AuditResponse::create($request->validated());

        return redirect()->route('audit.thankyou');
    }

    public function thankYou(): Response
    {
        return Inertia::render('Audit/ThankYou');
    }
}
