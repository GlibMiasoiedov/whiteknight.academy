import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { TrendingUp } from 'lucide-react';

interface RatingDynamicsChartProps {
    onHint?: () => void;
    // The filterKey changes whenever global layout filters change.
    // In a real implementation with an API, you would use this (or the actual filter states)
    // as dependency inputs for a data fetching hook (like React Query or useEffect + fetch).
    // e.g.
    // useEffect(() => {
    //    fetchAnalyticsData({ time: timeFilter, mode: modeFilter }).then(setData);
    // }, [timeFilter, modeFilter]);
    filterKey?: string;
}

const MOCK_DATA = [
    { label: 'Mar', value: 2730 },
    { label: 'Apr', value: 2780 },
    { label: 'May', value: 2725 },
    { label: 'Jun', value: 2770 },
    { label: 'Jul', value: 2815 },
    { label: 'Aug', value: 2825 },
    { label: 'Sep', value: 2810 },
    { label: 'Oct', value: 2840 },
    { label: 'Nov', value: 2790 },
    { label: 'Dec', value: 2855 },
    { label: '2026', value: 2795, isYearMarker: true },
    { label: 'Feb', value: 2845 }
];

const RatingDynamicsChart: React.FC<RatingDynamicsChartProps> = ({ onHint, filterKey }) => {
    const [animatedHeight, setAnimatedHeight] = useState(0);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    // Re-trigger animation when filterKey changes to simulate data reloading
    useEffect(() => {
        setAnimatedHeight(0);
        const timer = setTimeout(() => {
            setAnimatedHeight(1);
        }, 150);
        return () => clearTimeout(timer);
    }, [filterKey]);

    // Chart dimensions
    const width = 800;
    const height = 300;
    const padding = { top: 40, right: 30, bottom: 40, left: 60 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Y Axis logic
    const minVal = 2700;
    const maxVal = 2900;
    const ySteps = 5;
    const yStepValue = (maxVal - minVal) / (ySteps - 1);

    const getY = (val: number) => {
        const percentage = (maxVal - val) / (maxVal - minVal);
        return padding.top + (percentage * chartHeight) * animatedHeight + (chartHeight * (1 - animatedHeight));
    };

    // X Axis logic
    const xStep = chartWidth / (MOCK_DATA.length - 1);
    const getX = (index: number) => padding.left + (index * xStep);

    // Generate path lines
    const pathD = MOCK_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');

    // Area fill path (closes the shape down to the X axis)
    const areaPathD = `${pathD} L ${getX(MOCK_DATA.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    return (
        <Card className="flex flex-col p-6 bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group h-full overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-violet-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Rating Dynamics</div>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1.5 bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white border border-violet-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-violet-strong shadow-[0_0_15px_rgba(139,92,246,0.2)] flex items-center gap-1.5"
                    >
                        Insights
                    </button>
                )}
            </div>

            <div className="relative w-full h-[250px] mt-auto z-10">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">

                    <defs>
                        {/* Area Gradient (Violet to Cyan, fading to transparent) */}
                        <linearGradient id="areaGradient" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                        </linearGradient>

                        {/* Line Gradient */}
                        <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="50%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>

                        {/* Glow Filter for Active Point & Line */}
                        <filter id="glowNeon" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Y Axis Grid Lines & Labels */}
                    {Array.from({ length: ySteps }).map((_, i) => {
                        const val = minVal + (i * yStepValue);
                        const y = padding.top + ((ySteps - 1 - i) / (ySteps - 1)) * chartHeight;

                        return (
                            <g key={`y-${val}`}>
                                {/* Subtle horizontal grid lines */}
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

                    {/* Left Y Axis solid line */}
                    <line
                        x1={padding.left} x2={padding.left}
                        y1={padding.top} y2={height - padding.bottom}
                        stroke="#475569" strokeWidth="2"
                    />

                    {/* Bottom X Axis solid line */}
                    <line
                        x1={padding.left} x2={width - padding.right}
                        y1={height - padding.bottom} y2={height - padding.bottom}
                        stroke="#475569" strokeWidth="2"
                    />

                    {/* X Axis Labels & Year Markers */}
                    {MOCK_DATA.map((d, i) => {
                        const x = getX(i);
                        const isYear = d.isYearMarker;

                        return (
                            <g key={`x-${i}`}>
                                {/* Ticks */}
                                <line
                                    x1={x} x2={x}
                                    y1={height - padding.bottom} y2={height - padding.bottom + 6}
                                    stroke="#475569" strokeWidth="2"
                                />

                                <text
                                    x={x} y={height - padding.bottom + 25}
                                    fill={isYear ? "#f8fafc" : "#64748b"}
                                    fontSize={isYear ? "14" : "12"}
                                    fontWeight={isYear ? "700" : "600"}
                                    textAnchor="middle"
                                >
                                    {d.label}
                                </text>

                                {/* Vertical Line for Year transitions */}
                                {
                                    isYear && (
                                        <line
                                            x1={x} x2={x}
                                            y1={padding.top - 10} y2={height - padding.bottom}
                                            stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6"
                                        />
                                    )
                                }
                            </g>
                        );
                    })}

                    {/* Animated Area Fill */}
                    <path
                        d={areaPathD}
                        fill="url(#areaGradient)"
                        className="transition-all duration-300"
                    />

                    {/* Main Dynamic Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter="url(#glowNeon)"
                    />

                    {/* Data Points (Glowing Dots) */}
                    {MOCK_DATA.map((d, i) => {
                        const x = getX(i);
                        const y = getY(d.value);
                        const isHovered = hoveredPoint === i;

                        return (
                            <g
                                key={`point-${i}`}
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                className="cursor-pointer transition-all duration-300"
                            >
                                {/* Invisible larger hit area for precise hover */}
                                <circle cx={x} cy={y} r="25" fill="transparent" />

                                {/* Visible Dot */}
                                <circle
                                    cx={x} cy={y} r={isHovered ? "8" : "4.5"}
                                    fill={isHovered ? "#ffffff" : "#0F1623"}
                                    stroke={isHovered ? "#06B6D4" : "#3B82F6"}
                                    strokeWidth={isHovered ? "3" : "2"}
                                    className="transition-all duration-300"
                                    filter={isHovered ? "url(#glowNeon)" : ""}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* React/HTML Tooltip Overlay */}
                {hoveredPoint !== null && (
                    <div
                        className="absolute bg-[#0F1623]/95 backdrop-blur-md border border-violet-500/50 px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white font-bold text-sm transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all flex flex-col items-center gap-0.5"
                        style={{
                            left: `${(getX(hoveredPoint) / width) * 100}%`,
                            top: `${(getY(MOCK_DATA[hoveredPoint].value) / height) * 100}%`,
                            marginTop: '-18px'
                        }}
                    >
                        <span className="text-[10px] text-violet-300 uppercase tracking-widest leading-none mb-0.5">
                            {MOCK_DATA[hoveredPoint].label}
                        </span>
                        <span className="text-lg leading-none">
                            {MOCK_DATA[hoveredPoint].value}
                        </span>

                        {/* Little downward triangle tail */}
                        <div className="absolute w-3 h-3 bg-[#0F1623] border-b border-r border-violet-500/50 transform rotate-45 -bottom-[7px] left-1/2 -translate-x-1/2"></div>
                    </div>
                )}
            </div>
        </Card >
    );
};

export default RatingDynamicsChart;
