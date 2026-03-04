import React from 'react';
import { HeartPulse, Activity, Zap, ArrowUp, ArrowDown, Info } from 'lucide-react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';

interface BiometricsSummaryCardProps {
    onHint?: () => void;
}

const BiometricsSummaryCard: React.FC<BiometricsSummaryCardProps> = ({ onHint }) => {
    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <HeartPulse size={16} className="text-purple-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Biometrics Summary</div>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                        title="What does this mean?"
                    >
                        <Info size={14} />
                    </button>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col relative z-10 space-y-6">

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* HR Metric */}
                    <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col justify-center items-center group-hover:border-rose-500/20 transition-colors">
                        <Activity size={14} className="text-rose-400 mb-2" />
                        <div className="text-2xl font-bold text-white mb-0.5">108 <span className="text-[10px] text-slate-500 font-normal tracking-wider">BPM</span></div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">Avg HR</div>
                        <div className="mt-2 flex items-center text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            <ArrowUp size={10} className="mr-0.5" /> +12
                        </div>
                    </div>

                    {/* Peak Stress */}
                    <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col justify-center items-center group-hover:border-purple-500/20 transition-colors">
                        <Zap size={14} className="text-purple-400 mb-2" />
                        <div className="text-2xl font-bold text-white mb-0.5">High</div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">Peak Stress</div>
                        <div className="mt-2 flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <ArrowDown size={10} className="mr-0.5" /> Lower
                        </div>
                    </div>

                    {/* Fatigue */}
                    <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col justify-center items-center group-hover:border-amber-500/20 transition-colors col-span-2 md:col-span-1">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                            <div className="h-full bg-amber-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-0.5">60<span className="text-[10px] text-slate-500 font-normal tracking-wider">%</span></div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">Fatigue Score</div>
                        <div className="mt-2 text-[10px] font-bold text-slate-400">Stable</div>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                {/* Correlation Block */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Key Correlation</div>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 flex gap-3 items-start">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30 flex-shrink-0">
                            <Activity size={12} className="text-rose-400" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-rose-200 mb-1 leading-snug">Blunder rate increases 3x when heart rate exceeds 120 BPM.</div>
                            <div className="text-xs text-rose-300/70">Typically occurs during early time trouble (move 15-20) or complex endgames.</div>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default BiometricsSummaryCard;
