import React from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Activity, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BiometricsHRVStatusProps {
    onHint?: () => void;
}

const BiometricsHRVStatus: React.FC<BiometricsHRVStatusProps> = ({ onHint }) => {

    // Mock current readiness
    const hrvStatus: string = 'low'; // 'high', 'normal', 'low'
    const hrvValue = 42; // ms
    const baseline = 55; // ms

    const isReady = hrvStatus === 'high' || hrvStatus === 'normal';

    // Status visual mapping
    const statusConfig = {
        high: {
            color: 'emerald',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
            indicator: 'bg-emerald-500',
            gradient: 'from-emerald-500/20 to-transparent',
            Icon: ShieldCheck,
            label: 'Prime Readiness',
            msg: 'Your nervous system is fully recovered. Optimal time for rated games.'
        },
        normal: {
            color: 'indigo',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            text: 'text-indigo-400',
            glow: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
            indicator: 'bg-indigo-500',
            gradient: 'from-indigo-500/20 to-transparent',
            Icon: Activity,
            label: 'Average Readiness',
            msg: 'Normal recovery detected. Fine for standard play and study.'
        },
        low: {
            color: 'rose',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            text: 'text-rose-400',
            glow: 'shadow-[0_0_30px_rgba(244,63,94,0.2)]',
            indicator: 'bg-rose-500',
            gradient: 'from-rose-500/20 to-transparent',
            Icon: AlertTriangle,
            label: 'High CNS Stress',
            msg: 'HRV is significantly below baseline. Avoid playing rated games.'
        }
    };

    const config = statusConfig[hrvStatus as keyof typeof statusConfig] || statusConfig['normal'];
    const StatusIcon = config.Icon;

    return (
        <Card className={`h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 relative overflow-hidden group`}>
            {/* Background Glow based on status */}
            <div className={`absolute top-0 right-0 w-full h-32 bg-gradient-to-b ${config.gradient} opacity-50 pointer-events-none`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Activity size={16} className={config.text} />
                        <h3 className={DASHBOARD_FONTS.h3 + " text-white"}>HRV Status</h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">Heart Rate Variability</p>
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

            <div className="flex flex-col items-center justify-center relative z-10 py-2">

                {/* Main Circular Indicator */}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${config.bg} border ${config.border} ${config.glow} mb-4 relative`}>
                    {/* Pulse animation ring */}
                    {!isReady && (
                        <div className={`absolute inset-0 rounded-full border border-rose-500/50 animate-ping opacity-20`} style={{ animationDuration: '2s' }} />
                    )}

                    <div className="text-center">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className={`text-4xl font-bold text-white tracking-tight`}>{hrvValue}</span>
                            <span className={`text-xs font-bold ${config.text}`}>ms</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                            Current
                        </div>
                    </div>
                </div>

                {/* Baseline compare */}
                <div className="flex items-center gap-3 text-xs mb-5">
                    <span className="text-slate-400 font-medium">Baseline:</span>
                    <span className="text-slate-300 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">{baseline} ms</span>
                </div>

                {/* Recommendation Box */}
                <div className={`w-full p-3 rounded-xl ${config.bg} border ${config.border} flex items-start gap-3`}>
                    <div className={`w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/5`}>
                        <StatusIcon size={14} className={config.text} />
                    </div>
                    <div>
                        <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${config.text}`}>
                            {config.label}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            {config.msg}
                        </p>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default BiometricsHRVStatus;
