import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Activity, Sparkles } from 'lucide-react';

interface BiometricsTimelineChartProps {
    onHint?: () => void;
}

// Mock dataset representing a 40-move game.
// Value is Heart Rate / Stress level (0-150).
const MOCK_DATA = [
    { move: 0, phase: 'Opening', hr: 75, event: null },
    { move: 5, phase: '', hr: 82, event: null },
    { move: 10, phase: '', hr: 88, event: null },
    { move: 15, phase: 'Middlegame', hr: 95, event: null },
    { move: 20, phase: '', hr: 110, event: 'Complex Position' },
    { move: 25, phase: '', hr: 125, event: 'Blunder (-3.5)' },
    { move: 30, phase: 'Endgame', hr: 115, event: null },
    { move: 35, phase: 'Time Trouble', hr: 135, event: 'Inaccuracy' },
    { move: 40, phase: '', hr: 140, event: 'Checkmate' },
];

const BiometricsTimelineChart: React.FC<BiometricsTimelineChartProps> = ({ onHint }) => {
    const [animatedHeight, setAnimatedHeight] = useState(0);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    useEffect(() => {
        setAnimatedHeight(0);
        const timer = setTimeout(() => {
            setAnimatedHeight(1);
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    // Chart dimensions
    const width = 800;
    const height = 300;
    const padding = { top: 60, right: 40, bottom: 40, left: 60 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Y Axis (Heart Rate: 60 to 160)
    const minVal = 60;
    const maxVal = 160;
    const ySteps = 5;
    const yStepValue = (maxVal - minVal) / (ySteps - 1);

    const getY = (val: number) => {
        const percentage = (maxVal - val) / (maxVal - minVal);
        return padding.top + (percentage * chartHeight) * animatedHeight + (chartHeight * (1 - animatedHeight));
    };

    // X Axis (Moves)
    const xStep = chartWidth / (MOCK_DATA.length - 1);
    const getX = (index: number) => padding.left + (index * xStep);

    // Dynamic Line Path
    const pathD = MOCK_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.hr)}`).join(' ');

    // Area Fill Path
    const areaPathD = `${pathD} L ${getX(MOCK_DATA.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    return (
        <Card className="flex flex-col p-6 bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group h-full overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.05),transparent_70%)] pointer-events-none" />

            <div className="flex justify-between items-center mb-2 relative z-10 w-full">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity size={16} className="text-rose-400" />
                        <div className={DASHBOARD_FONTS.widgetTitle}>Focus & Stress Timeline</div>
                    </div>
                    <div className="text-xs text-slate-400">Heart rate overlaid on game phases and critical events.</div>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-red-strong flex items-center gap-1.5 shrink-0"
                    >
                        <Sparkles className="w-3 h-3" /> Insights
                    </button>
                )}
            </div>

            <div className="relative w-full h-[260px] mt-auto z-10">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="hrAreaGradient" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
                            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                        </linearGradient>

                        <linearGradient id="hrLineGradient" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#F43F5E" />
                        </linearGradient>

                        <filter id="glowHR" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Y Axis Grid Lines */}
                    {Array.from({ length: ySteps }).map((_, i) => {
                        const val = minVal + (i * yStepValue);
                        const y = padding.top + ((ySteps - 1 - i) / (ySteps - 1)) * chartHeight;

                        return (
                            <g key={`y-${val}`}>
                                <line
                                    x1={padding.left} x2={width - padding.right}
                                    y1={y} y2={y}
                                    stroke="#334155" strokeWidth="1" strokeDasharray="3,3" opacity="0.3"
                                />
                                <text
                                    x={padding.left - 15} y={y}
                                    fill="#94a3b8" fontSize="13" fontWeight="600"
                                    textAnchor="end" alignmentBaseline="middle"
                                >
                                    {val}
                                </text>
                            </g>
                        );
                    })}

                    <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="#475569" strokeWidth="2" />
                    <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#475569" strokeWidth="2" />

                    {/* X Axis Labels & Phase Markers */}
                    {MOCK_DATA.map((d, i) => {
                        const x = getX(i);
                        const isPhaseStart = !!d.phase;

                        return (
                            <g key={`x-${i}`}>
                                <line x1={x} x2={x} y1={height - padding.bottom} y2={height - padding.bottom + 5} stroke="#475569" strokeWidth="2" />
                                <text x={x} y={height - padding.bottom + 20} fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
                                    M{d.move}
                                </text>

                                {isPhaseStart && (
                                    <>
                                        <line x1={x} x2={x} y1={padding.top} y2={height - padding.bottom} stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                                        <text x={x + 5} y={padding.top - 15} fill="#38bdf8" fontSize="11" fontWeight="700" opacity="0.8">
                                            {d.phase}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    })}

                    {/* Area */}
                    <path d={areaPathD} fill="url(#hrAreaGradient)" className="transition-all duration-300" />

                    {/* Line */}
                    <path d={pathD} fill="none" stroke="url(#hrLineGradient)" strokeWidth="3" filter="url(#glowHR)" strokeLinejoin="round" />

                    {/* Data Points & Events */}
                    {MOCK_DATA.map((d, i) => {
                        const x = getX(i);
                        const y = getY(d.hr);
                        const isHovered = hoveredPoint === i;
                        const hasEvent = !!d.event;
                        const isBlunder = d.event && d.event.includes('Blunder');

                        return (
                            <g
                                key={`point-${i}`}
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                className="cursor-pointer transition-all duration-300"
                            >
                                <circle cx={x} cy={y} r="20" fill="transparent" />

                                {hasEvent && !isHovered && (
                                    <circle cx={x} cy={y} r="6" fill={isBlunder ? "#ef4444" : "#f59e0b"} stroke="#0F1623" strokeWidth="2" />
                                )}

                                <circle
                                    cx={x} cy={y} r={isHovered ? "7" : (hasEvent ? "0" : "4")}
                                    fill={isHovered ? "#ffffff" : "#0F1623"}
                                    stroke={isHovered ? "#f43f5e" : "#f59e0b"}
                                    strokeWidth={isHovered ? "3" : "2"}
                                    className="transition-all duration-300"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* React Tooltip Overlay */}
                {hoveredPoint !== null && (
                    <div
                        className="absolute bg-[#0F1623]/95 backdrop-blur-md border border-rose-500/30 px-4 py-2 rounded-lg shadow-xl text-white font-bold text-sm transform -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center gap-1 w-max max-w-[200px]"
                        style={{
                            left: `${(getX(hoveredPoint) / width) * 100}%`,
                            top: `${(getY(MOCK_DATA[hoveredPoint].hr) / height) * 100}%`,
                            marginTop: '-12px'
                        }}
                    >
                        <div className="w-full flex justify-between gap-4 text-[10px] text-rose-300 uppercase tracking-widest leading-none mb-0.5 border-b border-white/10 pb-1">
                            <span>Move {MOCK_DATA[hoveredPoint].move}</span>
                            <span>{MOCK_DATA[hoveredPoint].hr} BPM</span>
                        </div>
                        {MOCK_DATA[hoveredPoint].event ? (
                            <span className="text-xs text-center text-white break-words mt-1">
                                {MOCK_DATA[hoveredPoint].event}
                            </span>
                        ) : (
                            <span className="text-xs text-center text-slate-400 font-normal mt-1">
                                No critical events.
                            </span>
                        )}
                        <div className="absolute w-3 h-3 bg-[#0F1623] border-b border-r border-rose-500/30 transform rotate-45 -bottom-[7px] left-1/2 -translate-x-1/2"></div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default BiometricsTimelineChart;
