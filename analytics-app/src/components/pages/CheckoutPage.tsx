import React, { useState, useRef, useEffect } from 'react';
import {
    ShieldCheck,
    CheckCircle2,
    ChevronDown,
    Lock,
    Loader2,
    ArrowLeft,
    Mail,
    Globe,
    Search,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const COUNTRIES = [
    "United States", "United Kingdom", "Germany", "Poland", "France",
    "Canada", "Australia", "Spain", "Italy", "Netherlands",
    "Sweden", "Ukraine", "Japan", "Brazil", "India"
];

const CheckoutPage = () => {
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInvoiceFields, setShowInvoiceFields] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

    // Custom dropdown state
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        email: 'user@example.com',
        country: 'United States',
        companyName: '',
        taxId: ''
    });

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCountryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTrialEndDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const trialDate = getTrialEndDate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStripeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termsAccepted) {
            alert("Please accept the Terms of Use and Privacy Policy to proceed.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Create Checkout Session on backend
            const response = await fetch('/create-stripe-session.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    companyName: formData.companyName,
                    taxId: formData.taxId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // 2. Redirect to Stripe Hosted Checkout URL
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No Stripe Checkout URL returned");
            }

        } catch (err: any) {
            console.error('[error]', err);
            alert(`Error: ${err.message}`);
            setIsSubmitting(false);
        }
    };

    // PayPal Handlers
    const createPayPalOrder = async () => {
        if (!termsAccepted) {
            alert("Please accept the Terms of Use and Privacy Policy to proceed.");
            throw new Error("Terms not accepted");
        }

        try {
            const response = await fetch('/create-paypal-order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [{ id: 'pro-plan' }] }),
            });
            const order = await response.json();
            return order.id;
        } catch (err) {
            console.error("PayPal Create Order Error:", err);
            throw err;
        }
    };

    const onPayPalApprove = async (data: any, actions: any) => {
        try {
            const response = await fetch('/capture-paypal-order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: data.orderID }),
            });
            const orderData = await response.json();
            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
                return actions.restart();
            } else if (errorDetail) {
                throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            } else {
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                navigate('/payment-success');
            }
        } catch (err) {
            console.error("PayPal Capture Error:", err);
            alert("PayPal transaction failed. Please try again.");
        }
    };

    const filteredCountries = COUNTRIES.filter(c =>
        c.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
        <PayPalScriptProvider options={{ clientId: "AbEX3KH6vNaoJNI79RJ4oYptrt0raV2VH9zMSAPLJGdC6NiTT58cABfgVUrJ2yYaq3j7VkoG7hg4jUIk", currency: "EUR" }}>
            <div className="min-h-screen bg-[#05060B] text-slate-200 font-body selection:bg-purple-500/30">
                {/* Background Glows */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block">
                    <div className="absolute top-[-10%] left-[30%] w-[50%] h-[50%] bg-[#7C3AED]/10 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4F46E5]/10 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                {/* Header */}
                <header className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-[#6D28D9] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="text-white font-bold text-xl font-display">W</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white font-display">
                            White Knight <span className="font-normal text-slate-400">Analytics</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                        <span className="font-medium">Secure checkout</span>
                    </div>
                </header>

                <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24 pt-4">
                    <div className="mb-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to plans
                        </button>
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight font-display">
                                Start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#38BDF8]">14-day free trial</span>
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed font-light max-w-2xl font-body">
                                Unlock professional-grade analytics. <span className="text-white font-medium">€0 today</span>, then €15/month. Cancel anytime.
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* Left Column: Plan Summary */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                            <div className="relative bg-[#11131F] border border-white/[0.06] rounded-3xl p-8 overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
                                            Pro Plan
                                            <div className="px-2 py-0.5 bg-[#34D399]/10 rounded text-[#34D399] text-[10px] font-bold uppercase tracking-wider border border-[#34D399]/20 font-body">
                                                Coach-Ready
                                            </div>
                                        </h2>
                                        <p className="text-slate-500 text-sm mt-1">14-day free trial included</p>
                                    </div>
                                </div>
                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between items-baseline group">
                                        <span className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">Due today</span>
                                        <span className="text-white font-bold text-2xl tracking-tight font-display">€0.00</span>
                                    </div>
                                    <div className="h-px bg-white/5"></div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-400 text-sm">After 14 days</span>
                                        <div className="text-right">
                                            <span className="text-slate-200 font-semibold">€15.00</span>
                                            <span className="text-slate-500 text-xs"> / month</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#1A1D2B] rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#A78BFA] font-medium text-sm">Trial ends on {trialDate}</span>
                                        </div>
                                        <span className="text-slate-500 text-xs leading-relaxed">We’ll email you a reminder before your trial ends.</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-display">Included features</p>
                                    <ul className="space-y-3">
                                        {["Full report + deeper history", "Opponent Prep & Analysis", "AI Strategic Assistant", "Advanced breakdown exports"].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-300 group">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-[#34D399]/10 flex items-center justify-center shrink-0 border border-[#34D399]/20">
                                                    <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
                                                </div>
                                                <span className="text-sm font-medium group-hover:text-white transition-colors">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#11131F] border border-white/[0.06] rounded-3xl p-8 shadow-2xl relative">
                                <form onSubmit={handleStripeSubmit} className="relative z-10 space-y-8">

                                    {/* Payment Method Selector */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Method</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('stripe')}
                                                className={`relative h-14 rounded-xl font-bold flex items-center justify-center transition-all border ${paymentMethod === 'stripe' ? 'bg-[#635BFF] text-white border-[#635BFF] shadow-[0_0_20px_rgba(99,91,255,0.3)]' : 'bg-[#1A1D2B] text-slate-400 border-white/5 hover:bg-[#232738] hover:text-white'}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="font-display tracking-tight text-lg">Stripe</span>
                                                </span>
                                                {paymentMethod === 'stripe' && (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('paypal')}
                                                className={`relative h-14 rounded-xl font-bold flex items-center justify-center transition-all border ${paymentMethod === 'paypal' ? 'bg-[#003087] text-white border-[#003087] shadow-[0_0_20px_rgba(0,48,135,0.3)]' : 'bg-[#1A1D2B] text-slate-400 border-white/5 hover:bg-[#232738] hover:text-white'}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="font-display tracking-tight text-lg italic">PayPal</span>
                                                </span>
                                                {paymentMethod === 'paypal' && (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email Field - Always Visible */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 ml-1">Email (for account access)</label>
                                            <div className="relative group">
                                                <div className="relative flex items-center">
                                                    <Mail className="absolute left-4 w-4 h-4 text-slate-500 group-focus-within:text-[#A78BFA] transition-colors" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-[#0B0E14] border border-white/10 text-slate-200 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#7C3AED]/50 transition-all placeholder:text-slate-600 shadow-inner"
                                                        placeholder="name@company.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stripe-Specific Fields: Country & Invoice */}
                                        {paymentMethod === 'stripe' && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                {/* Country Dropdown */}
                                                <div className="space-y-2" ref={dropdownRef}>
                                                    <label className="text-xs font-semibold text-slate-400 ml-1">Billing country</label>
                                                    <div className="relative group">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                                                            className="w-full bg-[#0B0E14] border border-white/10 text-slate-200 text-sm rounded-xl pl-11 pr-10 py-3.5 text-left flex items-center focus:outline-none focus:border-[#7C3AED]/50 transition-all shadow-inner hover:border-white/20"
                                                        >
                                                            <Globe className="absolute left-4 w-4 h-4 text-slate-500 group-focus-within:text-[#A78BFA]" />
                                                            {formData.country}
                                                            <ChevronDown className={`absolute right-4 w-4 h-4 text-slate-500 transition-transform duration-200 ${isCountryOpen ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {isCountryOpen && (
                                                            <div className="absolute z-50 mt-2 w-full bg-[#0B0E14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                                                <div className="p-2 border-b border-white/5 sticky top-0 bg-[#0B0E14]/95 backdrop-blur-md">
                                                                    <div className="relative">
                                                                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                                                                        <input
                                                                            autoFocus
                                                                            type="text"
                                                                            placeholder="Search country..."
                                                                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#7C3AED]/50 focus:bg-white/10 placeholder:text-slate-600 transition-all"
                                                                            value={countrySearch}
                                                                            onChange={(e) => setCountrySearch(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                                                    {filteredCountries.length > 0 ? (
                                                                        filteredCountries.map(c => (
                                                                            <button
                                                                                key={c}
                                                                                type="button"
                                                                                onClick={() => { setFormData({ ...formData, country: c }); setIsCountryOpen(false); setCountrySearch(""); }}
                                                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-[#7C3AED]/20 hover:text-white transition-colors flex items-center justify-between group/item"
                                                                            >
                                                                                {c}
                                                                                {formData.country === c && <Check className="w-3.5 h-3.5 text-[#34D399]" />}
                                                                            </button>
                                                                        ))
                                                                    ) : (
                                                                        <div className="px-4 py-3 text-xs text-slate-500 text-center">No countries found</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Invoice Toggle */}
                                                <div className="space-y-4 pt-2">
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowInvoiceFields(!showInvoiceFields)}
                                                            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-[#A78BFA] transition-colors group w-full"
                                                        >
                                                            <div className={`p-1 rounded-md bg-white/5 border border-white/10 group-hover:border-[#7C3AED]/30 group-hover:bg-[#7C3AED]/10 transition-all ${showInvoiceFields ? 'rotate-180' : ''}`}>
                                                                <ChevronDown className="w-3 h-3" />
                                                            </div>
                                                            <span>Need an invoice?</span>
                                                        </button>
                                                        <span className="text-xs text-slate-500 font-normal pl-8">Add company details to receive an invoice/receipt by email.</span>
                                                    </div>

                                                    {showInvoiceFields && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <div className="space-y-1.5">
                                                                <label className="text-xs font-semibold text-slate-500 ml-1">Company name</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.companyName}
                                                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                                    className="w-full bg-[#0B0E14] border border-white/10 focus:border-[#7C3AED]/50 rounded-xl px-4 py-3 text-slate-200 text-sm outline-none transition-all placeholder:text-slate-600 shadow-inner"
                                                                    placeholder="White Knight Analytics Inc."
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-xs font-semibold text-slate-500 ml-1">VAT / Tax ID (optional)</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.taxId}
                                                                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                                                    className="w-full bg-[#0B0E14] border border-white/10 focus:border-[#7C3AED]/50 rounded-xl px-4 py-3 text-slate-200 text-sm outline-none transition-all placeholder:text-slate-600 shadow-inner"
                                                                    placeholder="PL1234567890"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Terms & Conditions Checkbox */}
                                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-500 bg-[#0B0E14] checked:border-[#34D399] checked:bg-[#34D399] transition-all"
                                            />
                                            <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#05060B] opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                        <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                                            I agree with the website's <a href="https://whiteknight.academy/terms-of-service/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#34D399] underline decoration-slate-600/50 underline-offset-2 transition-colors">Terms of Use</a> and <a href="https://whiteknight.academy/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#34D399] underline decoration-slate-600/50 underline-offset-2 transition-colors">Privacy Policy</a>.
                                        </label>
                                    </div>

                                    {/* Action Area */}
                                    <div className="space-y-6 pt-2">
                                        {paymentMethod === 'stripe' ? (
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full relative group h-14 rounded-xl font-bold text-black shadow-lg shadow-white/5 overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed bg-white hover:bg-slate-100"
                                            >
                                                <div className="relative z-10 flex items-center justify-center gap-2.5">
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            <span>Redirecting to Stripe...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-[15px] tracking-wide font-display">Start 14-day Free Trial</span>
                                                            <svg className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                        </>
                                                    )}
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="relative z-0">
                                                <PayPalButtons
                                                    style={{ layout: "vertical", shape: "rect", height: 55, color: 'blue', label: 'pay' }}
                                                    createOrder={createPayPalOrder}
                                                    onApprove={onPayPalApprove}
                                                    onClick={(_data, actions) => {
                                                        if (!termsAccepted) {
                                                            alert("Please accept the Terms of Use and Privacy Policy to proceed.");
                                                            return actions.reject();
                                                        }
                                                        return actions.resolve();
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex items-center gap-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5 hover:text-[#34D399] transition-colors cursor-default">
                                                    <Lock className="w-3 h-3" /> Encrypted
                                                </span>
                                                <span className="w-px h-3 bg-white/10"></span>
                                                <span className="flex items-center gap-1.5 hover:text-[#A78BFA] transition-colors cursor-default">
                                                    <ShieldCheck className="w-3 h-3" /> Secure Payment
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </PayPalScriptProvider>
    );
};

export default CheckoutPage;
