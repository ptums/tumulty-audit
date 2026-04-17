<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Automation Readiness Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #f9fafb; font-family: 'Lato', Arial, sans-serif; color: #1f2937; }
        .wrapper { background-color: #f9fafb; padding: 32px 16px; }
        .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; }
        .header { background-color: #065f46; padding: 32px 40px; }
        .header-logo { font-size: 18px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px; }
        .header-sub { font-size: 13px; color: #6ee7b7; margin-top: 4px; }
        .body { padding: 40px; }
        .greeting { font-size: 16px; color: #374151; line-height: 1.6; }
        .score-block { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 32px; text-align: center; margin: 32px 0; }
        .score-number { font-size: 72px; font-weight: 900; color: #065f46; line-height: 1; }
        .score-grade { display: inline-block; background-color: #065f46; color: #ffffff; font-size: 22px; font-weight: 700; border-radius: 6px; padding: 4px 16px; margin-top: 8px; }
        .score-label { font-size: 15px; color: #6b7280; margin-top: 10px; }
        .breakdown { display: flex; gap: 12px; margin: 0 0 32px; }
        .stat { flex: 1; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; }
        .stat-value { font-size: 22px; font-weight: 900; color: #065f46; }
        .stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .interpretation { font-size: 15px; color: #374151; line-height: 1.7; margin-bottom: 32px; }
        .cta-wrap { text-align: center; margin-bottom: 40px; }
        .cta-btn { display: inline-block; background-color: #10b981; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 6px; }
        .divider { border: none; border-top: 1px solid #e5e7eb; margin: 0 40px 32px; }
        .signoff { padding: 0 40px 40px; font-size: 15px; color: #374151; line-height: 1.6; }
        .signoff strong { color: #065f46; }
        @media only screen and (max-width: 480px) {
            .body { padding: 24px; }
            .breakdown { flex-direction: column; }
            .score-number { font-size: 56px; }
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="card">

        {{-- Header --}}
        <div class="header">
            <div class="header-logo">Tumulty</div>
            <div class="header-sub">Automation Readiness Report</div>
        </div>

        {{-- Body --}}
        <div class="body">

            {{-- 1. Greeting --}}
            <p class="greeting">Hi {{ $auditResponse->first_name }},</p>
            <br />
            <p class="greeting">
                Thank you for completing the Automation Readiness Audit. Here's a summary of your results for
                <strong>{{ $auditResponse->company_name }}</strong>.
            </p>

            {{-- 2. Score --}}
            <div class="score-block">
                <div class="score-number">{{ $auditResponse->score }}</div>
                <div><span class="score-grade">{{ $auditResponse->grade }}</span></div>
                @if ($auditResponse->score_label)
                    <div class="score-label">{{ $auditResponse->score_label }}</div>
                @endif
            </div>

            {{-- 3. Score breakdown --}}
            @php
                $breakdown = $auditResponse->score_breakdown ?? [];
                $teamScore      = $breakdown['team']        ?? $breakdown['team_score']        ?? null;
                $painScore      = $breakdown['pain_points'] ?? $breakdown['pain_score']        ?? null;
                $goalsScore     = $breakdown['goals']       ?? $breakdown['goals_score']       ?? null;
            @endphp
            @if ($teamScore !== null || $painScore !== null || $goalsScore !== null)
                <div class="breakdown">
                    @if ($teamScore !== null)
                        <div class="stat">
                            <div class="stat-value">{{ $teamScore }}</div>
                            <div class="stat-label">Team Readiness</div>
                        </div>
                    @endif
                    @if ($painScore !== null)
                        <div class="stat">
                            <div class="stat-value">{{ $painScore }}</div>
                            <div class="stat-label">Pain Points</div>
                        </div>
                    @endif
                    @if ($goalsScore !== null)
                        <div class="stat">
                            <div class="stat-value">{{ $goalsScore }}</div>
                            <div class="stat-label">Goals Clarity</div>
                        </div>
                    @endif
                </div>
            @endif

            {{-- 4. Interpretation --}}
            <p class="interpretation">
                @if ($auditResponse->score >= 80)
                    Your business is in a strong position to leverage automation. You have clear goals, a team that embraces new tools, and real pain points that automation can solve quickly. The opportunity cost of waiting is high — the right systems could free up significant time and revenue this quarter.
                @elseif ($auditResponse->score >= 55)
                    You're partway there. There are meaningful automation opportunities in your business, but a few gaps — whether in team buy-in, process clarity, or tooling — are slowing you down. Addressing those gaps with the right strategy could unlock real efficiency gains in the near term.
                @else
                    Your audit reveals some foundational areas to address before automation will stick. That's not a blocker — it's a starting point. With the right guidance you can build the groundwork that makes every future automation investment pay off faster.
                @endif
            </p>

            {{-- 5. CTA --}}
            <div class="cta-wrap">
                <a href="mailto:peter@tumulty.dev?subject=Strategy Call — {{ rawurlencode($auditResponse->company_name) }}" class="cta-btn">
                    Book a free 30-minute strategy call
                </a>
            </div>

        </div>

        <hr class="divider" />

        {{-- 6. Sign-off --}}
        <div class="signoff">
            <p>Warm regards,</p>
            <br />
            <p><strong>Peter Tumulty</strong><br />Tumulty</p>
        </div>

    </div>
</div>
</body>
</html>
