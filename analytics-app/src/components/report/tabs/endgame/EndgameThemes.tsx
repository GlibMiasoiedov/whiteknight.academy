import React from 'react';
import { Layers, Sparkles, Target, Hexagon } from 'lucide-react';
import Card from '../../../ui/Card';
import { DASHBOARD_FONTS } from '../../../../constants/theme';
import ProgressBar from '../../../ui/ProgressBar';

interface EndgameThemesProps {
    onHint?: () => void;
}

const EndgameThemes: React.FC<EndgameThemesProps> = ({ onHint }) => {
    // Mock Data
    const themes = [
        { label: 'Rook Endgames', frequency: '58%', winRate: 46, avgOpp: 52, icon: Layers, color: 'text-blue-400', progressColor: 'blue' },
        { label: 'Pawn Endgames', frequency: '26%', winRate: 55, avgOpp: 48, icon: Target, color: 'text-violet-400', progressColor: 'violet' },
        { label: 'Minor Piece', frequency: '16%', winRate: 42, avgOpp: 50, icon: Hexagon, color: 'text-amber-400', progressColor: 'amber' },
    ];

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Layers size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Endgame Themes</div>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-unbounded">Theme Type</th>
                                <th className="pb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-unbounded text-right">Frequency</th>
                                <th className="pb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-unbounded w-[120px] text-right">Win Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {themes.map((theme, idx) => (
                                <tr key={idx} className="group/row hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <theme.icon size={16} className={theme.color} />
                                            <span className="text-sm font-semibold text-slate-200 group-hover/row:text-white transition-colors">{theme.label}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-xs text-slate-400 font-manrope">{theme.frequency}</span>
                                    </td>
                                    <td className="py-4 pl-6 text-right w-[120px]">
                                        <div className="flex flex-col gap-1 items-end">
                                            <span className={`text-xs font-bold ${theme.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'} font-unbounded`}>{theme.winRate}%</span>
                                            <div className="w-full">
                                                <ProgressBar current={theme.winRate} max={100} color={theme.progressColor} />
                                            </div>
                                            <span className="text-[9px] text-slate-500 mt-0.5">Peer Avg: {theme.avgOpp}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </Card>
    );
};

export default EndgameThemes;
