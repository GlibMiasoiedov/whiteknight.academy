import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FONTS } from '../../constants/theme';
import { TrendingUp, Target } from 'lucide-react';
import StatRoseChart, { type StatType } from './StatRoseChart';

const VisualizationSection = () => {
    const navigate = useNavigate();
    const [activeSlice, setActiveSlice] = useState<string | null>('endgame'); // Default to Endgame
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

    // Consolidated handler for clicking a slice
    const handleSliceClick = (id: string) => {
        // If clicking the already active slice, do nothing or toggle off?
        // User asked for "click to lock", so we just set it.
        // If clicking a different one, switch to it.
        if (activeSlice === id) return; // Already selected
        setActiveSlice(id);
    };

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
        <section id="analytics" className="py-16 md:py-20 relative z-10 overflow-hidden">
            <div className="w-full px-6 md:px-12 lg:px-24">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-24">
                    {/* LEFT CONTENT (Text) */}
                    <div className="flex-1 w-full">
                        <div className={`inline-block px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-sm text-base font-bold text-white mb-8 backdrop-blur-md ${FONTS.label}`}>VISUAL LEARNING</div>

                        <h2 className={`${FONTS.h1} text-white mb-8 leading-tight`}>
                            See Your Game<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Spot Your Leaks</span><br />
                            Fix Them Faster
                        </h2>

                        {/* Dynamic Insight Box - Fixed height to prevent jumping */}
                        <div className="min-h-[180px] md:min-h-[200px] mb-8 md:mb-12 relative flex flex-col justify-center">
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

                        <div className="flex gap-6 md:gap-12">
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
                    <div className="flex-1 relative w-full h-[350px] md:h-[700px] flex items-center justify-center">
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent rounded-full blur-3xl" /> */}
                        <StatRoseChart
                            activeSlice={activeSlice}
                            hoveredSlice={hoveredSlice}
                            onHover={setHoveredSlice}
                            onClick={handleSliceClick}
                            stats={stats}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisualizationSection;
