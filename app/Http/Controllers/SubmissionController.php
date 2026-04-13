<?php

namespace App\Http\Controllers;

use App\Models\AuditResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/SubmissionsList', [
            'submissions' => AuditResponse::latest()->paginate(25),
        ]);
    }

    public function show(AuditResponse $auditResponse): Response
    {
        return Inertia::render('Admin/SubmissionDetail', [
            'submission' => $auditResponse,
        ]);
    }

    public function updateNotes(Request $request, AuditResponse $auditResponse): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $auditResponse->update(['notes' => $validated['notes']]);

        return back();
    }
}
