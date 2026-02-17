
import { useNavigate } from 'react-router-dom';
import { FONTS } from '../../constants/theme';
import { ArrowUpRight, PlayCircle, Clock, Lock, ShieldCheck, TrendingUp, TrendingDown, Check } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const HeroSection = () => {
    const navigate = useNavigate();
    return (

        <section id="top" className="relative min-h-[85vh] md:min-h-[95vh] flex items-center pt-24 md:pt-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[#080C14]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#080C14] to-[#080C14]" />
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-600/10 to-transparent opacity-30" />
            </div>

            <div className="w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 relative z-10 items-center">
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-8 animate-fade-in">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className={`text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider ${FONTS.label}`}>ENGINE INSIGHTS — COACH-READY</span>
                        </div>
                    </div>
                    <h1 className={`${FONTS.h1.replace('lg:text-7xl', 'lg:text-6xl')} text-white leading-[1.05] mb-8 drop-shadow-2xl`}>
                        Turn Chess Games
                        <span className="block">Into a Coach-Ready</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 animate-gradient-x block">Improvement Plan</span>
                    </h1>

                    <p className={`text-base md:text-2xl text-slate-300 mb-6 md:mb-8 max-w-2xl ${FONTS.body} leading-relaxed`}>
                        Connect your Chess.com or Lichess account — or upload a PGN file. We analyze your real games, reveal your recurring patterns, and turn them into a coach-ready plan you can act on.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <button onClick={() => navigate('/checkout')} className={`w-full sm:w-auto px-10 py-4 md:py-5 rounded-full bg-white text-slate-900 font-bold text-lg md:text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group`}>
                            Start 14-Day Free Trial
                            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <button className={`w-full sm:w-auto px-10 py-4 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg md:text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md`}>
                            <PlayCircle size={24} />
                            Watch 60-sec Demo
                        </button>
                    </div>
                    <div className="hidden lg:flex flex-col gap-2 mt-4">
                        <div className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                            <Clock size={16} className="text-emerald-500" />
                            Takes ~60 seconds. No charge for the Starter Report.
                        </div>
                        <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            <Lock size={16} className="text-emerald-500" />
                            We never ask for your password.
                        </div>
                        <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            Your games stay private. Cancel anytime.
                        </div>
                    </div>
                </div>

                {/* Floating 3D Element */}
                <div className="relative h-[800px] hidden lg:flex items-center justify-center perspective-1000 w-full pointer-events-none">
                    <div className="relative w-full h-full flex items-center justify-center">

                        <GlassCard className="w-[85%] max-w-[480px] p-8 z-20 animate-float-slow bg-[#0F1623]/90 border-white/10 pointer-events-auto shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden relative">
                            {/* Knight Watermark */}
                            <div className="absolute -bottom-20 -right-20 text-[400px] text-white opacity-[0.05] transform rotate-12 pointer-events-none select-none font-serif leading-none z-0">
                                ♞
                            </div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[3px]">
                                            <div className="w-full h-full rounded-full bg-[#0F1623] flex items-center justify-center text-lg font-bold text-white">JD</div>
                                        </div>
                                        <div>
                                            <div className={`text-2xl font-bold text-white ${FONTS.h2} !text-2xl`}>John Doe</div>
                                            <div className={`text-lg text-slate-400 ${FONTS.body}`}>Rapid 1450</div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-sm font-bold flex items-center gap-2">
                                        <TrendingUp size={18} /> +12
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {/* 1. Biggest Leak */}
                                    <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/5 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10">
                                            <div className={`text-slate-500 mb-2 ${FONTS.label}`}>Biggest Leak</div>
                                            <div className="flex flex-wrap justify-between items-end gap-3 mb-3">
                                                <span className={`text-white font-bold text-3xl ${FONTS.h2} !text-3xl`}>Endgame</span>
                                                <span className="text-red-400 font-bold text-xs bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 uppercase tracking-wide">Critical</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="w-[35%] h-full bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Opening Accuracy */}
                                    <div className="p-6 rounded-[1.5rem] bg-amber-500/5 backdrop-blur-sm border border-amber-500/20 flex items-center justify-between relative overflow-hidden group shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10">
                                            <div className={`text-slate-500 mb-1 ${FONTS.label}`}>Opening Accuracy</div>
                                            <div className={`text-5xl font-bold text-white ${FONTS.kpi}`}>67%</div>
                                            <div className="text-xs text-slate-400 mt-1 font-medium">Win Rate</div>
                                        </div>
                                        <div className="text-right relative z-10">
                                            <div className={`text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2`}>To Improve</div>
                                            <div className="inline-flex p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                                                <TrendingDown size={28} className="text-amber-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Coach Match */}
                                    <div className="p-6 rounded-[1.5rem] bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 relative overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-100 transition-opacity" />
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className={`text-emerald-400 font-bold ${FONTS.label}`}>Coach Match (Optional)</div>
                                                <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">MATCH</div>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold">GM</div>
                                                    <div className={`text-xl font-bold text-white ${FONTS.h2} !text-xl`}>GM Alex Smith</div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.6)] border-2 border-emerald-300">
                                                    <Check size={22} className="text-[#0F1623] stroke-[3px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
