import React, { useState, useRef, useEffect } from 'react';
import {
    ShieldCheck,
    CheckCircle2,
    ChevronDown,
    CreditCard,
    Lock,
    Loader2,
    ArrowLeft,
    Mail,
    Globe,
    Search,
    Check
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const COUNTRIES = [
    "United States", "United Kingdom", "Germany", "Poland", "France",
    "Canada", "Australia", "Spain", "Italy", "Netherlands",
    "Sweden", "Ukraine", "Japan", "Brazil", "India"
];

// Stripe Element Styles to match the custom design
const ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '14px',
            color: '#e2e8f0', // text-slate-200
            '::placeholder': {
                color: '#475569', // text-slate-600
            },
            backgroundColor: 'transparent',
            fontFamily: 'Manrope, sans-serif',
        },
        invalid: {
            color: '#ef4444',
        },
    },
};

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInvoiceFields, setShowInvoiceFields] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);

        // Simulate processing or handle actual payment intent creation here
        // For now, we simulate a delay and then "success"
        const cardElement = elements.getElement(CardNumberElement);

        if (cardElement) {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    email: formData.email,
                    address: {
                        country: 'US', // Map formData.country to ISO code in real app
                    }
                }
            });

            if (error) {
                console.error('[error]', error);
                setIsSubmitting(false);
            } else {
                console.log('[PaymentMethod]', paymentMethod);
                // Simulate success delay
                setTimeout(() => {
                    setIsSubmitting(false);
                    // navigate('/success'); // or similar
                    alert("Payment method created successfully! (Test Mode)");
                    navigate('/');
                }, 2000);
            }
        }
    };

    const filteredCountries = COUNTRIES.filter(c =>
        c.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#05060B] text-slate-200 font-body selection:bg-purple-500/30">
            {/* Background Glows - Matching the Landing Page Vibes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Top center purple glow - subtle */}
                <div className="absolute top-[-10%] left-[30%] w-[50%] h-[50%] bg-[#7C3AED]/10 blur-[120px] rounded-full mix-blend-screen" />
                {/* Bottom right blue/purple glow */}
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
                    <ShieldCheck className="w-4 h-4 text-[#34D399]" /> {/* Neon Teal Accent */}
                    <span className="font-medium">Secure checkout</span>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24 pt-4">
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/')}
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

                                {/* Trial Reminder Block */}
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
                                    {[
                                        "Full report + deeper history",
                                        "Opponent Prep & Analysis",
                                        "AI Strategic Assistant",
                                        "Advanced breakdown exports"
                                    ].map((item, i) => (
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

                        <div className="flex items-center gap-3 px-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-[#05060B] bg-[#1F2937] flex items-center justify-center text-[10px] font-bold text-slate-300 shadow-lg">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Secure, Stripe-powered checkout</p>
                        </div>
                    </div>

                    {/* Right Column: Payment */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#11131F] border border-white/[0.06] rounded-3xl p-8 shadow-2xl relative">

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">

                                {/* Express Checkout */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Method</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" className="group relative h-12 bg-[#1A1D2B] hover:bg-[#232738] text-white border border-white/5 rounded-xl font-bold flex items-center justify-center transition-all cursor-not-allowed opacity-50" disabled>
                                            <span className="relative z-10 flex items-center gap-2">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.23 3.91-1.23 1.57.12 2.66.74 3.38 1.77-2.98 1.84-2.55 5.76.65 7.15-.65 1.84-1.6 3.63-3.02 4.54zM13.03 5.34c.75-1.07 1.25-2.52.88-4.09-1.2.14-2.69.84-3.53 1.87-.71.85-1.35 2.29-.91 3.79 1.35.1 2.82-.5 3.56-1.57z" /></svg>
                                                Pay (Soon)
                                            </span>
                                        </button>
                                        <button type="button" className="group h-12 bg-[#1A1D2B] hover:bg-[#232738] text-white border border-white/5 rounded-xl font-bold flex items-center justify-center transition-all cursor-not-allowed opacity-50" disabled>
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>
                                                Pay (Soon)
                                            </span>
                                        </button>
                                    </div>

                                    <div className="relative flex items-center py-3">
                                        <div className="flex-grow border-t border-white/5"></div>
                                        <span className="flex-shrink mx-4 text-slate-600 text-[10px] uppercase tracking-widest font-bold">Or pay with card</span>
                                        <div className="flex-grow border-t border-white/5"></div>
                                    </div>
                                </div>

                                {/* Billing Details */}
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 ml-1">Email address</label>
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

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 ml-1">Card details</label>
                                        <div className="relative group rounded-xl bg-[#0B0E14] border border-white/10 focus-within:border-[#7C3AED]/50 shadow-inner transition-all">
                                            {/* Card Number */}
                                            <div className="flex items-center border-b border-white/5 py-3.5">
                                                <CreditCard className="ml-4 w-4 h-4 text-slate-500 group-focus-within:text-[#A78BFA] transition-colors shrink-0" />
                                                <div className="w-full px-3">
                                                    <CardNumberElement options={ELEMENT_OPTIONS} />
                                                </div>
                                            </div>
                                            {/* Expiry & CVC */}
                                            <div className="flex divide-x divide-white/5">
                                                <div className="w-1/2 px-4 py-3.5">
                                                    <CardExpiryElement options={ELEMENT_OPTIONS} />
                                                </div>
                                                <div className="w-1/2 px-4 py-3.5">
                                                    <CardCvcElement options={ELEMENT_OPTIONS} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Searchable Country Dropdown */}
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

                                            {/* Dropdown Menu */}
                                            {isCountryOpen && (
                                                <div className="absolute z-50 mt-2 w-full bg-[#0B0E14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                                    {/* Search Input */}
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
                                                    {/* List */}
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
                                </div>

                                {/* Refined Invoice Toggle */}
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
                                        {/* Helper text moved below label */}
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
                                                <p className="text-[10px] text-slate-600 pl-1">Used for business invoices and tax compliance.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Area - High Contrast White Button */}
                                <div className="space-y-6 pt-2">
                                    <button
                                        type="submit"
                                        disabled={!stripe || isSubmitting}
                                        className="w-full relative group h-14 rounded-xl font-bold text-black shadow-lg shadow-white/5 overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed bg-white hover:bg-slate-100"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2.5">
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[15px] tracking-wide font-display">Start 14-day Free Trial</span>
                                                    <svg className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-xs text-slate-500 text-center max-w-sm leading-relaxed">
                                            By starting your trial, you agree to the <span className="text-slate-400 hover:text-white cursor-pointer underline decoration-slate-600/50 underline-offset-2 transition-colors">Terms of Service</span> and <span className="text-slate-400 hover:text-white cursor-pointer underline decoration-slate-600/50 underline-offset-2 transition-colors">Privacy Policy</span>. <br className="hidden sm:block" /> Renews at €15/month after {trialDate}. Cancel anytime.
                                        </p>
                                        <div className="flex items-center gap-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 hover:text-[#34D399] transition-colors cursor-default">
                                                <Lock className="w-3 h-3" /> Encrypted
                                            </span>
                                            <span className="w-px h-3 bg-white/10"></span>
                                            <span className="flex items-center gap-1.5 hover:text-[#A78BFA] transition-colors cursor-default">
                                                <ShieldCheck className="w-3 h-3" /> Stripe Secure
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
    );
};

const CheckoutPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default CheckoutPage;
