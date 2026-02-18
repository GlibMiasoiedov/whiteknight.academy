import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Download, Mail } from 'lucide-react';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    // Optional: confetti or some animation effect on mount
    useEffect(() => {
        // You could trigger a confetti library here if installed
    }, []);

    return (
        <div className="min-h-screen bg-[#05060B] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[30%] w-[50vw] h-[50vw] bg-[#7C3AED]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#34D399]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full">
                <div className="bg-[#11131F] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center backdrop-blur-sm">

                    {/* Success Icon Animation */}
                    <div className="mb-8 relative inline-block">
                        <div className="w-20 h-20 bg-[#34D399]/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <div className="w-16 h-16 bg-[#34D399] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                                <CheckCircle2 className="w-10 h-10 text-[#05060B]" strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight font-display">
                        Payment Successful!
                    </h1>

                    <p className="text-slate-400 text-lg mb-8 leading-relaxed font-body">
                        Welcome to <span className="text-white font-medium">White Knight Analytics</span>. Your 14-day free trial has started.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="bg-[#1A1D2B] rounded-xl p-4 border border-white/5 flex items-start gap-3 text-left">
                            <Mail className="w-5 h-5 text-[#A78BFA] shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-medium text-sm">Check your email</h3>
                                <p className="text-slate-500 text-xs mt-1">We've sent you a receipt and login details to access your dashboard.</p>
                            </div>
                        </div>
                        <div className="bg-[#1A1D2B] rounded-xl p-4 border border-white/5 flex items-start gap-3 text-left">
                            <Download className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-medium text-sm">Download the App (Optional)</h3>
                                <p className="text-slate-500 text-xs mt-1">For the best experience, install our desktop app from the dashboard.</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/wizard')}
                        className="w-full py-4 bg-white hover:bg-slate-100 text-[#05060B] rounded-xl font-bold text-lg shadow-lg shadow-white/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 font-display"
                    >
                        Go to Onboarding <ArrowRight className="w-5 h-5" />
                    </button>

                </div>

                <p className="text-center text-slate-600 text-xs mt-8">
                    Need help? <a href="mailto:support@whiteknight.academy" className="text-slate-500 hover:text-white underline decoration-slate-600 underline-offset-2">Contact Support</a>
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
