import React from 'react';
import { Activity, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';
import Card from '../../../ui/Card';
import { DASHBOARD_FONTS } from '../../../../constants/theme';

interface EndgamePerformanceProps {
    onHint?: () => void;
}

const EndgamePerformance: React.FC<EndgamePerformanceProps> = ({ onHint }) => {
    // Mock Data
    const entryStats = [
        { label: 'Endgames Reached', value: '42%', desc: 'Of total games played', icon: ArrowRight, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Avg Eval Swing (30+)', value: '-1.8', desc: 'Points lost in late game', icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10' },
        { label: 'Conversion (+1.5)', value: '64%', desc: 'Wins when entering ahead', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Endgame Performance</div>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3 h-3" /> Insights
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-6 relative z-10 h-full">
                <div className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-manrope">
                        Your ability to navigate the transition into the endgame and capitalize on late-game positions.
                    </p>

                    <div className="space-y-3 pt-2">
                        {entryStats.map((stat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 group/item transition-all hover:bg-black/40">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={14} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white group-hover/item:text-emerald-300 transition-colors">{stat.label}</div>
                                        <div className="text-[10px] text-slate-500">{stat.desc}</div>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold font-unbounded ${stat.color}`}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </Card>
    );
};

export default EndgamePerformance;
