import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const ANSWER_LABELS = {
    team_size:              { '1-10': '1–10', '11-50': '11–50', '51-200': '51–200', '200+': '200+' },
    same_features:          { yes_always: 'Yes, always', sometimes: 'Sometimes', rarely: 'Rarely', we_dont_know: "We don't know" },
    team_embraces_tools:    { embrace_quickly: 'Embrace quickly', need_time: 'Need time to adjust', usually_resistant: 'Usually resistant' },
    asks_for_tools:         { constantly: 'Constantly', occasionally: 'Occasionally', rarely: 'Rarely', never: 'Never' },
    tech_decision_owner:    { founder_ceo: 'Founder / CEO', operations_lead: 'Operations lead', it_department: 'IT department', nobody: 'Nobody specifically' },
    manual_data_entry_hours:{ '0-2hrs': '0–2 hours', '3-5hrs': '3–5 hours', '6-10hrs': '6–10 hours', '10+hrs': '10+ hours' },
    lost_leads:             { yes: 'Yes', no: 'No', not_sure: 'Not sure' },
    paying_no_results:      { yes: 'Yes', no: 'No', not_sure: 'Not sure' },
    primary_goal:           { grow_revenue: 'Grow revenue', reduce_costs: 'Reduce costs', improve_cx: 'Improve customer experience', scale_operations: 'Scale operations' },
    holding_back:           { lack_of_time: 'Lack of time', wrong_tools: 'Wrong tools', team_capacity: 'Team capacity', no_clear_strategy: 'No clear strategy', budget: 'Budget' },
};

const SECTIONS = [
    {
        title: 'Step 1 — Your Team',
        questions: [
            { n: 1,  field: 'team_size',              label: 'How large is your team?' },
            { n: 2,  field: 'same_features',          label: 'Does your team use the same 3–5 features of a tool while paying for the full package?' },
            { n: 3,  field: 'team_embraces_tools',    label: 'Does your team embrace new tools or resist them?' },
            { n: 4,  field: 'asks_for_tools',         label: 'How often does your team ask for better tools?' },
            { n: 5,  field: 'tech_decision_owner',    label: 'Who owns technology decisions at your company?' },
        ],
    },
    {
        title: 'Step 2 — Pain Points',
        questions: [
            { n: 6,  field: 'manual_work_scale',       label: 'How much of the day is spent on manual repetitive work?', type: 'scale' },
            { n: 7,  field: 'manual_data_entry_hours', label: 'Hours per week on manual data entry?' },
            { n: 8,  field: 'lost_leads',              label: 'Have you lost leads or customers due to slow follow-up?' },
            { n: 9,  field: 'paying_no_results',       label: "Are you paying for technology but not confident it's delivering results?" },
        ],
    },
    {
        title: 'Step 3 — Goals',
        questions: [
            { n: 10, field: 'primary_goal',       label: 'Primary goal for the next 12 months?' },
            { n: 11, field: 'success_vision',     label: 'What does success look like one year from now?', type: 'text' },
            { n: 12, field: 'holding_back',       label: "What's holding you back from reaching that goal today?" },
            { n: 13, field: 'tried_before',       label: 'Have you tried to solve this before? What happened?', type: 'text' },
            { n: 14, field: 'automate_one_thing', label: 'If you could automate one thing tomorrow, what would it be?', type: 'text' },
        ],
    },
];

function renderAnswer(field, value, type) {
    if (type === 'scale') return `${value} / 5`;
    if (type === 'text')  return value;
    return ANSWER_LABELS[field]?.[value] ?? value;
}

export default function SubmissionDetail({ submission }) {
    const { data, setData, patch, processing } = useForm({
        notes: submission.notes ?? '',
    });

    const saveNotes = e => {
        e.preventDefault();
        patch(`/admin/submissions/${submission.id}/notes`);
    };

    return (
        <AdminLayout>
            <Head title={`${submission.first_name} — ${submission.company_name} | Tumulty Audit`} />

            {/* Back + title */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/dashboard"
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
                >
                    ← Back to dashboard
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left column — contact + answers */}
                <div className="flex-1 space-y-6">

                    {/* Contact card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-5">
                        <h1
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-2xl font-extrabold text-emerald-800 mb-4"
                        >
                            {submission.first_name} — {submission.company_name}
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Email</p>
                                <a
                                    href={`mailto:${submission.email}`}
                                    className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                >
                                    {submission.email}
                                </a>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Submitted</p>
                                <p className="text-gray-700">
                                    {new Date(submission.created_at).toLocaleDateString('en-GB', {
                                        day: 'numeric', month: 'long', year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Score</p>
                                <p className="text-gray-400">— (pending AI)</p>
                            </div>
                        </div>
                    </div>

                    {/* Answers by section */}
                    {SECTIONS.map(section => (
                        <div key={section.title} className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-5">
                            <h2
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                className="text-lg font-bold text-emerald-800 mb-4"
                            >
                                {section.title}
                            </h2>
                            <div className="space-y-5">
                                {section.questions.map(q => (
                                    <div key={q.field}>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
                                            Q{q.n} — {q.label}
                                        </p>
                                        <p className={`text-gray-800 ${q.type === 'text' ? 'whitespace-pre-wrap leading-relaxed' : 'font-medium'}`}>
                                            {renderAnswer(q.field, submission[q.field], q.type)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right column — notes + HubSpot */}
                <div className="w-full lg:w-80 space-y-4">

                    {/* Notes */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-5">
                        <h2
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-lg font-bold text-emerald-800 mb-3"
                        >
                            Notes
                        </h2>
                        <form onSubmit={saveNotes}>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                rows={8}
                                placeholder="Add private notes about this submission…"
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
                            >
                                {processing ? 'Saving…' : 'Save notes'}
                            </button>
                        </form>
                    </div>

                    {/* HubSpot integration (placeholder) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-5">
                        <h2
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-lg font-bold text-emerald-800 mb-1"
                        >
                            Integrations
                        </h2>
                        <p className="text-xs text-gray-400 mb-3">HubSpot sync coming soon.</p>
                        <button
                            type="button"
                            disabled
                            className="w-full border border-gray-200 text-gray-400 rounded px-4 py-2 text-sm font-medium cursor-not-allowed bg-gray-50"
                            title="HubSpot integration not yet configured"
                        >
                            Sync to HubSpot
                        </button>
                        {submission.integration_status && (
                            <p className="text-xs text-gray-400 mt-2">
                                Status: {submission.integration_status}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
