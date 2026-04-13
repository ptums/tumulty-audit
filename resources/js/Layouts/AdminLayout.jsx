import { Link, router, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { auth, component } = usePage().props;
    const isDashboard   = usePage().component === 'Admin/Dashboard';
    const isSubmissions = usePage().component?.startsWith('Admin/Submission');

    const logout = e => {
        e.preventDefault();
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top nav */}
            <nav className="bg-emerald-800 shadow-md">
                <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-xl font-extrabold text-white tracking-tight"
                        >
                            Tumulty Audit
                        </span>
                        <div className="flex gap-1">
                            <Link
                                href="/admin/dashboard"
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                    isDashboard
                                        ? 'bg-emerald-700 text-white'
                                        : 'text-emerald-200 hover:text-white hover:bg-emerald-700'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/submissions"
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                    isSubmissions
                                        ? 'bg-emerald-700 text-white'
                                        : 'text-emerald-200 hover:text-white hover:bg-emerald-700'
                                }`}
                            >
                                Submissions
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-emerald-300">{auth?.user?.email}</span>
                        <button
                            onClick={logout}
                            className="text-emerald-200 hover:text-white transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page content */}
            <main className="max-w-screen-xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
