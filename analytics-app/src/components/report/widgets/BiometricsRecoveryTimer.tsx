import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Timer, Sparkles, TrendingDown } from 'lucide-react';

interface BiometricsRecoveryTimerProps {
    onHint?: () => void;
}

const BiometricsRecoveryTimer: React.FC<BiometricsRecoveryTimerProps> = ({ onHint }) => {
    // Cooldown animation state
    const [progress, setProgress] = useState(0);
    const targetCooldown = 120; // 2 minutes recommended
    const actualWait = 45; // 45 seconds average

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress((actualWait / targetCooldown) * 100);
        }, 500);
        return () => clearTimeout(timer);
    }, [actualWait, targetCooldown]);

    const isTooFast = actualWait < targetCooldown;

    // SVG Circular Progress
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Card className="h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 relative overflow-hidden group">
            {/* Background Light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Timer size={16} className="text-amber-400" />
                        <h3 className={DASHBOARD_FONTS.h3 + " text-white"}>Recovery</h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">Post-Loss Cooldown</p>
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

            <div className="flex flex-col items-center justify-center relative z-10 pt-2">

                {/* Circular Timer Visual */}
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background track */}
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            className="stroke-white/5 fill-none"
                            strokeWidth="8"
                        />
                        {/* Target marker */}
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            className="stroke-emerald-500/30 fill-none"
                            strokeWidth="8"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset="0"
                        />
                        {/* Actual progress */}
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            className={`fill-none transition-all duration-1000 ease-out ${isTooFast ? 'stroke-rose-500' : 'stroke-emerald-500'}`}
                            strokeWidth="8"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{
                                filter: isTooFast ? 'drop-shadow(0 0 6px rgba(244,63,94,0.4))' : 'drop-shadow(0 0 6px rgba(16,185,129,0.4))'
                            }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white tracking-tight">{actualWait}s</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Average</span>
                    </div>
                </div>

                {/* Insight/Warning Box */}
                <div className={`w-full p-4 rounded-xl border flex flex-col gap-2 ${isTooFast ? 'bg-rose-500/5 border-rose-500/20 hover-glow-red-strong' : 'bg-emerald-500/5 border-emerald-500/20 hover-glow-emerald-strong'} transition-all duration-300`}>
                    <div className="flex items-center gap-2">
                        {isTooFast ? <TrendingDown size={14} className="text-rose-400" /> : <Timer size={14} className="text-emerald-400" />}
                        <span className={`text-xs font-bold uppercase tracking-wider ${isTooFast ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {isTooFast ? 'Tilt Risk Detected' : 'Good Discipline'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        You start a new game only <strong className="text-white">45 seconds</strong> after a loss. Your heart rate is still elevated (115 BPM).
                    </p>
                    <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                        Target: <span className="text-white">120+ Seconds</span>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default BiometricsRecoveryTimer;
