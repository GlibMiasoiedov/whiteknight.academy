import React, { useState } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';

interface OpeningStats {
    eco: string;
    name: string;
    games: number;
    moves: number;
    win: number;
    draw: number;
    loss: number;
}

const MOCK_OPENINGS_WHITE: OpeningStats[] = [
    { eco: 'B00', name: "King's Pawn Game", games: 15723, moves: 41.7, win: 79, draw: 11, loss: 11 },
    { eco: 'A01', name: "Nimzo-Larsen Attack", games: 7934, moves: 42.7, win: 83, draw: 7, loss: 10 },
    { eco: 'A04', name: "Zukertort Opening", games: 6505, moves: 46.7, win: 77, draw: 12, loss: 11 },
    { eco: 'A40', name: "Queen's Pawn Game", games: 5051, moves: 43.4, win: 73, draw: 15, loss: 12 },
    { eco: 'B23', name: "Sicilian Defense: Closed", games: 2616, moves: 39.2, win: 86, draw: 5, loss: 9 },
    // Extended mock data for Top 15
    { eco: 'C50', name: "Italian Game", games: 2100, moves: 38.5, win: 75, draw: 10, loss: 15 },
    { eco: 'C42', name: "Petrov's Defense", games: 1850, moves: 44.1, win: 68, draw: 22, loss: 10 },
    { eco: 'C20', name: "King's Pawn Game: Wayward Queen", games: 1500, moves: 25.0, win: 80, draw: 2, loss: 18 },
    { eco: 'B01', name: "Scandinavian Defense", games: 1200, moves: 40.0, win: 72, draw: 8, loss: 20 },
    { eco: 'D00', name: "Queen's Pawn Game: Chigorin Variation", games: 950, moves: 45.2, win: 65, draw: 15, loss: 20 },
    { eco: 'C00', name: "French Defense: Normal Variation", games: 800, moves: 48.0, win: 60, draw: 20, loss: 20 },
    { eco: 'B10', name: "Caro-Kann Defense", games: 650, moves: 50.1, win: 55, draw: 25, loss: 20 },
    { eco: 'B30', name: "Sicilian Defense: Old Sicilian", games: 500, moves: 41.5, win: 70, draw: 10, loss: 20 },
    { eco: 'A00', name: "Amar Opening", games: 320, moves: 35.0, win: 85, draw: 5, loss: 10 },
    { eco: 'D06', name: "Queen's Gambit", games: 200, moves: 47.5, win: 62, draw: 18, loss: 20 },
];

const MOCK_OPENINGS_BLACK: OpeningStats[] = [
    { eco: 'B06', name: "Modern Defense", games: 5926, moves: 43.0, win: 83, draw: 6, loss: 11 },
    { eco: 'A40', name: "Queen's Pawn Game: Modern Def", games: 5487, moves: 42.8, win: 82, draw: 7, loss: 12 },
    { eco: 'A45', name: "Indian Defense", games: 4101, moves: 46.2, win: 63, draw: 20, loss: 17 },
    { eco: 'B06', name: "Modern Def: 1... g6 2... Bg7", games: 4038, moves: 43.9, win: 82, draw: 6, loss: 12 },
    { eco: 'C20', name: "King's Pawn Game (as Black)", games: 3985, moves: 45.5, win: 56, draw: 25, loss: 19 },
    // Extended mock data for Top 15
    { eco: 'C55', name: "Two Knights Defense", games: 3100, moves: 42.1, win: 60, draw: 15, loss: 25 },
    { eco: 'B50', name: "Sicilian Defense", games: 2850, moves: 46.5, win: 65, draw: 10, loss: 25 },
    { eco: 'B01', name: "Scandinavian Defense: Mieses-Kotroc", games: 2400, moves: 39.8, win: 70, draw: 5, loss: 25 },
    { eco: 'C41', name: "Philidor Defense", games: 2150, moves: 48.0, win: 55, draw: 20, loss: 25 },
    { eco: 'B12', name: "Caro-Kann Defense: Advance", games: 1800, moves: 51.5, win: 50, draw: 25, loss: 25 },
    { eco: 'D02', name: "Queen's Pawn Game: London System", games: 1550, moves: 53.0, win: 45, draw: 30, loss: 25 },
    { eco: 'C44', name: "Ponziani Opening (as Black)", games: 1200, moves: 41.2, win: 62, draw: 13, loss: 25 },
    { eco: 'B13', name: "Caro-Kann Defense: Exchange", games: 950, moves: 47.8, win: 58, draw: 17, loss: 25 },
    { eco: 'A56', name: "Benoni Defense: Old Benoni", games: 700, moves: 49.5, win: 54, draw: 21, loss: 25 },
    { eco: 'E00', name: "Queen's Pawn Game", games: 450, moves: 44.4, win: 68, draw: 12, loss: 20 },
];

