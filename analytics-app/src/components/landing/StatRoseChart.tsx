

export interface StatType {
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

export interface StatRoseChartProps {
    activeSlice: string | null;
    hoveredSlice: string | null;
    onHover: (id: string | null) => void;
    onClick: (id: string) => void;
    stats: StatType[];
    idPrefix?: string;
}

const StatRoseChart = ({
    activeSlice,
    hoveredSlice,
    onHover,
    onClick,
    stats,
    idPrefix = ''
}: StatRoseChartProps) => {
    const size = 650;
    const center = size / 2;
    const maxRadius = 200; // Decreased radius to prevent label overflow on mobile
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
            {/* Background Glow - Removed to prevent hard edge artifact */}
            {/* <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" /> */}

            <div className="relative w-full max-w-[750px] aspect-square transition-transform duration-500 md:hover:scale-[1.02]">
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full drop-shadow-2xl overflow-visible"
                    style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))' }}
                >
                    <defs>
                        {stats.map((stat) => (
                            <linearGradient key={`grad-${stat.id}`} id={`${idPrefix}grad-${stat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={stat.gradientFrom} />
                                <stop offset="100%" stopColor={stat.gradientTo} />
                            </linearGradient>
                        ))}
                        {stats.map((stat) => (
                            <linearGradient key={`dark-${stat.id}`} id={`${idPrefix}dark-${stat.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={stat.gradientTo} stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
                            </linearGradient>
                        ))}
                        {stats.map((stat) => (
                            <radialGradient id={`${idPrefix}gradient-${stat.id}`} key={`radial-${stat.id}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) rotate(90) scale(400)">
                                <stop offset="0%" stopColor={stat.gradientFrom} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={stat.gradientTo} stopOpacity="0.2" />
                            </radialGradient>
                        ))}
                        {/* Shadow Pattern */}
                        <pattern id={`${idPrefix}pattern-circles`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="1" className="text-white/10" fill="currentColor" />
                        </pattern>
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
                        const isHovered = hoveredSlice === stat.id;
                        const isHighlighted = isActive || isHovered;

                        return (
                            <g
                                key={stat.id}
                                onMouseEnter={() => onHover(stat.id)}
                                onMouseLeave={() => onHover(null)}
                                onClick={() => onClick(stat.id)}
                                className="cursor-pointer transition-all duration-300"
                                style={{
                                    transformOrigin: `${center}px ${center}px`,
                                    transform: isHighlighted ? 'scale(1.05) translateZ(20px)' : 'scale(1)',
                                    filter: isHighlighted ? `drop-shadow(0 0 15px ${stat.gradientFrom}80)` : 'none'
                                }}
                            >
                                {/* 3D Thickness */}
                                <path
                                    d={`M ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p3_depth.x} ${p3_depth.y} L ${p2_depth.x} ${p2_depth.y} Z`}
                                    fill={`url(#${idPrefix}dark-${stat.id})`} stroke="none"
                                />
                                {/* Top Face */}
                                <path
                                    d={`M ${center} ${center} L ${p2.x} ${p2.y} A ${radius} ${radius} 0 0 1 ${p3.x} ${p3.y} Z`}
                                    fill={`url(#${idPrefix}grad-${stat.id})`}
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth={isActive ? 2 : 1}
                                    className="transition-opacity duration-300"
                                    opacity={activeSlice && !isActive ? 0.3 : (isHighlighted ? 1 : 0.9)}
                                />
                            </g>
                        );
                    })}

                    {/* Labels */}
                    {stats.map((stat, i) => {
                        const angle = i * sliceAngle + sliceAngle / 2;
                        const labelRadius = maxRadius + 30; // Closer labels
                        const pos = getCoordinatesForAngle(angle, labelRadius);

                        const isActive = activeSlice === stat.id;
                        const isHovered = hoveredSlice === stat.id;
                        const isHighlighted = isActive || isHovered;

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
                                    className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isHighlighted ? 'font-extrabold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`}
                                    style={{ textShadow: isHighlighted ? `0 0 15px ${stat.gradientFrom}` : 'none' }}
                                >{stat.label}</text>
                                <text
                                    x={pos.x} y={pos.y + 12} textAnchor="middle" dominantBaseline="middle" fill={isHighlighted ? stat.gradientFrom : '#64748B'}
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

export default StatRoseChart;
