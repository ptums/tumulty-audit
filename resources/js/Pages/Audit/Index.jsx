import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';

// ─── Field components ─────────────────────────────────────────────────────────

function RadioGroup({ name, options, value, onChange, error }) {
    return (
        <div className="space-y-2">
            {options.map(opt => (
                <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        value === opt.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                >
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                        className="accent-emerald-500"
                    />
                    <span className="text-gray-700">{opt.label}</span>
                </label>
            ))}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function ScaleInput({ value, onChange, error }) {
    return (
        <div>
            <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(n => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange(n)}
                        className={`w-12 h-12 rounded-full font-bold text-lg transition-colors ${
                            value === n
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700'
                        }`}
                    >
                        {n}
                    </button>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 w-64">
                <span>Very little</span>
                <span>Most of the day</span>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function TextArea({ name, value, onChange, placeholder, error }) {
    return (
        <div>
            <textarea
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function TextField({ name, value, onChange, placeholder, type = 'text', error }) {
    return (
        <div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function Question({ number, label, children }) {
    return (
        <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500 mb-1">
                Question {number}
            </p>
            <p className="text-gray-800 font-medium mb-3">{label}</p>
            {children}
        </div>
    );
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
    { title: 'Your Team',    subtitle: "Let's start with the people you work with." },
    { title: 'Pain Points',  subtitle: 'Tell us where your team loses time and money.' },
    { title: 'Your Goals',   subtitle: 'Help us understand where you want to go.' },
    { title: 'Get Your Report', subtitle: "We'll send your personalised audit results here." },
];

const STEP_FIELDS = [
    ['team_size', 'same_features', 'team_embraces_tools', 'asks_for_tools', 'tech_decision_owner'],
    ['manual_work_scale', 'manual_data_entry_hours', 'lost_leads', 'paying_no_results'],
    ['primary_goal', 'success_vision', 'holding_back', 'tried_before', 'automate_one_thing'],
    ['first_name', 'company_name', 'email'],
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditIndex() {
    const [step, setStep] = useState(0);
    const [stepErrors, setStepErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        team_size: '',
        same_features: '',
        team_embraces_tools: '',
        asks_for_tools: '',
        tech_decision_owner: '',
        manual_work_scale: '',
        manual_data_entry_hours: '',
        lost_leads: '',
        paying_no_results: '',
        primary_goal: '',
        success_vision: '',
        holding_back: '',
        tried_before: '',
        automate_one_thing: '',
        first_name: '',
        company_name: '',
        email: '',
    });

    const progress = Math.round(((step + 1) / STEPS.length) * 100);

    const validate = () => {
        const errs = {};
        STEP_FIELDS[step].forEach(f => {
            const val = data[f];
            if (val === '' || val === null || val === undefined) {
                errs[f] = 'Please answer this question.';
            }
        });
        if (step === 3 && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errs.email = 'Please enter a valid email address.';
        }
        setStepErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const next = () => {
        if (validate()) {
            setStepErrors({});
            setStep(s => s + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const back = () => {
        setStepErrors({});
        setStep(s => s - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submit = e => {
        e.preventDefault();
        if (validate()) {
            post('/audit');
        }
    };

    // Bind a field: value + onChange + unified error (step-level or server-level)
    const f = name => ({
        value: data[name],
        onChange: val => {
            setData(name, val);
            if (stepErrors[name]) {
                setStepErrors(prev => ({ ...prev, [name]: null }));
            }
        },
        error: stepErrors[name] || errors[name] || null,
    });

    return (
        <>
            <Head title="Automation Readiness Audit | Tumulty Web Services" />

            <div className="min-h-screen bg-gray-100 flex items-start justify-center py-12 px-4">
                <div className="w-full max-w-screen-lg bg-white bg-opacity-75 rounded-lg shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-emerald-800 px-8 py-6">
                        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-extrabold text-white">
                            Automation Readiness Audit
                        </h1>
                        <p className="text-emerald-200 mt-1 text-sm">{STEPS[step].subtitle}</p>
                    </div>

                    {/* Progress */}
                    <div className="px-8 pt-5">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span className="font-semibold text-emerald-700">
                                Step {step + 1} of {STEPS.length} — {STEPS[step].title}
                            </span>
                            <span>{progress}% complete</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="px-8 py-8">

                        {/* ── Step 1: Your Team ── */}
                        {step === 0 && (
                            <div>
                                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-emerald-800 mb-7">
                                    Your Team
                                </h2>

                                <Question number={1} label="How large is your team?">
                                    <RadioGroup name="team_size" options={[
                                        { value: '1-10',   label: '1–10' },
                                        { value: '11-50',  label: '11–50' },
                                        { value: '51-200', label: '51–200' },
                                        { value: '200+',   label: '200+' },
                                    ]} {...f('team_size')} />
                                </Question>

                                <Question number={2} label="Does your team use the same 3–5 features of a tool while paying for the full package?">
                                    <RadioGroup name="same_features" options={[
                                        { value: 'yes_always',   label: 'Yes, always' },
                                        { value: 'sometimes',    label: 'Sometimes' },
                                        { value: 'rarely',       label: 'Rarely' },
                                        { value: 'we_dont_know', label: "We don't know" },
                                    ]} {...f('same_features')} />
                                </Question>

                                <Question number={3} label="Does your team embrace new tools or resist them?">
                                    <RadioGroup name="team_embraces_tools" options={[
                                        { value: 'embrace_quickly',   label: 'Embrace quickly' },
                                        { value: 'need_time',         label: 'Need time to adjust' },
                                        { value: 'usually_resistant', label: 'Usually resistant' },
                                    ]} {...f('team_embraces_tools')} />
                                </Question>

                                <Question number={4} label="How often does your team ask for better tools?">
                                    <RadioGroup name="asks_for_tools" options={[
                                        { value: 'constantly',   label: 'Constantly' },
                                        { value: 'occasionally', label: 'Occasionally' },
                                        { value: 'rarely',       label: 'Rarely' },
                                        { value: 'never',        label: 'Never' },
                                    ]} {...f('asks_for_tools')} />
                                </Question>

                                <Question number={5} label="Who owns technology decisions at your company?">
                                    <RadioGroup name="tech_decision_owner" options={[
                                        { value: 'founder_ceo',    label: 'Founder / CEO' },
                                        { value: 'operations_lead', label: 'Operations lead' },
                                        { value: 'it_department',  label: 'IT department' },
                                        { value: 'nobody',         label: 'Nobody specifically' },
                                    ]} {...f('tech_decision_owner')} />
                                </Question>
                            </div>
                        )}

                        {/* ── Step 2: Pain Points ── */}
                        {step === 1 && (
                            <div>
                                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-emerald-800 mb-7">
                                    Pain Points
                                </h2>

                                <Question number={6} label="How much of your team's day is spent on manual repetitive work?">
                                    <ScaleInput {...f('manual_work_scale')} />
                                </Question>

                                <Question number={7} label="How many hours per week does your team spend on manual data entry?">
                                    <RadioGroup name="manual_data_entry_hours" options={[
                                        { value: '0-2hrs',  label: '0–2 hours' },
                                        { value: '3-5hrs',  label: '3–5 hours' },
                                        { value: '6-10hrs', label: '6–10 hours' },
                                        { value: '10+hrs',  label: '10+ hours' },
                                    ]} {...f('manual_data_entry_hours')} />
                                </Question>

                                <Question number={8} label="Have you lost leads or customers due to slow follow-up?">
                                    <RadioGroup name="lost_leads" options={[
                                        { value: 'yes',      label: 'Yes' },
                                        { value: 'no',       label: 'No' },
                                        { value: 'not_sure', label: 'Not sure' },
                                    ]} {...f('lost_leads')} />
                                </Question>

                                <Question number={9} label="Are you paying for technology but not confident it's delivering results?">
                                    <RadioGroup name="paying_no_results" options={[
                                        { value: 'yes',      label: 'Yes' },
                                        { value: 'no',       label: 'No' },
                                        { value: 'not_sure', label: 'Not sure' },
                                    ]} {...f('paying_no_results')} />
                                </Question>
                            </div>
                        )}

                        {/* ── Step 3: Goals ── */}
                        {step === 2 && (
                            <div>
                                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-emerald-800 mb-7">
                                    Your Goals
                                </h2>

                                <Question number={10} label="What's your primary goal for the next 12 months?">
                                    <RadioGroup name="primary_goal" options={[
                                        { value: 'grow_revenue', label: 'Grow revenue' },
                                        { value: 'reduce_costs', label: 'Reduce costs' },
                                        { value: 'improve_cx',   label: 'Improve customer experience' },
                                        { value: 'scale_operations', label: 'Scale operations' },
                                    ]} {...f('primary_goal')} />
                                </Question>

                                <Question number={11} label="What does success look like for your team one year from now?">
                                    <TextArea name="success_vision" placeholder="Describe your vision…" {...f('success_vision')} />
                                </Question>

                                <Question number={12} label="What's holding you back from reaching that goal today?">
                                    <RadioGroup name="holding_back" options={[
                                        { value: 'lack_of_time',       label: 'Lack of time' },
                                        { value: 'wrong_tools',        label: 'Wrong tools' },
                                        { value: 'team_capacity',      label: 'Team capacity' },
                                        { value: 'no_clear_strategy',  label: 'No clear strategy' },
                                        { value: 'budget',             label: 'Budget' },
                                    ]} {...f('holding_back')} />
                                </Question>

                                <Question number={13} label="Have you tried to solve this before? What happened?">
                                    <TextArea name="tried_before" placeholder="Share what you've tried…" {...f('tried_before')} />
                                </Question>

                                <Question number={14} label="If you could automate one thing tomorrow, what would it be?">
                                    <TextArea name="automate_one_thing" placeholder="Dream big…" {...f('automate_one_thing')} />
                                </Question>
                            </div>
                        )}

                        {/* ── Step 4: Contact ── */}
                        {step === 3 && (
                            <div>
                                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-emerald-800 mb-3">
                                    Get Your Report
                                </h2>
                                <p className="text-gray-500 mb-7 text-sm leading-relaxed">
                                    You're almost done. Enter your details and I'll prepare a personalised automation audit report for your business.
                                </p>

                                <Question number={15} label="First name">
                                    <TextField name="first_name" placeholder="Jane" {...f('first_name')} />
                                </Question>

                                <Question number={16} label="Company name">
                                    <TextField name="company_name" placeholder="Acme Inc." {...f('company_name')} />
                                </Question>

                                <Question number={17} label="Email address">
                                    <TextField name="email" type="email" placeholder="jane@example.com" {...f('email')} />
                                </Question>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                            {step > 0 ? (
                                <button
                                    type="button"
                                    onClick={back}
                                    className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                                >
                                    ← Back
                                </button>
                            ) : (
                                <span />
                            )}

                            {step < STEPS.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-6 py-2 font-medium transition-colors"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded px-6 py-2 font-medium transition-colors"
                                >
                                    {processing ? 'Submitting…' : 'Get My Audit Report →'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