const OpeningsTable: React.FC<{ title: React.ReactNode, data: OpeningStats[], onHint?: () => void, isExpanded: boolean, onToggleExpand: () => void }> = ({ title, data, onHint, isExpanded, onToggleExpand }) => {
    const maxGames = Math.max(...data.map(d => d.games));
    const displayData = isExpanded ? data : data.slice(0, 5);

    return (
        <div className="flex flex-col mb-4 last:mb-0 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 px-6">
                <div className={`${DASHBOARD_FONTS.widgetTitle} flex items-center`}>
                    {title}
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
                    <button onClick={onToggleExpand} className="text-[10px] text-amber-500 hover:text-amber-400 uppercase tracking-wider font-bold transition-colors">
                        {isExpanded ? 'Show Top 5' : 'Show Top 15'}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto premium-scrollbar pb-2">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-400">
                            <th className="pl-6 w-[15%] pr-5 py-2 font-semibold">ECO</th>
                            <th className="px-5 w-[35%] py-2 font-semibold">Name</th>
                            <th className="px-5 w-[15%] py-2 font-semibold">Games</th>
                            <th className="px-5 w-[10%] py-2 font-semibold text-center">Moves</th>
                            <th className="px-5 w-[25%] py-2 font-semibold">Win - Draw - Loss</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {displayData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-violet-500 relative">
                                {/* ECO */}
                                <td className="pl-6 w-[15%] pr-5 py-3 text-slate-300 font-mono text-xs z-10 relative">{row.eco}</td>

                                {/* Name */}
                                <td className="px-5 w-[35%] py-3 z-10 relative">
                                    <div className="text-amber-400 group-hover:text-amber-300 font-medium transition-colors mb-0.5 whitespace-normal leading-tight">{row.name.split(':')[0]}</div>
                                    {row.name.includes(':') && (
                                        <div className="text-[10px] text-slate-500 whitespace-normal leading-tight">{row.name.split(':')[1]}</div>
                                    )}
                                </td>

                                {/* Games */}
                                <td className="px-5 w-[15%] py-3 z-10 relative">
                                    <div className="text-white mb-1.5 font-medium">{row.games.toLocaleString()}</div>
                                    <div className="w-full max-w-[80px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full group-hover:shadow-[0_0_10px_rgba(249,115,22,0.6)] transition-all duration-1000"
                                            style={{ width: `${(row.games / maxGames) * 100}%` }}
                                        />
                                    </div>
                                </td>

                                {/* Moves */}
                                <td className="px-5 w-[10%] py-3 text-center z-10 relative">
                                    <div className="text-slate-300 mb-1.5 font-medium">{row.moves.toFixed(1)}</div>
                                    <div className="w-full max-w-[48px] mx-auto h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-teal-500 rounded-full group-hover:shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (row.moves / 50) * 100)}%` }}
                                        />
                                    </div>
                                </td>

                                {/* Win Draw Loss */}
                                <td className="px-5 w-[25%] py-3 z-10 relative">
                                    <div className="flex items-center gap-1.5 mb-1.5 font-medium text-xs">
                                        <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">{row.win}%</span>
                                        <span className="text-slate-600">-</span>
                                        <span className="text-slate-400">{row.draw}%</span>
                                        <span className="text-slate-600">-</span>
                                        <span className="text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.3)]">{row.loss}%</span>
                                    </div>
                                    <div className="w-full max-w-[150px] h-1.5 bg-white/5 rounded-full overflow-hidden flex ring-1 ring-white/5">
                                        <div className="h-full bg-emerald-500 transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${row.win}%` }} />
                                        <div className="h-full bg-slate-500 transition-all duration-500" style={{ width: `${row.draw}%` }} />
                                        <div className="h-full bg-red-500 transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${row.loss}%` }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface MostPlayedOpeningsProps {
    onHintWhite?: () => void;
    onHintBlack?: () => void;
}

const MostPlayedOpenings: React.FC<MostPlayedOpeningsProps> = ({ onHintWhite, onHintBlack }) => {
    const [isWhiteExpanded, setIsWhiteExpanded] = useState(false);
    const [isBlackExpanded, setIsBlackExpanded] = useState(false);

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.05),transparent_60%)] pointer-events-none" />
            <div className="pt-6 pb-2 relative z-10 transition-all duration-500">
                <OpeningsTable
                    title={
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-white rounded-sm inline-block mr-2 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                            WHITE - MOST PLAYED OPENINGS
                        </div>
                    }
                    data={MOCK_OPENINGS_WHITE}
                    onHint={onHintWhite}
                    isExpanded={isWhiteExpanded}
                    onToggleExpand={() => setIsWhiteExpanded(!isWhiteExpanded)}
                />

                <div className="h-px bg-white/5 mx-5 my-2"></div>

                <OpeningsTable
                    title={
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-slate-900 rounded-sm inline-block mr-2 border border-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                            BLACK - MOST PLAYED OPENINGS
                        </div>
                    }
                    data={MOCK_OPENINGS_BLACK}
                    onHint={onHintBlack}
                    isExpanded={isBlackExpanded}
                    onToggleExpand={() => setIsBlackExpanded(!isBlackExpanded)}
                />
            </div>
        </Card>
    );
};

export default MostPlayedOpenings;
