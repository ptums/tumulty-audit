<?php

namespace App\Http\Controllers;

use App\Models\AuditResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $total    = AuditResponse::count();
        $thisWeek = AuditResponse::whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ])->count();

        $recentSubmissions = AuditResponse::latest()
            ->take(10)
            ->get(['id', 'first_name', 'company_name', 'email', 'created_at']);

        $primaryGoalTrends = AuditResponse::all(['primary_goal'])
            ->groupBy('primary_goal')
            ->map(fn ($items, $key) => ['value' => $key, 'count' => $items->count()])
            ->sortByDesc('count')
            ->values();

        $holdingBackTrends = AuditResponse::all(['holding_back'])
            ->groupBy('holding_back')
            ->map(fn ($items, $key) => ['value' => $key, 'count' => $items->count()])
            ->sortByDesc('count')
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total'          => $total,
                'thisWeek'       => $thisWeek,
                'avgScore'       => 0,
                'completionRate' => 100,
            ],
            'recentSubmissions' => $recentSubmissions,
            'trends' => [
                'primaryGoal' => $primaryGoalTrends,
                'holdingBack' => $holdingBackTrends,
            ],
        ]);
    }
}
