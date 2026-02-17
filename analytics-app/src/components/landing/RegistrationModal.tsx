import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { GoogleIcon, AppleIcon } from '../ui/Icons';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
    onSwitchToRegister: () => void;
    mode: 'login' | 'register';
}

const RegistrationModal = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister, mode = 'register' }: RegistrationModalProps) => {
    const [step, setStep] = useState(1); // 1: Input, 2: Verification
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaChecked, setCaptchaChecked] = useState(false);
    const [loginError, setLoginError] = useState(false);

    // Reset internal state when modal opens or mode changes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setLoginError(false);
            setCaptchaChecked(false);
            setEmail('');
        }
    }, [isOpen, mode]);

    if (!isOpen) return null;

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaChecked) return;

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);

            // SIMULATED CHECK: If logging in and email is "new@example.com", show error
            if (mode === 'login' && email.toLowerCase() === 'new@example.com') {
                setLoginError(true);
            } else {
                setStep(2);
            }
        }, 1000);
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onLoginSuccess();
        }, 1500);
    };

    const inputClass = "w-full bg-[#131B2C] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:border-violet-500 focus:bg-[#1A2336] focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all duration-200 hover:border-white/20";

    const title = mode === 'login' ? "Welcome Back" : "Get Started";
    const subtitle = mode === 'login'
        ? "Log in to access your dashboard."
        : "Create an account to access your dashboard, insights, and optional coaching.";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14]/90 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#0F1623] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl my-8 ring-1 ring-white/5 animate-fade-in">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"><X /></button>

                <div className="mb-8 text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">
                        {step === 1 ? title : "Check Your Email"}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                        {step === 1 ? subtitle : `We sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">

                        {loginError ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center animate-fade-in">
                                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
                                    <AlertCircle size={24} />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-2">Account Not Found</h4>
                                <p className="text-slate-400 text-sm mb-6">We couldn't find an account with that email address.</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={onSwitchToRegister}
                                        className="w-full py-3 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-200 transition-colors"
                                    >
                                        Create New Account
                                    </button>
                                    <button
                                        onClick={() => setLoginError(false)}
                                        className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* Fake Captcha */}
                                    <div className="bg-[#F9F9F9] rounded-lg p-3 flex items-center justify-between border border-[#D3D3D3] shadow-inner select-none w-full sm:w-[240px] mx-auto sm:mx-0">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => setCaptchaChecked(!captchaChecked)}
                                                className={`w-6 h-6 border-2 rounded-sm cursor-pointer flex items-center justify-center bg-white transition-colors ${captchaChecked ? 'border-transparent' : 'border-[#C1C1C1] hover:border-[#B2B2B2]'}`}
                                            >
                                                {captchaChecked && <Check size={20} className="text-[#009688]" strokeWidth={4} />}
                                            </div>
                                            <span className="text-sm font-medium text-[#222]">I'm not a robot</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-6 h-6 relative opacity-70">
                                                <div className="absolute inset-0 border-2 border-[#4A90E2] rounded-full animate-spin border-t-transparent" style={{ animationDuration: '3s' }}></div>
                                                <div className="absolute inset-1 bg-[#4A90E2] rounded-full"></div>
                                            </div>
                                            <span className="text-[8px] text-[#555] mt-1">reCAPTCHA</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !captchaChecked}
                                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${captchaChecked ? 'bg-violet-600 hover:bg-violet-500 text-white hover:-translate-y-0.5' : 'bg-[#1A2336] text-slate-500 cursor-not-allowed'}`}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"} <ArrowRight size={20} />
                                    </button>
                                </form>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-white/10"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Or continue with</span>
                                    <div className="flex-grow border-t border-white/10"></div>
                                </div>

                                {/* Social Buttons (Disabled) */}
                                <div className="grid grid-cols-1 gap-3">
                                    <button disabled className="flex items-center justify-center gap-3 bg-[#131B2C] text-slate-500 font-bold py-3 rounded-xl border border-white/5 cursor-not-allowed opacity-60 transition-colors">
                                        <GoogleIcon /> Continue with Google <span className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded ml-1 border border-white/5">(Soon)</span>
                                    </button>
                                    <button disabled className="flex items-center justify-center gap-3 bg-[#131B2C] text-slate-500 font-bold py-3 rounded-xl border border-white/5 cursor-not-allowed opacity-60 transition-colors">
                                        <AppleIcon /> Continue with Apple <span className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded ml-1 border border-white/5">(Soon)</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide text-center">Verification Code</label>
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        className="w-10 h-12 md:w-12 md:h-14 bg-[#131B2C] border border-white/10 rounded-xl text-center text-white text-xl font-bold focus:border-violet-500 focus:bg-[#1A2336] focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                                    />
                                ))}
                            </div>
                            <p className="text-center text-xs text-slate-500">Didn't receive it? <button type="button" className="text-violet-400 hover:text-white underline font-bold">Resend</button></p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0F1623] py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Verify & Login"}
                        </button>

                        <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 hover:text-white text-sm font-bold flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Back to Email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegistrationModal;
