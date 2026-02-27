import React from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { HelpCircle, ArrowDownRight, Target } from 'lucide-react';

interface EloAverage {
    label: string;
    rating: number;
}

const ELO_AVERAGES: EloAverage[] = [
    { label: 'Last 10', rating: 2847 },
    { label: 'Last 20', rating: 2847 },
    { label: 'Last 50', rating: 2840 },
    { label: 'Last 100', rating: 2830 },
];

interface EloEstimateCardProps {
    onExplainElo?: () => void;
}

const EloEstimateCard: React.FC<EloEstimateCardProps> = ({ onExplainElo }) => {
    const currentElo = 2854;
    const onlineRating = 3020;
    const inflation = onlineRating - currentElo;
    const marginOfError = 118;

    return (
        <Card padding="p-0" className="flex flex-col bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 overflow-hidden relative group">
            {/* Background glowing blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

            <div className="p-6 pb-5 relative z-10 flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-0">
                    <div className="flex items-center gap-2">
                        <Target size={16} className="text-violet-400" />
                        <div className={DASHBOARD_FONTS.widgetTitle}>FIDE Estimate</div>
                    </div>
                    {onExplainElo && (
                        <button
                            onClick={onExplainElo}
                            className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                        >
                            <HelpCircle size={13} />
                            Methodology
                        </button>
                    )}
                </div>

                {/* Visual Logic Breakdown */}
                <div className="flex flex-col items-center justify-center flex-1 w-full px-6 py-2">

                    {/* Main Result */}
                    <div className="relative mb-6 w-full flex flex-col items-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />
                        <div className="relative flex flex-col items-center z-10 w-full">
                            <span className="text-[64px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 tracking-tight leading-none drop-shadow-lg">
                                {currentElo.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                                    True Strength
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Calculation Metrics */}
                    <div className="w-full max-w-[280px] grid grid-cols-2 gap-3 mt-2">
                        {/* Online Rating */}
                        <div className="bg-slate-800/40 rounded-xl p-3 px-4 border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-600 transition-colors shadow-inner">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-xl rounded-full -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Online Avg</span>
                            <span className="text-xl font-bold text-slate-200 drop-shadow-sm">{onlineRating}</span>
                        </div>

                        {/* Inflation Minus */}
                        <div className="bg-rose-500/5 rounded-xl p-3 px-4 border border-rose-500/10 flex flex-col items-center justify-center relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 blur-xl rounded-full -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
                            <span className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider mb-1">Inflation</span>
                            <div className="flex items-center gap-1">
                                <ArrowDownRight size={14} className="text-rose-500" />
                                <span className="text-xl font-bold text-rose-400 drop-shadow-sm">{inflation}</span>
                            </div>
                        </div>
                    </div>

                    {/* Confidence Margin */}
                    <div className="mt-5 text-[10.5px] text-slate-500 font-medium flex items-center justify-center gap-1.5 opacity-80 bg-slate-800/20 px-3 py-1.5 rounded-lg border border-white/5">
                        <Target size={13} className="text-slate-500" />
                        95% confidence margin: <span className="text-slate-300 font-bold">±{marginOfError} pts</span>
                    </div>
                </div>

                {/* Averages List */}
                <div className="mt-auto border-t border-white/5 pt-4">
                    <div className={`${DASHBOARD_FONTS.label} text-slate-400 uppercase tracking-wider mb-2 text-[10px]`}>Historical Averages</div>
                    <div className="grid grid-cols-[70px_50px_1fr] gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 px-2">
                        <div>Games</div>
                        <div>Avg</div>
                        <div></div>
                    </div>
                    <div className="space-y-0.5">
                        {ELO_AVERAGES.map((avg, idx) => {
                            const barWidth = Math.max(0, Math.min(100, ((avg.rating - 2000) / 1000) * 100));
                            return (
                                <div key={idx} className="grid grid-cols-[70px_50px_1fr] items-center gap-4 py-1.5 px-2 hover:bg-white/[0.03] rounded transition-colors group">
                                    <div className="text-xs font-medium text-slate-400">{avg.label}</div>
                                    <div className="text-xs font-bold text-white tracking-wide">{avg.rating.toLocaleString()}</div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-slate-400 group-hover:bg-amber-400 rounded-full transition-colors duration-300"
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default EloEstimateCard;
