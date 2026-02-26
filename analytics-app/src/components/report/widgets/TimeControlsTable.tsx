import React from 'react';
import { Zap, Flame, Clock, Mail, HelpCircle } from 'lucide-react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';

interface TimeControlData {
    variant: string;
    icon: React.ReactNode;
    games: number;
    elo: number;
    win: number;
    draw: number;
    loss: number;
}

const mockData: TimeControlData[] = [
    { variant: 'Bullet', icon: <Flame size={16} />, games: 19871, elo: 2633, win: 83, draw: 5, loss: 12 },
    { variant: 'Blitz', icon: <Zap size={16} />, games: 46135, elo: 2854, win: 79, draw: 9, loss: 12 },
    { variant: 'Rapid', icon: <Clock size={16} />, games: 490, elo: 2682, win: 43, draw: 43, loss: 14 },
    { variant: 'Correspondence', icon: <Mail size={16} />, games: 86, elo: 2107, win: 83, draw: 5, loss: 13 },
];

interface TimeControlsTableProps {
    onHint?: () => void;
}

const TimeControlsTable: React.FC<TimeControlsTableProps> = ({ onHint }) => {
    // Find max values for relative bar sizing
    const maxGames = Math.max(...mockData.map(d => d.games));
    const maxElo = Math.max(...mockData.map(d => d.elo));

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none" />
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-violet-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Time Controls</div>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1 bg-violet-600/20 text-violet-400 hover:bg-violet-600 hover:text-white border border-violet-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-violet-strong flex items-center gap-1.5"
                    >
                        Insights
                    </button>
                )}
            </div>

            <div className="overflow-x-auto premium-scrollbar pb-2">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-400">
                            <th className="pl-6 pr-5 py-3 font-semibold">Variant</th>
                            <th className="px-5 py-3 font-semibold">Games</th>
                            <th className="px-5 py-3 font-semibold flex items-center gap-1">
                                Elo Estimate <HelpCircle size={14} className="text-amber-500 cursor-help" />
                            </th>
                            <th className="pr-6 pl-5 py-3 font-semibold">Win - Draw - Loss</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors group relative cursor-pointer border-l-2 border-transparent hover:border-violet-500">
                                {/* Variant */}
                                <td className="px-5 py-4 flex items-center gap-3">
                                    <div className="text-slate-400 group-hover:text-white transition-colors">{row.icon}</div>
                                    <span className="font-semibold text-white">{row.variant}</span>
                                </td>

                                {/* Games */}
                                <td className="px-5 py-4">
                                    <div className="text-white mb-1.5 font-medium">{row.games.toLocaleString()}</div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full group-hover:shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000"
                                            style={{ width: `${(row.games / maxGames) * 100}%` }}
                                        />
                                    </div>
                                </td>

                                {/* Elo Estimate */}
                                <td className="px-5 py-4">
                                    <div className="text-white mb-1.5 font-medium">{row.elo.toLocaleString()}</div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-1000"
                                            style={{ width: `${(row.elo / maxElo) * 100}%` }}
                                        />
                                    </div>
                                </td>

                                {/* Win Draw Loss */}
                                <td className="px-5 py-4 w-1/3">
                                    <div className="flex items-center gap-2 mb-1.5 font-medium text-xs">
                                        <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">{row.win}%</span>
                                        <span className="text-slate-500">-</span>
                                        <span className="text-slate-400">{row.draw}%</span>
                                        <span className="text-slate-500">-</span>
                                        <span className="text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.3)]">{row.loss}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex ring-1 ring-white/5">
                                        <div className="h-full bg-emerald-500 transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${row.win}%` }} />
                                        <div className="h-full bg-slate-500 transition-all duration-1000" style={{ width: `${row.draw}%` }} />
                                        <div className="h-full bg-red-500 transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${row.loss}%` }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default TimeControlsTable;
