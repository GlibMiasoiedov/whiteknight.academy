import React from 'react';

interface RatingChartProps {
    color: string;
}

const RatingChart: React.FC<RatingChartProps> = ({ color }) => (
    <div className="w-full h-16 relative overflow-hidden opacity-80">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M0,30 Q10,25 20,28 T40,20 T60,22 T80,10 T100,15" fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M0,30 Q10,25 20,28 T40,20 T60,22 T80,10 T100,15 V40 H0 Z" fill="url(#chartGradient)" />
        </svg>
    </div>
);

export default RatingChart;
