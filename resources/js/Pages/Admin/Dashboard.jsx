import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const PRIMARY_GOAL_LABELS = {
    grow_revenue:     'Grow revenue',
    reduce_costs:     'Reduce costs',
    improve_cx:       'Improve customer experience',
    scale_operations: 'Scale operations',
};

const HOLDING_BACK_LABELS = {
    lack_of_time:      'Lack of time',
    wrong_tools:       'Wrong tools',
    team_capacity:     'Team capacity',
    no_clear_strategy: 'No clear strategy',
    budget:            'Budget',
};

function MetricCard({ label, value, sub }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
            <p
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-4xl font-extrabold text-emerald-800"
            >
                {value}
            </p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

function TrendChart({ title, data, labelMap }) {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="mb-7">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">{title}</h3>
            {data.length === 0 ? (
                <p className="text-gray-400 text-sm">No data yet.</p>
            ) : data.map(item => (
                <div key={item.value} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{labelMap[item.value] ?? item.value}</span>
                        <span className="text-gray-500 font-semibold tabular-nums">{item.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((item.count / max) * 100)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Dashboard({ metrics, recentSubmissions, trends }) {
    const goToSubmission = id => router.visit(`/admin/submissions/${id}`);

    return (
        <AdminLayout>
            <Head title="Dashboard | Tumulty Audit" />

            <h1
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl font-extrabold text-emerald-800 mb-7"
            >
                Dashboard
            </h1>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard label="Total submissions" value={metrics.total} />
                <MetricCard label="This week" value={metrics.thisWeek} />
                <MetricCard label="Avg. score" value="—" sub="Available after AI is wired up" />
                <MetricCard label="Completion rate" value="100%" sub="Email required on all submissions" />
            </div>

            {/* Main content: table + trends */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Recent submissions table */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-lg font-bold text-emerald-800"
                        >
                            Recent Submissions
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Name</th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Company</th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Email</th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Score</th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                            No submissions yet.
                                        </td>
                                    </tr>
                                ) : recentSubmissions.map(s => (
                                    <tr
                                        key={s.id}
                                        onClick={() => goToSubmission(s.id)}
                                        className="hover:bg-emerald-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-3 font-medium text-gray-800">{s.first_name}</td>
                                        <td className="px-6 py-3 text-gray-600">{s.company_name}</td>
                                        <td className="px-6 py-3 text-gray-600">{s.email}</td>
                                        <td className="px-6 py-3 text-gray-400">—</td>
                                        <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                                            {new Date(s.created_at).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Trends panel */}
                <div className="w-full lg:w-72 bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-5">
                    <h2
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        className="text-lg font-bold text-emerald-800 mb-5"
                    >
                        Question Trends
                    </h2>
                    <TrendChart
                        title="Q10 — Primary goal"
                        data={trends.primaryGoal}
                        labelMap={PRIMARY_GOAL_LABELS}
                    />
                    <TrendChart
                        title="Q12 — Biggest blocker"
                        data={trends.holdingBack}
                        labelMap={HOLDING_BACK_LABELS}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
