import React from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Users } from 'lucide-react';

interface OpponentData {
    name: string;
    games: number;
    win: number;
    draw: number;
    loss: number;
    ratingDelta: string;
    avatarBg: string;
}

const MOCK_OPPONENTS: OpponentData[] = [
    { name: "xXx_Slayer_xXx", games: 42, win: 20, draw: 5, loss: 17, ratingDelta: "+12.5", avatarBg: "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] border-white/20" },
    { name: "ChessMaster99", games: 38, win: 15, draw: 10, loss: 13, ratingDelta: "-4.2", avatarBg: "bg-gradient-to-br from-slate-700 to-slate-900 text-slate-200 shadow-[0_0_10px_rgba(255,255,255,0.05)] border-white/10" },
    { name: "TheDarkKnight", games: 25, win: 10, draw: 2, loss: 13, ratingDelta: "-18.0", avatarBg: "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border-white/10" },
    { name: "AlphaZeroFan", games: 21, win: 12, draw: 4, loss: 5, ratingDelta: "+24.8", avatarBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border-white/20" },
    { name: "PawnPusher1", games: 18, win: 9, draw: 9, loss: 0, ratingDelta: "+15.0", avatarBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] border-white/20" },
];

interface TopOpponentsListProps {
    onHint?: () => void;
    onViewAll?: () => void;
}

const TopOpponentsList: React.FC<TopOpponentsListProps> = ({ onHint, onViewAll }) => {
    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-violet-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Top 5 Opponents</div>
                </div>
                <div className="flex items-center gap-2">
                    {onHint && (
                        <button
                            onClick={onHint}
                            className="px-3 py-1 bg-violet-600/20 text-violet-400 hover:bg-violet-600 hover:text-white border border-violet-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-violet-strong flex items-center gap-1.5"
                        >
                            Insights
                        </button>
                    )}
                    {onViewAll && (
                        <button onClick={onViewAll} className="text-[10px] text-amber-500 hover:text-amber-400 uppercase tracking-wider font-bold transition-colors">
                            More
                        </button>
                    )}
                </div>
            </div>

            <div className="divide-y divide-white/5">
                {MOCK_OPPONENTS.map((opp, idx) => {
                    const isPositiveDelta = opp.ratingDelta.startsWith('+');

                    return (
                        <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-violet-500">
                            <div className="flex items-center gap-4 pl-0 transition-all">
                                <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-sm border relative overflow-hidden ${opp.avatarBg}`}>
                                    {/* Subtle inner ring highlight */}
                                    <div className="absolute inset-0 border border-white/20 rounded-full pointer-events-none"></div>
                                    {opp.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">{opp.name}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">
                                        <span className="text-white font-medium">{opp.games}</span> games played
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                {/* W-D-L */}
                                <div className="text-xs font-semibold bg-black/20 px-2 py-0.5 rounded">
                                    <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{opp.win}</span>
                                    <span className="text-slate-600 mx-1.5">-</span>
                                    <span className="text-slate-400">{opp.draw}</span>
                                    <span className="text-slate-600 mx-1.5">-</span>
                                    <span className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]">{opp.loss}</span>
                                </div>
                                {/* Rating Delta */}
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isPositiveDelta ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}>
                                    {opp.ratingDelta}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default TopOpponentsList;
