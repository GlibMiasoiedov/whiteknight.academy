import React from 'react';
import { Crosshair, Sparkles } from 'lucide-react';
import Card from '../../../ui/Card';
import { DASHBOARD_FONTS } from '../../../../constants/theme';
import Badge from '../../../ui/Badge';

interface TacticalMotifsHeatmapProps {
    onHint?: () => void;
}

const TacticalMotifsHeatmap: React.FC<TacticalMotifsHeatmapProps> = ({ onHint }) => {
    const motifs = [
        { name: 'Pins', missed: 24, phase: 'Middlegame', pct: 85 },
        { name: 'Forks', missed: 18, phase: 'Late Game', pct: 60 },
        { name: 'Discovered Attacks', missed: 12, phase: 'Middlegame', pct: 40 },
        { name: 'Hanging Pieces', missed: 8, phase: 'Early Game', pct: 25 },
        { name: 'Back Rank', missed: 5, phase: 'Endgame', pct: 15 },
        { name: 'Skewers', missed: 3, phase: 'Middlegame', pct: 10 },
    ];

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Crosshair size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Missed Tactical Motifs</div>
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

            <div className="p-0 relative z-10 overflow-x-auto premium-scrollbar">
                <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                        <tr className="border-b border-white/5 text-xs text-slate-500 font-bold uppercase tracking-wider bg-black/20">
                            <th className="py-3 px-6 font-manrope">Motif</th>
                            <th className="py-3 px-6 font-manrope text-center">Phase</th>
                            <th className="py-3 px-6 font-manrope text-right">Missed (30d)</th>
                            <th className="py-3 px-6 font-manrope w-32">Frequency</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {motifs.map((motif) => (
                            <tr key={motif.name} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-6 font-semibold text-white whitespace-nowrap">
                                    {motif.name}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <Badge
                                        type="neutral"
                                        label={motif.phase}
                                        className="bg-white/5 text-slate-300 border-white/10 text-[10px] px-2 py-0.5"
                                    />
                                </td>
                                <td className="py-4 px-6 text-right font-medium text-amber-400">
                                    {motif.missed}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-amber-500/50 to-amber-500"
                                            style={{ width: `${motif.pct}%` }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </Card>
    );
};

export default TacticalMotifsHeatmap;
