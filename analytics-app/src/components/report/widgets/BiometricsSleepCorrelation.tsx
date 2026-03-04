import React, { useState } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Moon, Sparkles } from 'lucide-react';

interface BiometricsSleepCorrelationProps {
    onHint?: () => void;
}

const BiometricsSleepCorrelation: React.FC<BiometricsSleepCorrelationProps> = ({ onHint }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Mock data: Hours of sleep vs Accuracy & Blunder Rate
    const data = [
        { hours: '< 5h', accuracy: 68, blunderRate: 4.2 },
        { hours: '5-6h', accuracy: 72, blunderRate: 3.5 },
        { hours: '6-7h', accuracy: 78, blunderRate: 2.1 },
        { hours: '7-8h', accuracy: 84, blunderRate: 1.2 },
        { hours: '> 8h', accuracy: 85, blunderRate: 1.1 },
    ];

    const maxAccuracy = Math.max(...data.map(d => d.accuracy));

    return (
        <Card className="h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 relative overflow-visible group">
            {/* Background Light */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Moon size={16} className="text-indigo-400" />
                        <h3 className={DASHBOARD_FONTS.h3 + " text-white"}>Sleep vs Perf</h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">Impact of rest on accuracy</p>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5 shrink-0"
                    >
                        <Sparkles className="w-3 h-3" /> Insights
                    </button>
                )}
            </div>

            <div className="h-[220px] flex items-end justify-between gap-1 relative z-10 pt-16 mt-4">
                {data.map((item, index) => {
                    const accuracyHeight = (item.accuracy / maxAccuracy) * 100;
                    const isOptimal = item.hours === '7-8h' || item.hours === '> 8h';
                    const isDanger = item.hours === '< 5h';
                    const isHovered = hoveredIndex === index;

                    // Color logic for Accuracy Bar
                    let barColor = 'bg-slate-700/50';
                    let barGlow = '';
                    if (isHovered) {
                        barColor = isOptimal ? 'bg-emerald-500' : isDanger ? 'bg-rose-500' : 'bg-indigo-500';
                        barGlow = isOptimal ? 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' : isDanger ? 'shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'shadow-[0_0_15px_rgba(99,102,241,0.5)]';
                    } else if (isOptimal) {
                        barColor = 'bg-emerald-500/80';
                    }

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center flex-1 group/col cursor-crosshair relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Hover Tooltip */}
                            <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#080C14] border border-white/10 rounded-lg p-2 shadow-xl z-20 pointer-events-none transition-all duration-200 min-w-[100px] ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                <div className="text-[10px] font-bold text-slate-400 mb-1">{item.hours} Sleep</div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-white font-medium">Acc:</span>
                                    <span className={isOptimal ? 'text-emerald-400 font-bold' : isDanger ? 'text-rose-400 font-bold' : 'text-indigo-400 font-bold'}>{item.accuracy}%</span>
                                </div>
                                <div className="flex justify-between items-center text-xs mt-0.5">
                                    <span className="text-white font-medium">Blunders:</span>
                                    <span className={isDanger ? 'text-rose-400 font-bold' : 'text-slate-300 font-bold'}>{item.blunderRate}</span>
                                </div>
                            </div>

                            {/* Accuracy Bar */}
                            <div className="w-full flex justify-center items-end h-32 relative">
                                <div
                                    className={`w-4/5 rounded-t-sm transition-all duration-300 ${barColor} ${barGlow}`}
                                    style={{ height: `${accuracyHeight}%` }}
                                />
                            </div>

                            {/* X-Axis Label */}
                            <div className={`text-[10px] mt-2 font-bold transition-colors ${isHovered ? 'text-white' : 'text-slate-500'}`}>
                                {item.hours}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-400 font-medium">Optimal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <span className="text-slate-400 font-medium">Sub-optimal</span>
                </div>
            </div>
        </Card>
    );
};

export default BiometricsSleepCorrelation;
