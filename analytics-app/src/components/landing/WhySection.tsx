
import { FONTS } from '../../constants/theme';
import { Brain, Target, TrendingUp, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface WhySectionProps {
    onRegister?: () => void;
}

const WhySection = ({ onRegister }: WhySectionProps) => (
    <section id="analytics" className="py-16 md:py-40 relative z-10">
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24">
            <div className="mb-10 md:mb-20 flex flex-col items-center text-center gap-4 md:gap-6">
                <h2 className={`${FONTS.h1} text-white`}>Why White Knight Analytics</h2>
                <p className={`text-lg md:text-2xl text-slate-400 max-w-4xl ${FONTS.body} leading-relaxed`}>
                    Generic chess advice "stop blundering" doesn't work. We analyze <i>your</i> games to find the specific patterns holding <i>you</i> back.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mb-10 md:mb-20">
                {[
                    { icon: <Target className="text-violet-400" size={32} />, title: 'Personalized Plans', desc: 'No cookie-cutter lessons. Your training is based 100% on your actual mistakes.' },
                    { icon: <Brain className="text-fuchsia-400" size={32} />, title: 'Psychology & Habits', desc: 'We track tilt, time trouble, and resignation habits — not just moves.' },
                    { icon: <TrendingUp className="text-emerald-400" size={32} />, title: 'Coach-Ready Reports', desc: 'Get a professional PDF report you can send to a coach or use for self-study.' }
                ].map((item, i) => (
                    <GlassCard key={i} className="p-6 lg:p-8 xl:p-10 transition-colors glass-card-hover">
                        <div className="icon-box mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shadow-violet-500/10">
                            {item.icon}
                        </div>
                        <h3 className={`font-display text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-white mb-4 md:mb-6`}>{item.title}</h3>
                        <p className={`text-base lg:text-lg xl:text-xl text-slate-400 ${FONTS.body}`}>{item.desc}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Sample Report Preview */}
            <div className="mb-12 md:mb-24 relative p-1 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-indigo-500/30 overflow-hidden">
                <div className="absolute inset-0 blur-3xl bg-violet-600/20" />
                <div className="bg-[#0A0F1C] rounded-[1.5rem] md:rounded-[2.3rem] p-5 md:p-12 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500/20 text-indigo-300 px-6 py-2 rounded-b-xl text-xs md:text-sm font-bold border-b border-x border-indigo-500/30 whitespace-nowrap">SAMPLE PREVIEW</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:gap-8 mt-8 md:mt-6">
                        {/* 1. TOP PATTERNS */}
                        <div className="text-left relative">
                            <div className="text-slate-400 text-[10px] md:text-sm uppercase font-bold tracking-wider mb-4 md:mb-4 text-center md:text-left">Top Patterns</div>
                            <div className="space-y-4 md:space-y-4 px-2 md:px-0">
                                {/* Item 1 */}
                                <div className="flex items-start gap-3 md:gap-4 text-left">
                                    <div className="text-red-500 font-display font-bold text-xl md:text-xl leading-none mt-1">1</div>
                                    <div>
                                        <div className="text-white font-bold text-base md:text-lg leading-tight mb-0.5 md:mb-1">Endgame Conversion Issues</div>
                                        <div className="text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">(Critical)</div>
                                    </div>
                                </div>
                                {/* Item 2 */}
                                <div className="flex items-start gap-3 md:gap-4 text-left">
                                    <div className="text-amber-500 font-display font-bold text-xl md:text-xl leading-none mt-1">2</div>
                                    <div>
                                        <div className="text-slate-200 font-bold text-base md:text-base leading-tight mb-0.5">Time Trouble Decisions</div>
                                        <div className="text-amber-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">(High)</div>
                                    </div>
                                </div>
                                {/* Item 3 */}
                                <div className="flex items-start gap-3 md:gap-4 text-left opacity-80 decoration-slate-500">
                                    <div className="text-slate-500 font-display font-bold text-xl md:text-xl leading-none mt-1">3</div>
                                    <div>
                                        <div className="text-slate-300 font-medium text-base md:text-base leading-tight mb-0.5">Opening Accuracy Drop</div>
                                        <div className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">(Medium)</div>
                                    </div>
                                </div>
                            </div>
                            {/* Mobile Divider */}
                            <div className="md:hidden w-full h-px bg-white/5 mt-6" />
                        </div>

                        {/* 2. COACH SESSION PLAN */}
                        <div className="md:border-x border-white/10 px-0 md:px-6 text-left relative">
                            <div className="text-slate-400 text-[10px] md:text-sm uppercase font-bold tracking-wider mb-4 md:mb-4 text-center md:text-left">Coach Session Plan</div>
                            <div className="px-2 md:px-0">
                                <div className="text-white font-bold text-lg md:text-lg mb-2 text-center md:text-left">Theme: Endgame Conversion</div>
                                <div className="flex justify-center md:justify-start mb-4">
                                    <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                        Review: 4 critical moments
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-3 text-sm bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-white/5 md:border-none">
                                    <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                                        <span className="text-slate-400 md:text-slate-500 font-bold min-w-[30px] uppercase text-[10px] md:text-sm md:normal-case mt-0.5 md:mt-0">Fix:</span>
                                        <span className="text-slate-200 md:text-slate-300 text-xs md:text-sm">recurring time-trouble decision pattern</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                                        <span className="text-slate-400 md:text-slate-500 font-bold min-w-[85px] whitespace-nowrap uppercase text-[10px] md:text-sm md:normal-case mt-0.5 md:mt-0">Coach notes:</span>
                                        <span className="text-slate-200 md:text-slate-300 text-xs md:text-sm">what to focus on next session</span>
                                    </div>
                                </div>
                            </div>
                            {/* Mobile Divider */}
                            <div className="md:hidden w-full h-px bg-white/5 mt-6" />
                        </div>

                        {/* 3. COACHING ADD-ON */}
                        <div className="text-left">
                            <div className="text-slate-400 text-[10px] md:text-sm uppercase font-bold tracking-wider mb-4 md:mb-4 text-center md:text-left">Coaching Add-On (Optional)</div>
                            <div className="px-2 md:px-0">
                                <div className="bg-indigo-500/10 md:bg-transparent rounded-xl p-3 md:p-0 border border-indigo-500/20 md:border-none">
                                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                                        <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg shadow-indigo-600/20">GM</div>
                                        <div>
                                            <div className="text-white font-bold text-sm md:text-base">GM Alex Smith</div>
                                            <div className="text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-wide">Endgame Specialist</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 md:text-slate-400 text-xs md:text-sm italic">"Let's fix that rook ending pattern this Tuesday."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Steps */}
            <div className="border-t border-white/10 pt-16">
                <h3 className={`text-center text-white mb-12 ${FONTS.h2}`}>How It Works</h3>
                <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-4 md:gap-6 lg:gap-8 xl:gap-12 mb-8 md:mb-10">
                    {[
                        { step: 1, text: 'Import Games (Chess.com/Lichess/PGN)' },
                        { step: 2, text: 'Engine Analyzing (cloud-based)' },
                        { step: 3, text: 'Get Your Personal Plan' }
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/30 border border-white/20">
                                {step.step}
                            </div>
                            <span className="text-base lg:text-lg xl:text-xl text-slate-300 font-medium">{step.text}</span>
                            {i < 2 && <ArrowRight className="text-slate-600 hidden md:block" />}
                        </div>
                    ))}
                </div>
                <p className="text-center text-slate-400 text-xl mb-12">Your report is built from your real games. Coaching is optional.</p>

                <div className="text-center">
                    <button
                        onClick={onRegister}
                        className={`px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 transition-all hover:-translate-y-1 btn-premium ${FONTS.body}`}
                    >
                        Get a Free Report
                    </button>
                </div>
            </div>
        </div>
    </section>
);

export default WhySection;
