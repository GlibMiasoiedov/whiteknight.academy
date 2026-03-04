import React from 'react';
import { AlertTriangle, Sparkles, AlertCircle, XOctagon } from 'lucide-react';
import Card from '../../../ui/Card';
import { DASHBOARD_FONTS } from '../../../../constants/theme';

interface MistakeBreakdownProps {
    onHint?: () => void;
}

const MistakeBreakdown: React.FC<MistakeBreakdownProps> = ({ onHint }) => {
    // Mock data for inaccuracies, mistakes, blunders
    const data = [
        { label: 'Inaccuracies', user: 3.2, opp: 4.1, color: 'text-amber-400', bg: 'bg-amber-500', icon: AlertCircle },
        { label: 'Mistakes', user: 1.8, opp: 2.5, color: 'text-orange-400', bg: 'bg-orange-500', icon: AlertTriangle },
        { label: 'Blunders', user: 0.9, opp: 1.2, color: 'text-red-400', bg: 'bg-red-500', icon: XOctagon },
    ];

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Mistake Breakdown</div>
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
            <div className="p-6 relative z-10">
                <div className="space-y-6">
                    {data.map((item) => (
                        <div key={item.label}>
                            <div className="flex justify-between text-sm mb-2">
                                <div className={`flex items-center gap-2 font-semibold font-manrope ${item.color}`}>
                                    <item.icon size={14} />
                                    {item.label}
                                </div>
                                <div className="text-slate-400 font-medium text-xs">Per Game Avg</div>
                            </div>
                            <div className="space-y-3">
                                {/* User Bar */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-white">You</span>
                                        <span className="text-white font-bold">{item.user}</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.bg}`} style={{ width: `${(item.user / 5) * 100}%` }} />
                                    </div>
                                </div>
                                {/* Opponent Bar */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Opponents (1400-1500)</span>
                                        <span className="text-slate-400 font-bold">{item.opp}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-slate-600" style={{ width: `${(item.opp / 5) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </Card>
    );
};

export default MistakeBreakdown;
