<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuditResponseRequest;
use App\Jobs\ScoreAuditResponse;
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
        $response = AuditResponse::create($request->validated());

        ScoreAuditResponse::dispatch($response);

        return redirect()->route('audit.thankyou');
    }

    public function thankYou(): Response
    {
        return Inertia::render('Audit/ThankYou');
    }
}
