import { useState } from 'react';
import { FONTS } from '../../constants/theme';
import { Activity, ChevronDown, ChevronUp, Crosshair, CheckCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

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
        <section id="opponent-prep" className="py-16 md:py-20 relative z-10">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24">
                <div className="flex flex-col md:flex-row items-start gap-10 md:gap-12 lg:gap-16 xl:gap-24">
                    {/* LEFT: New Opponent Analysis Card */}
                    <div className="flex-1 relative w-full flex justify-center order-2 md:order-1">
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
                        <div className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm mb-6 w-fit animate-fade-in">
                            🔥 NEW FEATURE
                        </div>
                        <h2 className={`${FONTS.h1} text-white mb-6 md:mb-8`}>
                            Crush Your Next Opponent
                        </h2>
                        <div className="text-amber-200/80 mb-6 md:mb-10 text-base md:text-lg font-medium">
                            Don't play blind. Know exactly what they play — and how to beat it.
                        </div>

                        <p className={`text-lg lg:text-xl xl:text-2xl text-slate-400 mb-6 md:mb-8 ${FONTS.body}`}>
                            Preparing for a specific player? Enter their username. We scan their games, find their most common openings, and generate a <b>Cheat Sheet</b> with the top 3 lines you need to review.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {['Compare key metrics side by side', 'See opening tendencies by color', 'Get practical prep notes and traps to watch'].map(item => (<li key={item} className="flex items-center gap-4 text-white text-lg lg:text-base xl:text-lg font-medium"><CheckCircle size={24} className="text-amber-500 flex-shrink-0" /> {item}</li>))}
                        </ul>
                        <button onClick={onRegister} className={`bg-amber-500 text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 btn-premium ${FONTS.body}`}>Join the Waitlist</button>
                        <p className="text-slate-500 text-sm font-medium mt-3">Pro members get early access first.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OpponentAnalysisSection;
