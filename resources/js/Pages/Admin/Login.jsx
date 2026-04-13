import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email:    '',
        password: '',
    });

    const submit = e => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <>
            <Head title="Admin Login | Tumulty Audit" />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">

                    <div className="bg-emerald-800 px-8 py-6">
                        <h1
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-2xl font-extrabold text-white"
                        >
                            Tumulty Audit
                        </h1>
                        <p className="text-emerald-200 text-sm mt-1">Internal dashboard</p>
                    </div>

                    <form onSubmit={submit} className="px-8 py-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                autoComplete="email"
                                className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                                placeholder="peter@tumulty.dev"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                autoComplete="current-password"
                                className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded px-6 py-2.5 font-medium transition-colors"
                        >
                            {processing ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
