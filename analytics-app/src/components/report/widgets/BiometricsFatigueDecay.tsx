import React, { useState } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Activity, Sparkles, Target } from 'lucide-react';

interface BiometricsFatigueDecayProps {
    onHint?: () => void;
}

const BiometricsFatigueDecay: React.FC<BiometricsFatigueDecayProps> = ({ onHint }) => {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    let tooltipX = mousePos.x + 15;
    let tooltipY = mousePos.y + 15;
    if (typeof window !== 'undefined') {
        if (tooltipX + 160 > window.innerWidth) tooltipX = mousePos.x - 175;
        if (tooltipY + 120 > window.innerHeight) tooltipY = mousePos.y - 135;
    }

    // Mock data: Games in session vs HR vs Accuracy
    const data = [
        { game: 1, hr: 85, accuracy: 88, evalDrop: -0.2 },
        { game: 2, hr: 88, accuracy: 89, evalDrop: -0.1 },
        { game: 3, hr: 95, accuracy: 85, evalDrop: -0.5 },
        { game: 4, hr: 102, accuracy: 78, evalDrop: -1.2 },
        { game: 5, hr: 108, accuracy: 72, evalDrop: -1.8 },
        { game: 6, hr: 115, accuracy: 65, evalDrop: -2.5 },
        { game: 7, hr: 118, accuracy: 62, evalDrop: -3.0 },
        { game: 8, hr: 122, accuracy: 58, evalDrop: -4.1 },
    ];

    // Scaling helpers
    const maxHR = 130;
    const minHR = 60;
    const maxAcc = 100;
    const minAcc = 50;

    // SVG Dimensions
    const width = 500;
    const height = 220;
    const paddingX = 40;
    const paddingY = 30;

    const getX = (index: number) => paddingX + (index * ((width - 2 * paddingX) / (data.length - 1)));
    const getY_HR = (hr: number) => height - paddingY - (((hr - minHR) / (maxHR - minHR)) * (height - 2 * paddingY));
    const getY_Acc = (acc: number) => height - paddingY - (((acc - minAcc) / (maxAcc - minAcc)) * (height - 2 * paddingY));

    // Path Generation
    const generatePath = (points: { x: number, y: number }[]) => {
        if (points.length === 0) return '';
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            // Cubic bezier smoothing
            const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
            const cp1y = points[i - 1].y;
            const cp2x = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
            const cp2y = points[i].y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
        }
        return d;
    };

    const hrPath = generatePath(data.map((d, i) => ({ x: getX(i), y: getY_HR(d.hr) })));
    const accPath = generatePath(data.map((d, i) => ({ x: getX(i), y: getY_Acc(d.accuracy) })));

    return (
        <Card className="h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 relative overflow-visible group">
            {/* Background Light */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Activity size={16} className="text-rose-400" />
                        <h3 className={DASHBOARD_FONTS.h3 + " text-white"}>Session Fatigue Decay</h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">Heart rate & Precision across consecutive games</p>
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
                        {/* Grid lines and axes */}
                        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="stroke-white/10" strokeWidth="1" />

                        <text x={10} y={paddingY + 10} className="fill-slate-500 text-[9px] font-bold">130 BPM</text>
                        <text x={10} y={height - paddingY} className="fill-slate-500 text-[9px] font-bold">60 BPM</text>

                        <text x={width - 35} y={paddingY + 10} className="fill-slate-500 text-[9px] font-bold">100%</text>
                        <text x={width - 35} y={height - paddingY} className="fill-slate-500 text-[9px] font-bold">50%</text>

                        {/* Defs for gradients */}
                        <defs>
                            <linearGradient id="hrGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f43f5e" /> {/* Rose-500 */}
                                <stop offset="100%" stopColor="#e11d48" /> {/* Rose-600 */}
                            </linearGradient>
                            <linearGradient id="accGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" /> {/* Emerald-500 */}
                                <stop offset="100%" stopColor="#059669" /> {/* Emerald-600 */}
                            </linearGradient>
                            <filter id="glow-red">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="glow-emerald">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Accuracy Line */}
                        <path d={accPath} fill="none" stroke="url(#accGradient)" strokeWidth="3" filter="url(#glow-emerald)" className="opacity-80 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />

                        {/* Heart Rate Line */}
                        <path d={hrPath} fill="none" stroke="url(#hrGradient)" strokeWidth="3" filter="url(#glow-red)" className="opacity-80 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />

                        {/* Interactive Data Points & Areas */}
                        {data.map((d, i) => {
                            const x = getX(i);
                            const yHR = getY_HR(d.hr);
                            const yAcc = getY_Acc(d.accuracy);
                            const isHovered = hoveredPoint === i;

                            return (
                                <g key={i}
                                    onMouseEnter={() => setHoveredPoint(i)}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    className="cursor-crosshair"
                                >
                                    {/* Vertical Hover Line */}
                                    {isHovered && (
                                        <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} className="stroke-white/20" strokeWidth="1" strokeDasharray="4 4" />
                                    )}

                                    {/* Invisible hit area for easier hovering */}
                                    <rect x={x - ((width - 2 * paddingX) / data.length / 2)} y={0} width={(width - 2 * paddingX) / data.length} height={height} fill="transparent" />

                                    {/* Data Points */}
                                    <circle cx={x} cy={yHR} r={isHovered ? 5 : 3} className={`transition-all duration-300 ${isHovered ? 'fill-rose-400' : 'fill-rose-500'}`} />
                                    <circle cx={x} cy={yAcc} r={isHovered ? 5 : 3} className={`transition-all duration-300 ${isHovered ? 'fill-emerald-400' : 'fill-emerald-500'}`} />

                                    {/* X-axis labels (Game numbers) */}
                                    <text x={x} y={height - paddingY + 20} textAnchor="middle" className={`text-[10px] font-bold transition-colors ${isHovered ? 'fill-white' : 'fill-slate-500'}`}>G{d.game}</text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Fixed portal Tooltip overlay */}
                    {hoveredPoint !== null && (
                        <div
                            className="fixed z-[9999] pointer-events-none"
                            style={{
                                left: `${tooltipX}px`,
                                top: `${tooltipY}px`
                            }}
                        >
                            <div className="bg-[#080C14]/95 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[130px] flex flex-col gap-2">
                                <div className="text-[10px] font-bold text-slate-400 border-b border-white/10 pb-1 mb-1">
                                    Game {data[hoveredPoint].game} of Session
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5"><Target size={12} className="text-emerald-400" /><span className="text-white">Precision</span></div>
                                    <span className="font-bold text-emerald-400">{data[hoveredPoint].accuracy}%</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5"><Activity size={12} className="text-rose-400" /><span className="text-white">Avg HR</span></div>
                                    <span className="font-bold text-rose-400">{data[hoveredPoint].hr} <span className="text-[9px] text-rose-400/70">BPM</span></span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-white/5 disabled opacity-70">
                                    <span className="text-slate-400">Eval Drop/G</span>
                                    <span className="text-slate-300">{data[hoveredPoint].evalDrop}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-6 text-[11px] px-1 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                    <span className="text-slate-300 font-bold uppercase tracking-wider">Heart Rate</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-slate-300 font-bold uppercase tracking-wider">Accuracy</span>
                </div>
            </div>
        </Card>
    );
};

export default BiometricsFatigueDecay;
