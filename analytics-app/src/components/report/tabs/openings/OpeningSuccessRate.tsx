import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import Card from '../../../ui/Card';
import { DASHBOARD_FONTS } from '../../../../constants/theme';

// ─── Types ──────────────────────────────────────────────
interface OpeningData {
    eco: string;
    name: string;
    games: number;
    winWhite: number;
    winBlack: number;
    drawRate: number;
}

interface OpeningSuccessRateProps {
    onHint?: () => void;
}

// ─── Mock Data ──────────────────────────────────────────
// TODO(backend): Replace with Chess.com API — aggregated opening stats per player
const MOCK_OPENINGS: OpeningData[] = [
    { eco: 'C50', name: 'Italian Game', games: 142, winWhite: 62, winBlack: 45, drawRate: 12 },
    { eco: 'B20', name: 'Sicilian Defense', games: 118, winWhite: 48, winBlack: 55, drawRate: 10 },
    { eco: 'D02', name: "London System", games: 95, winWhite: 58, winBlack: 38, drawRate: 15 },
    { eco: 'C65', name: 'Ruy Lopez', games: 87, winWhite: 55, winBlack: 41, drawRate: 18 },
    { eco: 'B06', name: 'Modern Defense', games: 64, winWhite: 42, winBlack: 50, drawRate: 8 },
];

// ─── Helper ─────────────────────────────────────────────
const WinrateBar: React.FC<{ white: number; black: number; draw: number }> = ({ white, black, draw }) => (
    <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
        <div
            className="bg-white transition-all duration-1000"
            style={{ width: `${white}%` }}
        />
        <div
            className="bg-slate-500 transition-all duration-1000"
            style={{ width: `${draw}%` }}
        />
        <div
            className="bg-slate-800 transition-all duration-1000"
            style={{ width: `${black}%` }}
        />
    </div>
);

// ─── Component ──────────────────────────────────────────
const OpeningSuccessRate: React.FC<OpeningSuccessRateProps> = ({ onHint }) => {
    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Opening Success Rate</div>
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

            {/* Legend */}
            <div className="px-6 pt-4 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative z-10">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-white" /> White</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-slate-500" /> Draw</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-600" /> Black</div>
            </div>

            {/* Opening Rows */}
            <div className="p-6 space-y-4 relative z-10">
                {MOCK_OPENINGS.map((opening) => {
                    const total = opening.games;
                    const whiteRate = opening.winWhite;
                    const blackRate = opening.winBlack;
                    const drawRate = opening.drawRate;
                    const bestSide = whiteRate >= blackRate ? 'White' : 'Black';
                    const bestRate = Math.max(whiteRate, blackRate);

                    return (
                        <div key={opening.eco} className="group/row">
                            {/* Row Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                        {opening.eco}
                                    </span>
                                    <span className="text-sm font-semibold text-white">
                                        {opening.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={DASHBOARD_FONTS.small}>
                                        {total} games
                                    </span>
                                    <span className={`text-xs font-bold ${bestRate >= 55 ? 'text-emerald-400' : bestRate >= 45 ? 'text-slate-300' : 'text-red-400'}`}>
                                        {bestRate}% as {bestSide}
                                    </span>
                                </div>
                            </div>

                            {/* WDL Bar */}
                            <WinrateBar white={whiteRate} black={blackRate} draw={drawRate} />

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 mt-1.5 text-[10px] text-slate-500">
                                <span>W: {whiteRate}%</span>
                                <span>D: {drawRate}%</span>
                                <span>B: {blackRate}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default OpeningSuccessRate;
