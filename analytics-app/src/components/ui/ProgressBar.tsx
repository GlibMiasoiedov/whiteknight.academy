import React from 'react';

interface ProgressBarProps {
    current: number;
    max: number;
    color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, color }) => (
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]"
            style={{ width: `${Math.min((current / max) * 100, 100)}%`, backgroundColor: color, color: color }}
        />
    </div>
);

export default ProgressBar;
