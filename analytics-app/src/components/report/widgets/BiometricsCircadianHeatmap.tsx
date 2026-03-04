import React, { useState, useMemo } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Sun, Sparkles } from 'lucide-react';

interface BiometricsCircadianHeatmapProps {
    onHint?: () => void;
}

const BiometricsCircadianHeatmap: React.FC<BiometricsCircadianHeatmapProps> = ({ onHint }) => {
    // Generate mock data representing hours (0-23) vs Performance Metric (Winrate, HR stability)
    // Structure: array of 7 days, each day has 24 hours. Data represents a combined "Peak Focus" score 0-100.
    const generateHeatmapData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let data = [];

        for (let d = 0; d < 7; d++) {
            let row = { day: days[d], hours: [] as { hour: number, score: number, hr: number, games: number }[] };
            for (let h = 0; h < 24; h++) {
                // Determine base score based on time of day (Circadian rhythm logic)
                let baseScore = 20; // Default low (Sleep time)
                let baseHr = 60;
                let volume = Math.floor(Math.random() * 2);

                if (h > 8 && h < 12) {
                    // Morning Peak
                    baseScore = 70 + Math.random() * 30; // 70-100
                    baseHr = 75 + Math.random() * 10;
                    volume = Math.floor(Math.random() * 5);
                } else if (h >= 12 && h < 15) {
                    // Post-lunch dip
                    baseScore = 40 + Math.random() * 20; // 40-60
                    baseHr = 85 + Math.random() * 15; // Higher stress
                    volume = Math.floor(Math.random() * 4);
                } else if (h >= 15 && h < 20) {
                    // Late afternoon peak (Especially weekends)
                    baseScore = d >= 5 ? 80 + Math.random() * 20 : 50 + Math.random() * 30;
                    baseHr = 80 + Math.random() * 10;
                    volume = d >= 5 ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 3);
                } else if (h >= 20 && h <= 23) {
                    // Evening fatigue
                    baseScore = 20 + Math.random() * 30; // 20-50
                    baseHr = 95 + Math.random() * 20; // Fatigue/Tilt HR
                    volume = Math.floor(Math.random() * 6);
                }

                // Zero out early am
                if (h >= 1 && h <= 6) {
                    baseScore = 0;
                    volume = 0;
                }

                row.hours.push({
                    hour: h,
                    score: Math.floor(baseScore),
                    hr: Math.floor(baseHr),
                    games: volume
                });
            }
            data.push(row);
        }
        return data;
    };

    const heatmapData = useMemo(() => generateHeatmapData(), []);
    const [hoverInfo, setHoverInfo] = useState<{ day: string, hour: number, score: number, hr: number, games: number } | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    let tooltipX = mousePos.x + 15;
    let tooltipY = mousePos.y + 15;
    if (typeof window !== 'undefined') {
        if (tooltipX + 240 > window.innerWidth) tooltipX = mousePos.x - 250;
        if (tooltipY + 160 > window.innerHeight) tooltipY = mousePos.y - 170;
    }

    // Color scaling logic based purely on "score"
    const getColorClass = (score: number) => {
        if (score === 0) return 'bg-white/5 border-white/5'; // No data
        if (score < 30) return 'bg-rose-500/20 border-rose-500/30'; // Poor
        if (score < 55) return 'bg-amber-500/20 border-amber-500/30'; // Mediocre
        if (score < 80) return 'bg-emerald-500/40 border-emerald-500/50'; // Good
        return 'bg-emerald-500/80 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'; // Peak
    };

    const formatHourIndex = (index: number) => {
        if (index === 0) return '12A';
        if (index === 12) return '12P';
        return index < 12 ? `${index}A` : `${index - 12}P`;
    };

    return (
        <Card className="h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 relative overflow-visible group">
            {/* Background Light */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sun size={16} className="text-emerald-400" />
                        <h3 className={DASHBOARD_FONTS.h3 + " text-white"}>Circadian Rhythm Overlay</h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">Biological peak performance windows (Winrate vs Stress Levels)</p>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5 shrink-0 ml-auto whitespace-nowrap"
                    >
                        <Sparkles className="w-3 h-3" /> Insights
                    </button>
                )}
            </div>

            <div className="flex gap-4 relative z-10 w-full">

                {/* Left side: The Heatmap Matrix */}
                <div className="flex-1 w-full">
                    {/* Hour Labels Header */}
                    <div className="flex mb-1 md:mb-2 ml-[24px] sm:ml-[30px]">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="flex-1 text-center text-[7px] md:text-[9px] font-bold text-slate-500 uppercase tracking-tighter overflow-hidden">
                                {i % 2 === 0 ? formatHourIndex(i) : ''}
                            </div>
                        ))}
                    </div>

                    {/* Matrix Grid */}
                    <div className="space-y-[1px] md:space-y-1.5 relative">
                        {heatmapData.map((row) => (
                            <div key={row.day} className="flex items-center">
                                {/* Day Label */}
                                <div className="w-[24px] sm:w-[30px] shrink-0 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-1 md:pr-2">
                                    {row.day}
                                </div>
                                <div className="flex-1 flex gap-[1px] sm:gap-[2px] md:gap-1">
                                    {row.hours.map((col, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex-1 aspect-square rounded-sm border transition-all duration-200 cursor-pointer relative ${getColorClass(col.score)} ${col.score > 0 ? 'hover:scale-110 hover:z-20' : ''}`}
                                            onMouseEnter={() => col.score > 0 && setHoverInfo({ day: row.day, ...col })}
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={() => setHoverInfo(null)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side: Legend and Summary - hidden on small screens, shown inline on wide screens */}
                <div className="w-[180px] shrink-0 border-l border-white/5 pl-4 hidden xl:flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Focus Score Legend</div>
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-sm bg-emerald-500/80 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0"></div>
                            <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Peak State (80-100)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-sm bg-emerald-500/40 border border-emerald-500/50 shrink-0"></div>
                            <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Good (55-79)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-sm bg-amber-500/20 border border-amber-500/30 shrink-0"></div>
                            <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Mediocre (30-54)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-sm bg-rose-500/20 border border-rose-500/30 shrink-0"></div>
                            <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Tilt / Fatigue (1-29)</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5">
                        <div className="text-[11px] text-slate-400 leading-relaxed italic">
                            "Your peak performance window is <strong>Saturday 10:00 AM - 1:00 PM</strong>. Avoid playing after 9:00 PM on weekdays."
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Legend (shows only on small screens) */}
            <div className="xl:hidden mt-6 pt-4 border-t border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Focus Score Legend</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10 w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/80 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0"></div>
                        <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">Peak State (80-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500/50 shrink-0"></div>
                        <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">Good (55-79)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30 shrink-0"></div>
                        <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">Mediocre (30-54)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-500/30 shrink-0"></div>
                        <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">Tilt (1-29)</span>
                    </div>
                </div>
            </div>

            {/* Hover Tooltip (Fixed position to break out of scroll container) */}
            {hoverInfo && (
                <div
                    className="fixed bg-[#080C14]/95 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[9999] pointer-events-none w-[220px]"
                    style={{ left: `${tooltipX}px`, top: `${tooltipY}px` }}
                >
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                        {hoverInfo.day}, {formatHourIndex(hoverInfo.hour)} - {formatHourIndex(hoverInfo.hour + 1)}
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Focus Score</span>
                            <span className={`font-bold ${hoverInfo.score > 70 ? 'text-emerald-400' : hoverInfo.score > 40 ? 'text-amber-400' : 'text-rose-400'}`}>{hoverInfo.score}/100</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Avg Heart Rate</span>
                            <span className="font-bold text-rose-400">{hoverInfo.hr} BPM</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
                            <span className="text-slate-500">Games Played</span>
                            <span className="font-bold text-slate-300">{hoverInfo.games}</span>
                        </div>
                    </div>
                </div>
            )}

        </Card>
    );
};

export default BiometricsCircadianHeatmap;
