
import { FONTS } from '../../constants/theme';
import { Brain, Target, TrendingUp, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface WhySectionProps {
    onRegister?: () => void;
}

const WhySection = ({ onRegister }: WhySectionProps) => (
    <section id="analytics" className="py-16 md:py-40 relative z-10">
        <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="mb-10 md:mb-20 flex flex-col items-center text-center gap-4 md:gap-6">
                <h2 className={`${FONTS.h1} text-white`}>Why White Knight Analytics</h2>
                <p className={`text-lg md:text-2xl text-slate-400 max-w-4xl ${FONTS.body} leading-relaxed`}>
                    Generic chess advice "stop blundering" doesn't work. We analyze <i>your</i> games to find the specific patterns holding <i>you</i> back.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-10 md:mb-20">
                {[
                    { icon: <Target className="text-violet-400" size={32} />, title: 'Personalized Plans', desc: 'No cookie-cutter lessons. Your training is based 100% on your actual mistakes.' },
                    { icon: <Brain className="text-fuchsia-400" size={32} />, title: 'Psychology & Habits', desc: 'We track tilt, time trouble, and resignation habits — not just moves.' },
                    { icon: <TrendingUp className="text-emerald-400" size={32} />, title: 'Coach-Ready Reports', desc: 'Get a professional PDF report you can send to a coach or use for self-study.' }
                ].map((item, i) => (
                    <GlassCard key={i} className="p-6 md:p-10 hover:bg-white/10 transition-colors group">
                        <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/10">
                            {item.icon}
                        </div>
                        <h3 className={`font-display text-xl md:text-3xl font-bold tracking-tight text-white mb-4 md:mb-6`}>{item.title}</h3>
                        <p className={`text-base md:text-xl text-slate-400 ${FONTS.body}`}>{item.desc}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Sample Report Preview */}
            <div className="mb-12 md:mb-24 relative p-1 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-indigo-500/30">
                <div className="absolute inset-0 blur-3xl bg-violet-600/20" />
                <div className="bg-[#0A0F1C] rounded-[1.5rem] md:rounded-[2.3rem] p-5 md:p-12 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" /><div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500/20 text-indigo-300 px-6 py-2 rounded-b-xl text-sm font-bold border-b border-x border-indigo-500/30">SAMPLE REPORT PREVIEW</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                        <div className="text-center md:text-left">
                            <div className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-4">Top Patterns</div>
                            <div className="space-y-3">
                                <div className="text-white font-bold text-lg flex items-center gap-2"><span className="text-red-500 font-mono">1</span> Endgame Conversion Issues (Critical)</div>
                                <div className="text-slate-300 font-medium text-lg flex items-center gap-2"><span className="text-amber-500 font-mono">2</span> Time Trouble Decisions (High)</div>
                                <div className="text-slate-500 font-medium text-lg flex items-center gap-2"><span className="text-slate-500 font-mono">3</span> Opening Accuracy Drop (Medium)</div>
                            </div>
                        </div>
                        <div className="md:border-x border-white/10 px-4 text-center md:text-left">
                            <div className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-4">Coach Session Plan</div>
                            <div className="text-white font-bold text-lg mb-2">Theme: Endgame Conversion</div>
                            <div className="text-emerald-400 mb-4 text-sm font-bold uppercase">Review: 4 critical moments</div>
                            <div className="text-slate-300 text-sm mb-2"><span className="text-slate-500 font-bold">Fix:</span> recurring time-trouble decision pattern</div>
                            <div className="text-slate-300 text-sm"><span className="text-slate-500 font-bold">Coach notes:</span> what to focus on next session</div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-4">Coaching Add-On (Optional)</div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">GM</div>
                                <div>
                                    <div className="text-white font-bold">GM Alex Smith</div>
                                    <div className="text-xs text-slate-500">Endgame Specialist</div>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm italic">"Let's fix that rook ending pattern this Tuesday."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Steps */}
            <div className="border-t border-white/10 pt-16">
                <h3 className={`text-center text-white mb-12 ${FONTS.h2}`}>How It Works</h3>
                <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-4 md:gap-12 mb-8 md:mb-10">
                    {[
                        { step: 1, text: 'Import Games (Chess.com/Lichess/PGN)' },
                        { step: 2, text: 'Engine Analyzing (cloud-based)' },
                        { step: 3, text: 'Get Your Personal Plan' }
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/30 border border-white/20">
                                {step.step}
                            </div>
                            <span className="text-base md:text-xl text-slate-300 font-medium">{step.text}</span>
                            {i < 2 && <ArrowRight className="text-slate-600 hidden md:block" />}
                        </div>
                    ))}
                </div>
                <p className="text-center text-slate-400 text-xl mb-12">Your report is built from your real games. Coaching is optional.</p>

                <div className="text-center">
                    <button
                        onClick={onRegister}
                        className={`px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 transition-all hover:-translate-y-1 ${FONTS.body}`}
                    >
                        Get a Free Report
                    </button>
                </div>
            </div>
        </div>
    </section>
);

export default WhySection;
