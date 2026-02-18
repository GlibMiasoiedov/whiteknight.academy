import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, CheckCircle, ChevronDown } from 'lucide-react';

const CoachApplicationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);



    useEffect(() => {
        if (isOpen) {
            // Lock scroll
            document.body.style.overflow = 'hidden';

            // Push history state to support back button closing
            window.history.pushState({ modalOpen: true }, '');

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };

            const handlePopState = () => {
                onClose();
            };

            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('popstate', handlePopState);

            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    const inputClass = "w-full bg-[#131B2C] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:border-violet-500 focus:bg-[#1A2336] focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all duration-200 hover:border-white/20";
    const labelClass = "block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide";

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14]/90 backdrop-blur-md">
                <div className="bg-[#0F1623] border border-white/10 rounded-3xl w-full max-w-lg p-12 text-center relative shadow-2xl animate-fade-in">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"><X /></button>
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Application Sent!</h3>
                    <p className="text-slate-400 mb-8 text-lg">Thanks — we’ll review your application and email you next steps.</p>
                    <button onClick={onClose} className="bg-white text-slate-900 px-10 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-lg">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14]/90 backdrop-blur-md overflow-hidden">
            {/* Added max-h and overflow-y-auto for mobile scrolling within the modal */}
            <div className="bg-[#0F1623] border border-white/10 rounded-3xl w-full max-w-2xl p-6 md:p-10 relative shadow-2xl my-4 animate-fade-in ring-1 ring-white/5 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors z-10"><X /></button>

                <div className="mb-10 text-center">
                    <h3 className="text-3xl font-bold text-white mb-3">Apply as a Coach</h3>
                    <p className="text-slate-400 text-base">Join White Knight Academy to teach faster and track progress.</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${s === step ? 'bg-violet-600 border-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]' : s < step ? 'bg-emerald-500 border-emerald-500 text-[#0F1623]' : 'bg-[#131B2C] border-white/10 text-slate-500'}`}>
                                {s < step ? <Check size={18} strokeWidth={3} /> : s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 mx-2 rounded-full ${s < step ? 'bg-emerald-500' : 'bg-white/10'}`}></div>}
                        </div>
                    ))}
                </div>

                <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>

                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <h4 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">Identity & Links</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input placeholder="John Doe" required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input placeholder="john@example.com" type="email" required className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Location</label>
                                    <input placeholder="City, Country" required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Timezone</label>
                                    <input placeholder="UTC-5 (EST)" required className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Languages Spoken</label>
                                <input placeholder="English, Spanish, French..." required className={inputClass} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Chess.com User</label>
                                    <input placeholder="Username (Optional)" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Lichess User</label>
                                    <input placeholder="Username (Optional)" className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>FIDE Profile</label>
                                    <input placeholder="FIDE ID or Link" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Title</label>
                                    <div className="relative">
                                        <select className={`${inputClass} appearance-none cursor-pointer`}>
                                            <option value="" className="bg-[#0F1623] text-slate-400">Select Title (Optional)</option>
                                            <option value="None" className="bg-[#0F1623] text-white">None</option>
                                            <option value="CM" className="bg-[#0F1623] text-white">CM - Candidate Master</option>
                                            <option value="FM" className="bg-[#0F1623] text-white">FM - FIDE Master</option>
                                            <option value="IM" className="bg-[#0F1623] text-white">IM - International Master</option>
                                            <option value="GM" className="bg-[#0F1623] text-white">GM - Grandmaster</option>
                                            <option value="WCM" className="bg-[#0F1623] text-white">WCM</option>
                                            <option value="WFM" className="bg-[#0F1623] text-white">WFM</option>
                                            <option value="WIM" className="bg-[#0F1623] text-white">WIM</option>
                                            <option value="WGM" className="bg-[#0F1623] text-white">WGM</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            <h4 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">Coaching Fit</h4>

                            <div>
                                <label className={labelClass}>Who do you want to coach?</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Kids 7-9', 'Kids 10-12', 'Kids 13-14', 'Teens 15-18', 'Adults'].map(opt => (
                                        <label key={opt} className="inline-flex items-center gap-3 bg-[#131B2C] px-4 py-3 rounded-xl cursor-pointer hover:bg-[#1A2336] border border-white/10 hover:border-violet-500/50 transition-all select-none">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-600 text-violet-600 focus:ring-violet-500 bg-[#0F1623]" />
                                            <span className="text-white font-medium">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Student Levels</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Beginner', 'Intermediate', 'Advanced', 'Competitive'].map(opt => (
                                        <label key={opt} className="inline-flex items-center gap-3 bg-[#131B2C] px-4 py-3 rounded-xl cursor-pointer hover:bg-[#1A2336] border border-white/10 hover:border-violet-500/50 transition-all select-none">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-600 text-violet-600 focus:ring-violet-500 bg-[#0F1623]" />
                                            <span className="text-white font-medium">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Experience Coaching</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['No experience', '1-2 years', '3-5 years', '5+ years'].map(opt => (
                                        <label key={opt} className="flex items-center justify-center gap-2 cursor-pointer bg-[#131B2C] py-3 rounded-xl border border-white/10 hover:bg-[#1A2336] hover:border-violet-500/50 transition-all">
                                            <input type="radio" name="exp" className="text-violet-600 focus:ring-violet-500 bg-[#0F1623]" />
                                            <span className="text-sm font-medium text-white">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <h4 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">Logistics & Proof</h4>

                            <div>
                                <label className={labelClass}>Short Bio</label>
                                <textarea placeholder="Tell us about yourself and your chess journey (Max 500 chars)" required rows={3} className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Teaching Approach</label>
                                <textarea placeholder="What does your first lesson look like?" required rows={3} className={inputClass} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Availability</label>
                                    <input placeholder="e.g. Weekends 10am-2pm EST" required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Hourly Rate (USD)</label>
                                    <input placeholder="Optional (e.g. $30-50)" className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Intro Video</label>
                                <input placeholder="YouTube/Vimeo Link (Highly Recommended)" className={inputClass} />
                            </div>

                            <div className="bg-violet-500/5 p-4 rounded-xl border border-violet-500/20 mt-4">
                                <div className="space-y-3">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" required className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-600 bg-[#0F1623] transition-all checked:border-violet-500 checked:bg-violet-500" />
                                            <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors leading-tight pt-0.5">I agree to the Coach Code of Conduct and verify my profile information is accurate.</span>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" required className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-600 bg-[#0F1623] transition-all checked:border-violet-500 checked:bg-violet-500" />
                                            <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                        </div>
                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors leading-tight pt-0.5">I understand I may work with minors and will follow safety rules.</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-white font-bold px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Back</button>
                        ) : <div></div>}

                        <button type="submit" disabled={isSubmitting} className="bg-white hover:bg-slate-200 text-[#0F1623] px-10 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 text-lg transform hover:-translate-y-0.5">
                            {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Sending...</> : step === 3 ? "Submit Application" : "Next Step"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoachApplicationModal;
