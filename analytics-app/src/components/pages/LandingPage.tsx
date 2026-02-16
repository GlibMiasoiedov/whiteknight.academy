
import React, { useState, useEffect } from 'react';
import {
    Activity, Check, Clock, Lock, Target, TrendingUp, ArrowUpRight, Brain, Play, TrendingDown, ArrowRight, ShieldCheck, Crosshair, BookOpen, Trophy, Users, X, ChevronDown, ChevronUp, Loader2, Crown, AlertTriangle, ArrowLeft, CheckCircle, Command, Instagram, Youtube, Facebook, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FONTS } from '../../constants/theme';

// --- CUSTOM ICONS (SVG) ---
const AppleIcon = () => (
    <svg viewBox="0 0 384 512" fill="currentColor" width="20" height="20">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
    </svg>
);

const PlayStoreIcon = () => (
    <svg viewBox="0 0 512 512" fill="currentColor" width="20" height="20">
        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
);





const TikTokIcon = () => (
    <svg viewBox="0 0 448 512" fill="currentColor" width="20" height="20">
        <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
);

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

// --- STYLES & FONTS ---
// FONTS imported from theme.ts

// --- COMPONENTS ---

const Navbar = ({ onRegister, onLogin }: { onRegister: () => void, onLogin: () => void }) => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300">
            <div className="absolute inset-0 bg-[#080C14]/80 backdrop-blur-xl border-b border-white/5 shadow-lg" />
            <div className="w-full px-6 md:px-12 lg:px-24 h-24 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white border border-white/10 shadow-lg shadow-violet-500/20">
                        <Command size={24} />
                    </div>
                    <span className={`${FONTS.logo} text-white`}>White Knight Analytics</span>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                    {[
                        { label: 'Analytics', id: 'analytics' },
                        { label: 'Opponent Prep', id: 'opponent-prep' },
                        { label: 'Coaching', id: 'coaching' },
                        { label: 'Beginners', id: 'beginners' },
                        { label: 'Pricing', id: 'pricing' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`px-6 py-3 text-lg ${FONTS.body} text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={onLogin} className={`text-lg font-semibold text-slate-300 hover:text-white px-6 py-3 ${FONTS.body}`}>Log in</button>
                    <button onClick={onRegister} className="hidden md:flex group relative px-8 py-3.5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5 border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all" />
                        <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
                        <span className={`relative text-white text-lg font-bold flex items-center gap-2 ${FONTS.body}`}>
                            Get a Free Report
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl ${className}`}>
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
    </div>
);

// const BackgroundMesh = () => (
//   <div className="fixed inset-0 z-0 pointer-events-none bg-[#080C14]">
//       <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-slow" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[100px]" />
//       <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-fuchsia-600/5 rounded-full blur-[80px]" />
//   </div>
// );

// --- HERO SECTION ---

const HeroSection = () => {
    const navigate = useNavigate();
    return (

        <section id="top" className="relative min-h-[95vh] flex items-center pt-32 overflow-hidden">
            <div className="w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10 items-center">
                <div className="flex flex-col justify-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg w-fit mb-10 animate-fade-in-up hover:border-white/20 transition-colors cursor-default">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className={`text-sm font-bold text-emerald-400 uppercase tracking-wider ${FONTS.label}`}>ENGINE INSIGHTS — COACH-READY</span>
                    </div>

                    <h1 className={`${FONTS.h1} text-white leading-[1.05] mb-8 drop-shadow-2xl`}>
                        Turn Your Games Into a Clear
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 animate-gradient-x block">Improvement Plan</span>
                    </h1>

                    <p className={`text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl ${FONTS.body} leading-relaxed`}>
                        Connect your Chess.com or Lichess account — or upload a PGN file. We analyze your real games, reveal your recurring patterns, and turn them into a coach-ready plan you can act on.
                    </p>

                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <button onClick={() => navigate('/checkout')} className={`px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:bg-slate-100 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group ${FONTS.body}`}>
                                Start 14-Day Free Trial
                                <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <button className={`px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md ${FONTS.body}`}>
                                <Play size={24} className="fill-current" /> Watch 60-sec Demo
                            </button>
                        </div>
                        <div className="text-slate-400 text-sm font-medium pl-2">
                            Core metrics + quick recommendations. Upgrade anytime for the full report.
                        </div>
                        <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider pl-2 flex items-center gap-2">
                            <Clock size={12} /> Takes ~60 seconds. No charge for the Starter Report.
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
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

                        <GlassCard className="w-[85%] max-w-[480px] p-8 z-20 animate-float-slow bg-[#0F1623]/90 border-white/10 pointer-events-auto shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
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
                                <div className="p-6 rounded-[1.5rem] bg-[#0A0F1C] border border-white/10 flex items-center justify-between relative overflow-hidden group">
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
                                <div className="p-6 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.1)]">
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
                        </GlassCard>

                    </div>
                </div>
            </div>
        </section>
    );
};

const WhySection = () => (
    <section id="analytics" className="py-40 relative z-10">
        <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="mb-20 flex flex-col items-center text-center gap-6">
                <h2 className={`${FONTS.h1} text-white`}>Why White Knight Analytics</h2>
                <p className={`text-2xl text-slate-400 max-w-4xl ${FONTS.body} leading-relaxed`}>
                    Engines show the best move. We show the pattern behind your mistakes — and what to train next with a coach.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                {[
                    { title: "Deep Diagnostics", desc: "We break your games into repeatable patterns — opening choices, tactics, time trouble, and endgame conversion — so you know what actually costs you rating.", icon: Brain, color: "violet" },
                    { title: "Coach-Ready Plan", desc: "Not just “you blundered”. You get a prioritized focus list with examples from your own games — ready to turn into a real session plan.", icon: Target, color: "indigo" },
                    { title: "Focused Growth", desc: "Stop doing random work. Train the themes that repeatedly show up in your games — tracked week to week.", icon: TrendingUp, color: "emerald" },
                ].map((item, i) => (
                    <GlassCard key={i} className="p-10 hover:bg-white/10 transition-colors group border-white/5 hover:border-white/20">
                        <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-${item.color}-500/10`}>
                            <item.icon size={36} />
                        </div>
                        {/* FIXED: Reduced font size for card titles on smaller screens to prevent overflow */}
                        <h3 className={`font-display text-2xl md:text-3xl font-bold tracking-tight text-white mb-6`}>{item.title}</h3>
                        <p className={`text-xl text-slate-400 ${FONTS.body}`}>{item.desc}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Sample Output Preview */}
            <div className="mb-24 relative p-1 rounded-[2.5rem] bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-emerald-500/20">
                <div className="bg-[#0A0F1C] rounded-[2.3rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500/20 text-indigo-300 px-6 py-2 rounded-b-xl text-sm font-bold border-b border-x border-indigo-500/30">SAMPLE REPORT PREVIEW</div>
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
                <h3 className={`text-center text-white mb-12 ${FONTS.h2} !text-3xl`}>How It Works</h3>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-10">
                    {[
                        { num: 1, text: "Connect or Upload" },
                        { num: 2, text: "Get Report" },
                        { num: 3, text: "Optional: Match with a Coach" },
                        { num: 4, text: "Track Results" }
                    ].map((step, i, arr) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                                    {step.num}
                                </div>
                                <span className="text-xl text-slate-300 font-medium">{step.text}</span>
                            </div>
                            {i !== arr.length - 1 && (
                                <ArrowRight className="text-slate-600 hidden md:block" size={24} />
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-center text-slate-400 text-xl mb-12">Your report is built from your real games. Coaching is optional.</p>

                <div className="text-center">
                    <button className={`px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 transition-all hover:-translate-y-1 ${FONTS.body}`}>
                        Get a Free Report
                    </button>
                </div>
            </div>
        </div>
    </section>
);

// --- STAT ROSE CHART ---
interface StatType {
    id: string;
    label: string;
    score: number;
    gradientFrom: string;
    gradientTo: string;
    insight: {
        title: string;
        leak: string;
        action: string;
    };
}

const StatRoseChart = ({ activeSlice, onHover, stats }: { activeSlice: string | null, onHover: (id: string | null) => void, stats: StatType[] }) => {
    const size = 650;
    const center = size / 2;
    const maxRadius = 250; // Increased radius for better visibility
    const sliceAngle = 360 / stats.length;
    const depth = 20;

    const getCoordinatesForAngle = (angle: number, radius: number) => {
        const angleInRadians = (angle - 90) * (Math.PI / 180.0);
        return {
            x: center + (radius * Math.cos(angleInRadians)),
            y: center + (radius * Math.sin(angleInRadians))
        };
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center select-none group perspective-1000">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

            <div className="relative w-[750px] h-[750px] transition-transform duration-500 hover:scale-[1.02]">
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full drop-shadow-2xl overflow-visible"
                    style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}
                >
                    <defs>
                        {stats.map((stat) => (
                            <linearGradient key={`grad-${stat.id}`} id={`grad-${stat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={stat.gradientFrom} />
                                <stop offset="100%" stopColor={stat.gradientTo} />
                            </linearGradient>
                        ))}
                        {stats.map((stat) => (
                            <linearGradient key={`dark-${stat.id}`} id={`dark-${stat.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={stat.gradientTo} stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
                            </linearGradient>
                        ))}
                    </defs>

                    {/* Grid Lines */}
                    {[1, 2, 3].map(ring => (
                        <circle
                            key={ring} cx={center} cy={center} r={(maxRadius / 3) * ring}
                            fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4"
                        />
                    ))}

                    {/* Slices */}
                    {stats.map((stat, i) => {
                        const startAngle = i * sliceAngle;
                        const endAngle = (i + 1) * sliceAngle;
                        const radius = (stat.score / 100) * maxRadius;
                        const p2 = getCoordinatesForAngle(startAngle, radius);
                        const p3 = getCoordinatesForAngle(endAngle, radius);
                        const p2_depth = { x: p2.x, y: p2.y + depth };
                        const p3_depth = { x: p3.x, y: p3.y + depth };
                        const isActive = activeSlice === stat.id;

                        return (
                            <g
                                key={stat.id}
                                onMouseEnter={() => onHover(stat.id)}
                                onMouseLeave={() => onHover(null)}
                                onClick={() => onHover(stat.id === activeSlice ? null : stat.id)} // Toggle on tap
                                className="cursor-pointer transition-all duration-300"
                                style={{
                                    transformOrigin: `${center}px ${center}px`,
                                    transform: isActive ? 'scale(1.08) translateZ(20px)' : 'scale(1)',
                                    filter: isActive ? `drop-shadow(0 0 15px ${stat.gradientFrom}80)` : 'none'
                                }}
                            >
                                {/* 3D Thickness */}
                                <path
                                    d={`M ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p3_depth.x} ${p3_depth.y} L ${p2_depth.x} ${p2_depth.y} Z`}
                                    fill={`url(#dark-${stat.id})`} stroke="none"
                                />
                                {/* Top Face */}
                                <path
                                    d={`M ${center} ${center} L ${p2.x} ${p2.y} A ${radius} ${radius} 0 0 1 ${p3.x} ${p3.y} Z`}
                                    fill={`url(#grad-${stat.id})`}
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth={isActive ? 2 : 1}
                                    className="transition-opacity duration-300"
                                    opacity={activeSlice && !isActive ? 0.7 : 1}
                                />
                            </g>
                        );
                    })}

                    {/* Labels */}
                    {stats.map((stat, i) => {
                        const angle = i * sliceAngle + sliceAngle / 2;
                        const labelRadius = maxRadius + 60; // Pushed out further
                        const pos = getCoordinatesForAngle(angle, labelRadius);
                        const isActive = activeSlice === stat.id;

                        return (
                            <g
                                key={`label-${i}`}
                                onMouseEnter={() => onHover(stat.id)}
                                onMouseLeave={() => onHover(null)}
                                className="cursor-pointer transition-all duration-300"
                                style={{ opacity: activeSlice && !isActive ? 0.3 : 1 }}
                            >
                                {/* Invisible Hit Area for easier hovering */}
                                <circle cx={pos.x} cy={pos.y} r="50" fill="transparent" />

                                <text
                                    x={pos.x} y={pos.y - 8} textAnchor="middle" dominantBaseline="middle" fill={isActive ? 'white' : '#94A3B8'}
                                    className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isActive ? 'font-extrabold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`}
                                    style={{ textShadow: isActive ? `0 0 15px ${stat.gradientFrom}` : 'none' }}
                                >{stat.label}</text>
                                <text
                                    x={pos.x} y={pos.y + 12} textAnchor="middle" dominantBaseline="middle" fill={isActive ? stat.gradientFrom : '#64748B'}
                                    className={`text-sm md:text-base font-bold font-display`}
                                >{stat.score}/100</text>

                                {/* Underline for active state */}
                                {isActive && (
                                    <line
                                        x1={pos.x - 20} y1={pos.y + 25}
                                        x2={pos.x + 20} y2={pos.y + 25}
                                        stroke={stat.gradientFrom} strokeWidth="2" strokeLinecap="round"
                                    />
                                )}
                            </g>
                        )
                    })}

                    {/* Center Circle */}
                    <circle cx={center} cy={center} r="45" fill="#0F1623" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />

                    {activeSlice ? (
                        <g>
                            <text x={center} y={center - 5} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="24" fontWeight="bold">
                                {stats.find(s => s.id === activeSlice)?.score}
                            </text>
                            <text x={center} y={center + 15} textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontSize="10" fontWeight="bold" letterSpacing="1">
                                SCORE
                            </text>
                        </g>
                    ) : (
                        <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="bold" letterSpacing="1">STATS</text>
                    )}
                </svg>
            </div>
        </div>
    );
};

const VisualizationSection = () => {
    const navigate = useNavigate();
    const [activeSlice, setActiveSlice] = useState<string | null>(null);

    const stats: StatType[] = [
        {
            id: 'opening',
            label: 'Opening',
            score: 85,
            gradientFrom: '#8B5CF6',
            gradientTo: '#7C3AED',
            insight: {
                title: "Opening — 85/100 (Strong)",
                leak: "You consistently get playable positions but miss key central breaks in D4 systems.",
                action: "Coach focus: expand repertoire to sharper lines in the Queen's Gambit."
            }
        },
        {
            id: 'tactics',
            label: 'Tactics',
            score: 65,
            gradientFrom: '#3B82F6',
            gradientTo: '#2563EB',
            insight: {
                title: "Tactics — 65/100 (Average)",
                leak: "You spot simple 1-2 move combos but consistently miss defensive resources for your opponent.",
                action: "Coach focus: calculation drills and 'falsifying' your candidate moves."
            }
        },
        {
            id: 'endgame',
            label: 'Ending',
            score: 45,
            gradientFrom: '#10B981',
            gradientTo: '#059669',
            insight: {
                title: "Endgame — 45/100 (Leak)",
                leak: "You struggle to convert winning advantages in Rook endings, often allowing counterplay.",
                action: "Coach focus: lucena position, philidor position, and active king usage."
            }
        },
        {
            id: 'advantage',
            label: 'Advantage Cap.',
            score: 75,
            gradientFrom: '#EC4899',
            gradientTo: '#DB2777',
            insight: {
                title: "Advantage Cap. — 75/100 (Good)",
                leak: "You convert material advantages well but sometimes rush the win.",
                action: "Coach focus: positional squeezes and maintaining tension."
            }
        },
        {
            id: 'time',
            label: 'Time Mgmt',
            score: 55,
            gradientFrom: '#F59E0B',
            gradientTo: '#D97706',
            insight: {
                title: "Time Mgmt — 55/100 (Risk)",
                leak: "You play too fast in critical moments (middlegame transitions) and too slow in opening.",
                action: "Coach focus: trigger discipline and time allocation strategies."
            }
        },
        {
            id: 'resource',
            label: 'Resourcefulness',
            score: 90,
            gradientFrom: '#06B6D4',
            gradientTo: '#0891B2',
            insight: {
                title: "Resourcefulness — 90/100 (Elite)",
                leak: "You save lost positions remarkably well. A key strength to build on.",
                action: "Keep this up! Focus on not getting into these positions in the first place."
            }
        },
    ];

    const activeStat = activeSlice ? stats.find(s => s.id === activeSlice) : null;

    return (
        <section id="analytics" className="py-40 relative z-10 overflow-hidden">
            <div className="w-full px-6 md:px-12 lg:px-24">
                <div className="flex flex-col lg:flex-row items-center gap-24">
                    {/* LEFT CONTENT */}
                    <div className="flex-1 w-full">
                        <div className={`inline-block px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-sm text-base font-bold text-white mb-8 backdrop-blur-md ${FONTS.label}`}>VISUAL LEARNING</div>

                        <h2 className={`${FONTS.h1} text-white mb-8 leading-tight`}>
                            See Your Game<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Spot Your Leaks</span><br />
                            Fix Them Faster
                        </h2>

                        {/* Dynamic Insight Box */}
                        <div className="min-h-[200px] mb-12">
                            {activeStat ? (
                                <div className="animate-fade-in p-6 rounded-2xl bg-white/5 border border-white/10 border-l-4 shadow-2xl" style={{ borderLeftColor: activeStat.gradientFrom }}>
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                        {activeStat.insight.title}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">The Leak</div>
                                            <p className={`text-lg text-slate-300 ${FONTS.body}`}>
                                                {activeStat.insight.leak}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Action Plan</div>
                                            <p className={`text-lg text-white font-bold ${FONTS.body}`}>
                                                {activeStat.insight.action}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className={`text-2xl text-slate-400 ${FONTS.body}`}>
                                    Our dashboards turn your last 30–200 games into clear visuals. <br />
                                    <span className="text-white font-bold opacity-80">Hover a category</span> to see what’s helping your rating — and what’s holding it back.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-12">
                            <div>
                                <div className="text-3xl font-bold text-white mb-2 font-display flex items-center gap-2">
                                    <TrendingUp className="text-emerald-400" /> Track
                                </div>
                                <div className={`text-base text-slate-500 ${FONTS.label}`}>rating trend and form</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-2 font-display flex items-center gap-2">
                                    <Target className="text-indigo-400" /> Measure
                                </div>
                                <div className={`text-base text-slate-500 ${FONTS.label}`}>accuracy by phase and theme</div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <button onClick={() => navigate('/checkout')} className={`px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 transition-all hover:-translate-y-1 ${FONTS.body}`}>
                                Start 14-Day Free Trial
                            </button>
                        </div>
                    </div>

                    {/* RIGHT CHART */}
                    <div className="flex-1 relative w-full h-[700px] flex items-center justify-center">
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent rounded-full blur-3xl" /> */}
                        <StatRoseChart activeSlice={activeSlice} onHover={setActiveSlice} stats={stats} />
                    </div>
                </div>
            </div>
        </section>
    );
};

const OpponentAnalysisSection = ({ onRegister }: { onRegister: () => void }) => {
    const [activeTab, setActiveTab] = useState('white'); // 'white' means Rival plays White (You play Black)
    const [isExpanded, setIsExpanded] = useState(false);

    // Data for "Rival As White" (Your prep as Black)
    const statsWhite = {
        openings: [
            { name: "Queen's Gambit", var: "Orthodox Setup", freq: 70, wdl: [60, 30, 10] },
            { name: "Italian Game", var: "Giuoco Piano", freq: 20, wdl: [35, 40, 25] },
            { name: "English Opening", var: "Symmetrical", freq: 10, wdl: [40, 40, 20] },
        ],
        rec: {
            opening: "Sicilian Defense",
            reason: "Rival scores poorly against Sicilian (45% win rate vs 60% average).",
            strat: "Exploit: Rival endgame accuracy is lower (71%). Avoid: Sharp tactics early (Rival 92% Opening). Plan: Choose solid lines, simplify, target rook endings."
        }
    };

    // Data for "Rival As Black" (Your prep as White)
    const statsBlack = {
        openings: [
            { name: "Sicilian Defense", var: "Najdorf", freq: 60, wdl: [35, 40, 25] },
            { name: "Nimzo-Indian", var: "Classical", freq: 30, wdl: [20, 50, 30] },
            { name: "French Defense", var: "Winawer", freq: 10, wdl: [30, 40, 30] },
        ],
        rec: {
            opening: "Nimzo-Indian Structures",
            reason: "Rival struggles to convert wins in Nimzo lines (50% Draw rate).",
            strat: "Exploit: Rival endgame accuracy is lower (71%). Avoid: Sharp tactics early (Rival 92% Opening). Plan: Choose solid lines, simplify, target rook endings."
        }
    };

    const current = activeTab === 'white' ? statsWhite : statsBlack;

    return (
        <section id="opponent-prep" className="py-40 relative z-10">
            <div className="w-full px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row items-start gap-24">
                    {/* LEFT: New Opponent Analysis Card */}
                    <div className="flex-1 relative w-full flex justify-center">
                        <GlassCard className="p-0 bg-gradient-to-br from-[#0F1623] to-[#0B1221] border-white/10 w-full max-w-[600px] overflow-hidden">

                            {/* Header */}
                            <div className="p-6 md:p-8 pb-0">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-violet-600 p-[2px] mx-auto mb-2 shadow-lg shadow-violet-600/20">
                                            <div className="w-full h-full rounded-2xl bg-[#0F1623] flex items-center justify-center text-lg font-bold text-white">JD</div>
                                        </div>
                                        <div className="text-white font-bold text-lg leading-none">You</div>
                                        <div className="text-slate-500 text-sm font-mono">2250</div>
                                    </div>
                                    <div className="flex flex-col items-center px-4">
                                        <div className="text-amber-500 font-display font-bold text-2xl italic tracking-wider">VS</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1 bg-white/5 px-2 py-1 rounded">Opponent Brief</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-red-500 p-[2px] mx-auto mb-2 shadow-lg shadow-red-500/20">
                                            <div className="w-full h-full rounded-2xl bg-[#0F1623] flex items-center justify-center text-lg font-bold text-white">OP</div>
                                        </div>
                                        <div className="text-white font-bold text-lg leading-none">Rival</div>
                                        <div className="text-slate-500 text-sm font-mono">2310</div>
                                    </div>
                                </div>

                                {/* Tab Switcher */}
                                <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6">
                                    <button onClick={() => setActiveTab('white')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'white' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-white'}`}>
                                        <div className={`w-3 h-3 rounded-full border border-slate-300 ${activeTab === 'white' ? 'bg-white' : 'bg-transparent'}`}></div> Rival: White
                                    </button>
                                    <button onClick={() => setActiveTab('black')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'black' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-white'}`}>
                                        <div className={`w-3 h-3 rounded-full bg-slate-900 border border-slate-600`}></div> Rival: Black
                                    </button>
                                </div>
                            </div>

                            {/* Content Area with Collapse Logic */}
                            <div className={`px-6 md:px-8 pb-8 space-y-6 relative transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1200px]' : 'max-h-[480px]'} overflow-hidden`}>

                                {/* 1. Most Popular Openings */}
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3 flex items-center gap-2"><Activity size={12} /> Top 3 Openings</div>
                                    <div className="space-y-4">
                                        {current.openings.map((op, i) => (
                                            <div key={i} className="group bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex justify-between text-sm font-bold text-white mb-2">
                                                    <span>{op.name}</span>
                                                    <span className="font-mono text-slate-400 text-xs">{op.freq}% Played</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mb-3">{op.var}</div>

                                                {/* Win/Draw/Loss Bar */}
                                                <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-800">
                                                    <div style={{ width: `${op.wdl[0]}%` }} className="bg-emerald-500" />
                                                    <div style={{ width: `${op.wdl[1]}%` }} className="bg-slate-500" />
                                                    <div style={{ width: `${op.wdl[2]}%` }} className="bg-red-500" />
                                                </div>
                                                <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono uppercase tracking-wide">
                                                    <span>{op.wdl[0]}% Win</span><span>{op.wdl[1]}% Draw</span><span>{op.wdl[2]}% Loss</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Phase Accuracy */}
                                <div className="space-y-3 pt-2 border-t border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Phase Accuracy (You vs Rival)</div>
                                    {[
                                        { label: 'Opening', you: 88, rival: 92, win: 'rival' },
                                        { label: 'Middlegame', you: 82, rival: 78, win: 'you' },
                                        { label: 'Endgame', you: 83, rival: 71, win: 'you' },
                                    ].map((phase, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                            <div className="flex justify-between text-xs font-bold text-slate-400">
                                                <span>{phase.label}</span>
                                                <span className={phase.win === 'you' ? 'text-emerald-400' : 'text-red-400'}>{phase.you}% <span className="text-slate-600 text-[10px] mx-1">vs</span> {phase.rival}%</span>
                                            </div>
                                            <div className="flex gap-2 h-1.5 mt-0.5">
                                                <div className="flex-1 bg-slate-800 rounded-full overflow-hidden flex justify-end">
                                                    <div style={{ width: `${phase.you}%` }} className="bg-violet-500 h-full rounded-full" />
                                                </div>
                                                <div className="flex-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div style={{ width: `${phase.rival}%` }} className="bg-red-500 h-full rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 3. Recommended Strategy */}
                                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-5 shadow-lg shadow-indigo-900/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider mb-3 flex items-center gap-1"><Crosshair size={12} /> Recommended Strategy</div>


                                        {/* Opening Target */}
                                        <div className="mb-4 pb-4 border-b border-white/10">
                                            <div className="text-xs text-indigo-200 font-bold uppercase mb-1">Target Opening</div>
                                            <div className="text-white font-bold text-lg">{current.rec.opening}</div>
                                            <div className="text-indigo-100 text-xs mt-1 opacity-80">{current.rec.reason}</div>
                                        </div>

                                        {/* Game Plan */}
                                        <div>
                                            <div className="text-xs text-indigo-200 font-bold uppercase mb-2">Game Plan</div>
                                            <div className="text-xs text-white/90 leading-relaxed font-medium">
                                                {current.rec.strat}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FOG OVERLAY & BUTTON */}
                                {!isExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/90 to-transparent flex items-end justify-center pb-6 z-20">
                                        <button
                                            onClick={() => setIsExpanded(true)} // Note: logic needs setISExpanded from somewhere? Ah, check component hooks
                                            className="px-6 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white font-bold text-sm shadow-lg hover:bg-white/20 transition-all flex items-center gap-2 group"
                                        >
                                            Show Full Analysis <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Collapse Button */}
                            {isExpanded && (
                                <div className="text-center pb-6">
                                    <button
                                        onClick={() => setIsExpanded(false)} // Note: needs setIsExpanded
                                        className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 mx-auto transition-colors"
                                    >
                                        Collapse <ChevronUp size={14} />
                                    </button>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* RIGHT: Text Content */}
                    <div className="flex-1 order-1 md:order-2 flex flex-col justify-center">
                        <h2 className={`${FONTS.h1} text-white mb-8`}>Know Your Opponent</h2>
                        <p className={`text-2xl text-slate-400 mb-8 ${FONTS.body}`}>Preparing for a specific player? Generate a one-page opponent brief: likely openings, recurring weaknesses, time trouble habits, and the positions you should steer toward.</p>

                        <div className="text-amber-200/80 mb-10 text-lg font-medium">Early access is limited to Pro users. Waitlist is first-come, first-served.</div>

                        <ul className="space-y-4 mb-10">
                            {['Compare key metrics side by side', 'See opening tendencies by color', 'Get practical prep notes and traps to watch'].map(item => (<li key={item} className="flex items-center gap-4 text-white text-lg font-medium"><CheckCircle size={24} className="text-amber-500 flex-shrink-0" /> {item}</li>))}
                        </ul>
                        <button onClick={onRegister} className={`bg-amber-500 text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 ${FONTS.body}`}>Join the Waitlist</button>
                        <p className="text-slate-500 text-sm font-medium mt-3">Pro members get early access first.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CoachingVsAutoSection = ({ onRegister }: { onRegister: () => void }) => (
    <section id="coaching" className="py-40 relative z-10">
        <div className="w-full px-6 md:px-12 lg:px-24 text-center">
            <h2 className={`${FONTS.h1} text-white mb-6`}>Why Real Coaching Wins</h2>
            <p className={`text-xl text-slate-400 max-w-2xl mx-auto mb-20 ${FONTS.body}`}>Analytics shows the problem. Coaching fixes it — faster, with feedback you can’t get from automated training alone.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5 text-left opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-6 mb-10"><div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/5"><Brain size={32} /></div><h3 className={`text-3xl font-bold text-white ${FONTS.h2}`}>Automated Training Apps</h3></div>
                    <ul className={`space-y-8 text-slate-400 text-xl ${FONTS.body}`}>
                        <li className="flex items-start gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> One-size-fits-all content</li>
                        <li className="flex items-start gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> Weak link to your recurring mistakes</li>
                        <li className="flex items-start gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> No “why” behind decisions</li>
                        <li className="flex items-start gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> Progress stalls after early gains</li>
                    </ul>
                </div>
                <div className="p-12 text-left ring-1 ring-violet-500/50 shadow-[0_0_80px_-20px_rgba(139,92,246,0.15)] bg-gradient-to-br from-violet-900/20 to-transparent rounded-[3rem] relative overflow-hidden backdrop-blur-xl border border-white/10">
                    <div className="flex items-center gap-6 mb-10"><div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/40"><Users size={32} /></div><h3 className={`text-3xl font-bold text-white ${FONTS.h2}`}>Coaching Add-On via White Knight Academy</h3></div>
                    <ul className={`space-y-8 text-slate-200 font-medium text-xl ${FONTS.body}`}>
                        <li className="flex items-start gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Coach matched to goals, rating, language, schedule</li>
                        <li className="flex items-start gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Live feedback on your real games (“why this move?”)</li>
                        <li className="flex items-start gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Session plan built from your patterns — not generic exercises</li>
                        <li className="flex items-start gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Progress tracked week to week in your dashboard</li>
                    </ul>
                    <div className="mt-12 text-center">
                        <button onClick={onRegister} className={`px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 transition-all hover:-translate-y-1 ${FONTS.body}`}>
                            Match Me With a Coach
                        </button>
                        <p className="text-slate-400 text-sm mt-3">Coaching is optional. Start with a free analytics report.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const BeginnersSection = ({ onRegister }: { onRegister: () => void }) => (
    <section id="beginners" className="py-32 relative z-10 border-t border-white/5">
        <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <h2 className={`${FONTS.h1} text-white mb-6`}>Also Great for Beginners</h2>
                    <ul className={`space-y-6 text-xl text-slate-300 ${FONTS.body} mb-10`}>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 p-1 rounded-lg bg-violet-500/20 text-violet-300"><CheckCircle size={20} /></div>
                            <span>Don’t know how the pieces move? We match you with beginner-friendly coaches.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 p-1 rounded-lg bg-violet-500/20 text-violet-300"><CheckCircle size={20} /></div>
                            <span>Your learning path is built around you — pace, language, schedule.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 p-1 rounded-lg bg-violet-500/20 text-violet-300"><CheckCircle size={20} /></div>
                            <span>Start from the basics, progress with real feedback, and track milestones.</span>
                        </li>
                    </ul>
                    <button onClick={onRegister} className={`px-8 py-4 rounded-full border border-violet-500/50 text-violet-200 font-bold text-lg hover:bg-violet-500/10 transition-all ${FONTS.body}`}>
                        Get Matched With a Beginner Coach
                    </button>
                </div>

                {/* Right Side - Enhanced Visual */}
                <div className="flex-1 flex justify-center w-full">
                    <div className="relative w-full max-w-[550px] group perspective-1000">
                        {/* Back Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                        {/* Card */}
                        <div className="relative rounded-[2rem] bg-[#0F1623]/80 backdrop-blur-xl border border-white/10 p-8 w-full overflow-hidden shadow-2xl">
                            {/* Subtle internal gradient/grid instead of noise */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                            {/* Header */}
                            <div className="relative z-10 flex justify-between items-start mb-12">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-3xl text-white shadow-inner border border-white/20">
                                        ♟️
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-xl leading-tight">Beginner to Intermediate</div>
                                        <div className="text-slate-400 text-sm mt-1">16-Week Guided Plan</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    Verified Growth
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="relative h-64 w-full mb-10 z-10">
                                {/* Grid Lines (Absolute positioning for precision) */}
                                <div className="absolute inset-0 text-[10px] text-slate-500 font-mono select-none pointer-events-none">
                                    <div className="absolute top-0 w-full border-b border-dashed border-white/10 flex items-end pb-1"><span>1200</span></div>
                                    <div className="absolute top-1/2 w-full border-b border-dashed border-white/10 flex items-end pb-1"><span>800</span></div>
                                    <div className="absolute bottom-0 w-full border-b border-white/10 flex items-end pb-1"><span>400</span></div>
                                </div>

                                {/* Chart SVG */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#F472B6" />
                                        </linearGradient>
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* The Curve - Starts exactly at bottom line (y=100) and hits top (y=0) */}
                                    <path
                                        d="M 2,100 Q 40,95 50,50 T 98,0"
                                        fill="none"
                                        stroke="url(#chartLineGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        filter="url(#glow)"
                                    />

                                    {/* Dots */}
                                    <circle cx="2" cy="100" r="3" fill="#0F1623" stroke="#8B5CF6" strokeWidth="2" />
                                    <circle cx="50" cy="50" r="3" fill="#0F1623" stroke="#C084FC" strokeWidth="2" />
                                    <circle cx="98" cy="0" r="4" fill="#F472B6" stroke="white" strokeWidth="2" className="animate-pulse" />
                                </svg>

                                {/* Labels on X Axis */}
                                <div className="absolute left-0 bottom-[-25px] text-xs text-slate-500 font-bold">Start</div>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-25px] text-xs text-slate-500 font-bold">Week 8</div>
                                <div className="absolute right-0 bottom-[-25px] text-xs text-white font-bold">Week 16</div>

                                {/* Target Tooltip */}
                                <div className="absolute right-[-10px] top-0 -translate-y-1/2 -translate-x-full bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl transform transition-transform hover:scale-110 cursor-default">
                                    Target: 1200+
                                    {/* Little triangle pointer */}
                                    <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                                </div>
                            </div>

                            {/* Bottom Stats - Centered Alignment */}
                            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/10">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-2xl font-bold text-white">+800</span>
                                        <TrendingUp size={16} className="text-emerald-400" />
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rating Points</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">16</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Group Sessions (Max 4)</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-2xl font-bold text-white">24/7</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">AI Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ResultsSection = () => {
    return (
        <section id="results" className="py-20 relative z-10 border-t border-white/5">
            <div className="w-full px-6 md:px-12 lg:px-24 text-center">
                <h2 className={`${FONTS.h1} text-white mb-6`}>Track Real Improvement, Not Just Hype</h2>
                <p className={`text-xl text-slate-400 mb-16 max-w-3xl mx-auto ${FONTS.body}`}>See the metrics that drive rating: blunder rate, opening performance, time trouble, and endgame conversion — then watch them improve with a coach-led plan.</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[
                        { label: "Blunder Rate", change: "Down", icon: AlertTriangle, color: "emerald" },
                        { label: "Opening Performance", change: "Up", icon: BookOpen, color: "emerald" },
                        { label: "Time Trouble", change: "Down", icon: Clock, color: "emerald" },
                        { label: "Endgame Conversion", change: "Up", icon: Trophy, color: "emerald" },
                        { label: "Rating Trend", change: "Up", icon: TrendingUp, color: "emerald" },
                    ].map((metric, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className={`p-3 rounded-2xl bg-${metric.color}-500/10 text-${metric.color}-400`}>
                                <metric.icon size={24} />
                            </div>
                            <div className="text-slate-300 font-bold">{metric.label}</div>
                            <div className={`text-${metric.color}-400 font-bold text-lg flex items-center gap-1`}>
                                {metric.change === "Up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {metric.change}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CoachApplicationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14]/90 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#0F1623] border border-white/10 rounded-3xl w-full max-w-2xl p-8 md:p-10 relative shadow-2xl my-8 animate-fade-in ring-1 ring-white/5">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"><X /></button>

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


const BecomeCoachSection = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <section className="py-32 relative z-10 overflow-hidden border-t border-white/5 bg-[#0A0F1C]">
                <div className="w-full px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <h2 className={`${FONTS.h1} text-white mb-8`}>Are You a Titled Player or Coach?</h2>
                    <p className="text-lg text-slate-400 mb-6 font-medium">Players: start with a free report. Coaches: apply below.</p>
                    <p className={`text-xl text-slate-300 mb-12 max-w-2xl mx-auto ${FONTS.body}`}>Join White Knight Academy as a coach. Use analytics reports to teach faster, track student progress, and run structured sessions.</p>
                    <button onClick={() => setShowModal(true)} className={`bg-transparent border border-white/30 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-slate-900 transition-all ${FONTS.body}`}>Apply as a Coach</button>
                </div>
            </section>
            <CoachApplicationModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

const PricingSection = ({ onRegister }: { onRegister: () => void }) => {
    const navigate = useNavigate();
    return (
        <section id="pricing" className="py-40 relative z-10">
            <div className="w-full px-6 md:px-12 lg:px-24">
                <h2 className={`${FONTS.h1} text-center text-white mb-24`}>Simple Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">

                    {/* Basic Plan */}
                    <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5 text-slate-300">
                        <h3 className={`text-2xl font-bold text-white mb-3 ${FONTS.h2}`}>Basic</h3>
                        <div className="text-6xl font-bold text-white mb-4 font-display">Free</div>
                        <div className="text-slate-500 font-medium mb-10">No card required.</div>
                        <ul className={`space-y-6 mb-12 text-lg ${FONTS.body}`}>
                            <li className="flex gap-5"><Check size={24} className="text-slate-500" /> Starter report (core metrics)</li>
                            <li className="flex gap-5"><Check size={24} className="text-slate-500" /> Limited game depth (last 30 games)</li>
                            <li className="flex gap-5"><Check size={24} className="text-slate-500" /> General recommendations</li>
                            <li className="flex gap-5"><Check size={24} className="text-slate-500" /> Coach matching (optional)</li>
                        </ul>
                        <button onClick={onRegister} className={`w-full py-5 rounded-3xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors text-lg ${FONTS.body}`}>Get My Free Starter Report</button>
                    </div>

                    {/* Pro Plan */}
                    <GlassCard className="p-14 ring-1 ring-violet-500/50 shadow-[0_0_80px_-15px_rgba(139,92,246,0.3)] relative bg-gradient-to-b from-white/10 to-transparent">
                        <div className={`absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold px-8 py-3 rounded-bl-3xl rounded-tr-[2rem] shadow-lg ${FONTS.label}`}>RECOMMENDED</div>
                        <h3 className={`text-2xl font-bold text-white mb-3 flex items-center gap-3 ${FONTS.h2}`}>Pro <Crown size={24} className="text-amber-400 fill-current drop-shadow-md" /></h3>
                        <div className="flex items-baseline gap-3 mb-4"><span className="text-7xl font-bold text-white font-display">€15</span><span className="text-slate-400 font-medium text-xl">/ month</span></div>
                        <div className="text-slate-300 font-medium mb-10">Advanced features.</div>
                        <ul className={`space-y-6 mb-12 text-white font-medium text-lg ${FONTS.body}`}>
                            <li className="flex gap-5"><CheckCircle size={24} className="text-emerald-400 drop-shadow-sm" /> Full report + deeper history</li>
                            <li className="flex gap-5"><CheckCircle size={24} className="text-emerald-400 drop-shadow-sm" /> Opponent Prep</li>
                            <li className="flex gap-5"><CheckCircle size={24} className="text-emerald-400 drop-shadow-sm" /> AI Assistant</li>
                            <li className="flex gap-5"><CheckCircle size={24} className="text-emerald-400 drop-shadow-sm" /> Saved reports + advanced breakdowns</li>
                        </ul>
                        <button onClick={() => navigate('/checkout')} className={`w-full py-5 rounded-3xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] text-lg ${FONTS.body}`}>Start 14-day Free Trial</button>
                        <div className="text-center text-sm text-slate-400 mt-4 font-medium">Card required. Renews at €15/month after 14 days. Cancel anytime.</div>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    const faqs = [
        { q: "How does the AI analysis work?", a: "We analyze your games to detect recurring patterns: where you lose advantage, what decisions repeat under pressure, and which themes cost you rating. You get evidence from your own positions plus coach-ready recommendations." },
        { q: "Can I use this without a Chess.com account?", a: "Yes. You can connect Chess.com, connect Lichess, or upload PGNs." },
        { q: "How are coaches selected?", a: "If you choose coaching, we match you to a coach (or group) based on your goals, rating range, language, and schedule. Coaching is optional." },
        { q: "What is the difference between Free and Pro?", a: "Free includes the starter report with core metrics. Pro includes unlimited analysis, deeper history, AI assistant features, and advanced opponent preparation tools." },
        { q: "Is my data private?", a: "Yes. We never ask for your password. Your game data is used to generate your reports and improve your experience. You can disconnect platforms or delete uploads anytime." },
        { q: "Is White Knight Analytics affiliated with Chess.com or Lichess?", a: "No. White Knight Analytics is an independent product." }
    ];

    return (
        <section className="py-32 relative z-10">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className={`${FONTS.h1} text-white mb-16 text-center`}>Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => toggle(i)}
                            className={`border border-white/10 rounded-3xl p-8 transition-all cursor-pointer group ${openIndex === i ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 hover:border-white/20 bg-black/20'}`}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className={`font-bold text-white text-xl ${FONTS.h2} !text-xl`}>{item.q}</h3>
                                    <ChevronDown size={24} className={`text-slate-500 group-hover:text-white transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-white' : ''}`} />
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-slate-400 text-lg leading-relaxed pt-2">{item.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

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

const SocialButton = ({ href, icon: Icon }: { href: string, icon: any }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/5 backdrop-blur-md"><Icon size={24} /></a>
);

const Footer = () => (
    <footer className="relative pt-24 pb-16 overflow-hidden bg-[#080C14]">
        <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
            <div className="rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-16 mb-20 relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <h2 className={`${FONTS.h1} text-white mb-6`}>Stay Connected</h2>
                        <p className={`text-xl text-slate-400 mb-10 max-w-lg ${FONTS.body}`}>Follow product updates, new features, and coaching announcements.</p>

                        {/* Mobile Apps In Development Block */}
                        <div className="mb-16">
                            <p className={`text-sm font-bold text-slate-500 mb-8 ${FONTS.label}`}>Download our app in</p>
                            <div className="relative inline-block">
                                <div className="flex gap-6 opacity-30 select-none pointer-events-none grayscale blur-[1px]">
                                    <div className="flex items-center gap-4 bg-black text-white px-8 py-4 rounded-3xl border border-slate-800">
                                        <AppleIcon />
                                        <div className="text-left">
                                            <div className={`text-[10px] opacity-70 ${FONTS.label}`}>Download on the</div>
                                            <div className="text-base font-bold leading-none">App Store</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-black text-white px-8 py-4 rounded-3xl border border-slate-800">
                                        <PlayStoreIcon />
                                        <div className="text-left">
                                            <div className={`text-[10px] opacity-70 ${FONTS.label}`}>Get it on</div>
                                            <div className="text-base font-bold leading-none">Google Play</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                        In Development
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className={`text-sm font-bold text-slate-500 mb-8 ${FONTS.label}`}>Follow us</p>
                            <div className="flex gap-6">
                                <SocialButton href="https://www.instagram.com/white_knight_chess/" icon={Instagram} />
                                <SocialButton href="https://www.youtube.com/@ChessAcademyWhiteKnight" icon={Youtube} />
                                <SocialButton href="https://www.facebook.com/chessonlineacademy" icon={Facebook} />
                                <SocialButton href="https://www.tiktok.com/@white.knight.onli" icon={TikTokIcon} />
                            </div>
                        </div>
                    </div>

                    {/* App Phone Graphic */}
                    <div className="relative hidden lg:block h-[600px]">
                        <div className="absolute right-10 top-0 w-[320px] h-[640px] bg-[#0F1623] rounded-[50px] border-[8px] border-slate-800 shadow-2xl rotate-[-12deg] overflow-hidden transform translate-y-16 hover:rotate-0 hover:translate-y-0 transition-all duration-700 ease-out shadow-violet-900/50">
                            <div className="w-full h-full bg-[#0B1220] relative overflow-hidden">
                                <div className="absolute top-0 w-full h-28 bg-gradient-to-b from-violet-900/20 to-transparent" />
                                <div className="p-8 pt-16 space-y-8">
                                    <div className="flex justify-between items-end"><div className="h-10 w-20 bg-white/10 rounded-xl" /><div className="h-8 w-8 bg-emerald-500/20 rounded-full" /></div>
                                    <div className="h-48 w-full bg-white/5 rounded-3xl border border-white/10 p-5 relative overflow-hidden"><div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-violet-500/20 to-transparent" /><div className="flex items-end gap-3 h-full pb-2 px-2">{[40, 70, 50, 90, 60, 80].map((h, i) => (<div key={i} className="flex-1 bg-violet-500/40 rounded-t-lg" style={{ height: `${h}%` }} />))}</div></div>
                                    <div className="space-y-4"><div className="h-16 w-full bg-white/5 rounded-2xl border border-white/5 flex items-center px-5"><div className="h-8 w-8 rounded-full bg-indigo-500/50 mr-4" /><div className="h-3 w-24 bg-white/20 rounded" /></div><div className="h-16 w-full bg-white/5 rounded-2xl border border-white/5 flex items-center px-5"><div className="h-8 w-8 rounded-full bg-pink-500/50 mr-4" /><div className="h-3 w-32 bg-white/20 rounded" /></div></div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10"><Command size={16} /></div>
                        <span className={`${FONTS.logo} text-white tracking-tight text-xl`}>White Knight Analytics</span>
                    </div>
                    <p className="text-sm text-slate-500">© 2026 White Knight Academy. All rights reserved.</p>
                </div>
                <div className="flex gap-8 text-sm text-slate-400">
                    <a href="https://whiteknight.academy/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="https://whiteknight.academy/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
                    <button onClick={() => alert('Cookie Preferences Modal')} className="hover:text-white transition-colors">Cookie Settings</button>
                </div>
            </div>
        </div>
    </footer>
);

const LandingPage = () => {
    const navigate = useNavigate();

    const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial check for URL param
    useEffect(() => {
        if (location.search.includes('register=true')) {
            setAuthMode('register');
            setIsModalOpen(true);
        }
    }, [location.search]);

    const handleLogin = () => {
        setAuthMode('login');
        setIsModalOpen(true);
    };

    const handleRegister = () => {
        setAuthMode('register');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/'); // Clear URL param if present
    };

    return (
        <div className="bg-[#080C14] min-h-screen text-white relative font-sans overflow-x-hidden">
            <style>{`
                  @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                  }
                  .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
                  .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                  @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <Navbar onRegister={handleRegister} onLogin={handleLogin} />
            <HeroSection />
            <WhySection />
            <VisualizationSection />
            <OpponentAnalysisSection onRegister={handleRegister} />
            <CoachingVsAutoSection onRegister={handleRegister} />
            <BeginnersSection onRegister={handleRegister} />
            <ResultsSection />
            <PricingSection onRegister={handleRegister} />
            <FAQSection />
            <BecomeCoachSection />
            <Footer />

            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <RegistrationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mode={authMode}
                onSwitchToRegister={() => setAuthMode('register')}
                onLoginSuccess={() => navigate('/dashboard')} // Mock login success
            />
        </div>
    );
};

export default LandingPage;
