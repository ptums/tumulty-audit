import { Head } from '@inertiajs/react';

export default function ThankYou() {
    return (
        <>
            <Head title="Thank You | Tumulty Web Services" />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl bg-white bg-opacity-75 rounded-lg shadow-xl p-10 text-center">

                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        className="text-3xl font-extrabold text-emerald-800 mb-4"
                    >
                        Thank you — your audit is in good hands.
                    </h1>

                    <p className="text-gray-600 leading-relaxed mb-4">
                        Hi, I'm Peter. I personally review every audit that comes through, and I've already received yours.
                    </p>

                    <p className="text-gray-600 leading-relaxed mb-4">
                        I'll take a close look at your answers and put together a report with real observations and practical next steps
                        — no generic advice, just things that are actually relevant to your business.
                    </p>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        Expect to hear from me within <span className="font-semibold text-emerald-700">1–2 business days</span>.
                    </p>

                    <a
                        href="https://tumulty.dev"
                        className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white rounded px-6 py-2 font-medium transition-colors"
                    >
                        Back to Tumulty Web Services
                    </a>
                </div>
            </div>
        </>
    );
}
