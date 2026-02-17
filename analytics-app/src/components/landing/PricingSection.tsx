import { useNavigate } from 'react-router-dom';
import { FONTS } from '../../constants/theme';
import { Check, CheckCircle, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const PricingSection = ({ onRegister }: { onRegister?: () => void }) => {
    const navigate = useNavigate();
    return (
        <section id="pricing" className="py-16 md:py-20 relative z-10">
            <div className="w-full px-6 md:px-12 lg:px-24">
                <h2 className={`${FONTS.h1} text-center text-white mb-12 md:mb-24`}>Simple Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-12 md:mb-24">
                    {/* Free Tier */}
                    <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/5 text-slate-300 relative z-0">
                        <div className="text-2xl font-bold text-white mb-2">Starter Report</div>
                        <div className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Free</div>
                        <p className="text-slate-400 mb-8 md:mb-10 text-lg">See your top 3 mistakes and one recommended focus area.</p>
                        <ul className={`space-y-4 md:space-y-6 mb-8 md:mb-12 text-base md:text-lg ${FONTS.body}`}>
                            <li className="flex items-center gap-3"><Check className="text-slate-500" /> 1-Click Game Import</li>
                            <li className="flex items-center gap-3"><Check className="text-slate-500" /> Basic Mistake Analysis</li>
                            <li className="flex items-center gap-3"><Check className="text-slate-500" /> 1 Recommended Focus Area</li>
                        </ul>
                        <button onClick={onRegister} className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10">
                            Get Free Report
                        </button>
                    </div>

                    {/* Pro Tier (Winner) */}
                    <GlassCard className="p-6 md:p-14 ring-1 ring-violet-500/50 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 shadow-2xl relative z-10 transform md:scale-105">
                        <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl shadow-lg">RECOMMENDED</div>
                        <h3 className={`text-2xl font-bold text-white mb-3 mt-8 md:mt-0 flex items-center gap-3 ${FONTS.h2}`}>Pro</h3>
                        <div className="flex items-baseline gap-3 mb-4"><span className="text-5xl md:text-7xl font-bold text-white font-display">€15</span><span className="text-slate-400 font-medium">/ month</span></div>
                        <p className="text-violet-200 mb-10 text-lg">Full diagnostic, coach-ready plan, and weekly tracking.</p>

                        <ul className={`space-y-4 md:space-y-6 mb-8 md:mb-12 text-white font-medium text-base md:text-lg ${FONTS.body}`}>
                            <li className="flex items-center gap-3"><CheckCircle className="text-emerald-400" /> Full Game Analysis (Unlimited)</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-emerald-400" /> 3-Step Training Plan</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-emerald-400" /> Progress Tracking Dashboard</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-emerald-400" /> Opening Repertoire Fixes</li>
                        </ul>
                        <button onClick={() => navigate('/checkout')} className="w-full py-5 rounded-xl bg-white text-slate-900 font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                            Start 14-Day Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center text-slate-400 text-sm mt-4 font-medium">Cancel anytime. 100% money-back guarantee.</p>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
