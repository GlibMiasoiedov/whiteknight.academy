import React, { useState } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Target, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

interface BiometricsAdrenalineSpikesProps {
    onHint?: () => void;
}

const BiometricsAdrenalineSpikes: React.FC<BiometricsAdrenalineSpikesProps> = ({ onHint }) => {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    let tooltipX = mousePos.x + 15;
    let tooltipY = mousePos.y + 15;
    if (typeof window !== 'undefined') {
        if (tooltipX + 200 > window.innerWidth) tooltipX = mousePos.x - 215;
        if (tooltipY + 160 > window.innerHeight) tooltipY = mousePos.y - 175;
    }

    // Mock data: X = Eval Swing (Mating chances drop/gain), Y = HR Spike
    // Negative eval swing = Opponent Blundered (Good for us)
    // Positive eval swing = We Blundered (Bad for us)
    const data = [
        { id: 1, type: 'opp_blunder', swing: -6.5, hrSpike: +28, timeTakenNextMove: 4, mistakeNext: true },
        { id: 2, type: 'opp_blunder', swing: -4.2, hrSpike: +15, timeTakenNextMove: 12, mistakeNext: false },
        { id: 3, type: 'we_blunder', swing: 5.1, hrSpike: +22, timeTakenNextMove: 3, mistakeNext: true },
        { id: 4, type: 'opp_blunder', swing: -8.0, hrSpike: +35, timeTakenNextMove: 2, mistakeNext: true }, // Big spike, rushed, blundered back
        { id: 5, type: 'we_blunder', swing: 3.5, hrSpike: +12, timeTakenNextMove: 45, mistakeNext: false }, // Calm reaction
        { id: 6, type: 'opp_blunder', swing: -2.8, hrSpike: +8, timeTakenNextMove: 25, mistakeNext: false },
        { id: 7, type: 'we_blunder', swing: 7.2, hrSpike: +31, timeTakenNextMove: 5, mistakeNext: true },
        { id: 8, type: 'opp_blunder', swing: -5.5, hrSpike: +20, timeTakenNextMove: 8, mistakeNext: false },
    ];

    // Chart Dimensions
    const width = 500;
    const height = 220;
    const paddingX = 40;
    const paddingY = 35;

    const maxSwing = 10;
    const minSwing = -10;
    const maxSpike = 40;
    const minSpike = 0;

    // Center line for X axis (Eval = 0)
    const centerX = paddingX + ((0 - minSwing) / (maxSwing - minSwing)) * (width - 2 * paddingX);

    const getX = (swing: number) => paddingX + ((swing - minSwing) / (maxSwing - minSwing)) * (width - 2 * paddingX);
    const getY = (spike: number) => height - paddingY - ((spike - minSpike) / (maxSpike - minSpike)) * (height - 2 * paddingY);

    return (
        <Card className="h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 relative overflow-visible group">
            {/* Background Light */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Target size={16} className="text-cyan-400" />
                        <h3 className={DASHBOARD_FONTS.h3 + " text-white"}>Micro-Stress Reactions</h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">Heart rate spikes during sudden Evaluation Swings</p>
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

            <div className="w-full overflow-x-auto premium-scrollbar relative z-10 mt-2">
                <div className="min-w-[450px] relative h-[260px]">
                    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height + 20}`} className="overflow-visible">
                        {/* Center Zero Line (Y-Axis essentially) */}
                        <line x1={centerX} y1={paddingY} x2={centerX} y2={height - paddingY} className="stroke-white/20 stroke-dashed" strokeWidth="1" strokeDasharray="4 4" />

                        {/* X-Axis */}
                        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="stroke-white/10" strokeWidth="1" />

                        {/* Text Labels */}
                        <text x={centerX} y={paddingY - 10} textAnchor="middle" className="fill-slate-500 text-[9px] font-bold uppercase tracking-widest">Equilibrium</text>
                        <text x={paddingX} y={height - paddingY + 15} textAnchor="start" className="fill-emerald-500/70 text-[9px] font-bold uppercase tracking-wider">&larr; Opponent Blunders</text>
                        <text x={width - paddingX} y={height - paddingY + 15} textAnchor="end" className="fill-rose-500/70 text-[9px] font-bold uppercase tracking-wider">You Blunder &rarr;</text>

                        {/* Y-Axis Labels */}
                        <text x={paddingX - 10} y={paddingY + 5} textAnchor="end" className="fill-slate-500 text-[9px] font-bold">+40 HR</text>
                        <text x={paddingX - 10} y={height - paddingY} textAnchor="end" className="fill-slate-500 text-[9px] font-bold">0</text>

                        {/* Data Points */}
                        {data.map((d, i) => {
                            const x = getX(d.swing);
                            const y = getY(d.hrSpike);
                            const isHovered = hoveredPoint === i;

                            const isOppBlunder = d.type === 'opp_blunder';
                            const baseColor = isOppBlunder ? 'emerald' : 'rose';
                            const fillClass = isHovered ? `fill-${baseColor}-400` : `fill-${baseColor}-500`;
                            const strokeClass = d.mistakeNext ? 'stroke-amber-400 stroke-[2px]' : 'stroke-transparent';
                            const size = isHovered ? 8 : 5;

                            return (
                                <g key={i}
                                    onMouseEnter={() => setHoveredPoint(i)}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    className="cursor-crosshair"
                                >
                                    {/* Invisible hit area */}
                                    <circle cx={x} cy={y} r={20} fill="transparent" />

                                    {/* Vertical/Horizontal Hover Lines */}
                                    {isHovered && (
                                        <>
                                            <line x1={x} y1={y} x2={x} y2={height - paddingY} className="stroke-white/20" strokeWidth="1" strokeDasharray="2 2" />
                                            <line x1={paddingX} y1={y} x2={x} y2={y} className="stroke-white/20" strokeWidth="1" strokeDasharray="2 2" />
                                        </>
                                    )}

                                    {/* The Point */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={size}
                                        className={`transition-all duration-300 ${fillClass} ${strokeClass} opacity-90 hover:opacity-100 ${isHovered ? `drop-shadow-[0_0_8px_rgba(${isOppBlunder ? '16,185,129' : '244,63,94'},0.8)]` : ''}`}
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* HTML Tooltip overlay */}
                    {hoveredPoint !== null && (
                        <div
                            className="fixed z-[9999] pointer-events-none"
                            style={{
                                left: `${tooltipX}px`,
                                top: `${tooltipY}px`
                            }}
                        >
                            <div className="bg-[#080C14]/95 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[170px] flex flex-col gap-2 relative">
                                <div className={`text-[10px] font-bold border-b border-white/10 pb-1 mb-1 uppercase tracking-wider ${data[hoveredPoint].type === 'opp_blunder' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {data[hoveredPoint].type === 'opp_blunder' ? 'Opportunity Arises' : 'Major Mistake Made'}
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5"><TrendingUp size={12} className="text-cyan-400" /><span className="text-white">HR Spike</span></div>
                                    <span className="font-bold text-cyan-400">+{data[hoveredPoint].hrSpike} <span className="text-[9px] text-cyan-400/70">BPM</span></span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5"><Target size={12} className="text-slate-400" /><span className="text-white">Eval Swing</span></div>
                                    <span className="font-bold text-slate-300">{data[hoveredPoint].swing > 0 ? '+' : ''}{data[hoveredPoint].swing}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-white/5">
                                    <span className="text-slate-400">Reaction Time:</span>
                                    <span className={data[hoveredPoint].timeTakenNextMove < 5 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{data[hoveredPoint].timeTakenNextMove}s</span>
                                </div>
                                {data[hoveredPoint].mistakeNext && (
                                    <div className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded mt-1 flex items-center gap-1">
                                        <TrendingDown size={10} /> Rushed & Blundered Back
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-4 text-[11px] px-1 relative z-10">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-300 font-medium">Opponent Blunder</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                    <span className="text-slate-300 font-medium">Player Blunder</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-transparent border-2 border-amber-400 rounded-full"></div>
                    <span className="text-slate-300 font-medium">Mutual Blunder Follow-up</span>
                </div>
            </div>
        </Card>
    );
};

export default BiometricsAdrenalineSpikes;
