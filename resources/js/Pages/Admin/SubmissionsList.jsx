import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function SubmissionsList({ submissions }) {
    const { data, links, current_page, last_page } = submissions;

    return (
        <AdminLayout>
            <Head title="Submissions | Tumulty Audit" />

            <h1
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl font-extrabold text-emerald-800 mb-7"
            >
                All Submissions
            </h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Company</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Email</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Score</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No submissions yet.
                                    </td>
                                </tr>
                            ) : data.map(s => (
                                <tr
                                    key={s.id}
                                    onClick={() => router.visit(`/admin/submissions/${s.id}`)}
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
                                    <td className="px-6 py-3 text-right">
                                        <span className="text-emerald-600 text-xs font-medium">View →</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
                        <p className="text-gray-400">Page {current_page} of {last_page}</p>
                        <div className="flex gap-2">
                            {links.filter(l => l.label !== '&laquo; Previous' && l.label !== 'Next &raquo;').map(link => (
                                <button
                                    key={link.label}
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${
                                        link.active
                                            ? 'bg-emerald-500 text-white'
                                            : 'text-gray-500 hover:text-emerald-700 disabled:opacity-40'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
