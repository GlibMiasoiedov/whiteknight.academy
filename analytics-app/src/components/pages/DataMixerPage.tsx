import React, { useState, useCallback } from 'react';
import {
    Layers, AlertTriangle, Combine, LayoutGrid,
    TrendingUp, Swords, Sparkles, User, Target, Search, Loader2, X, FileUp
} from 'lucide-react';
import Card from '../ui/Card';
import SourceDots, { SOURCE_META } from '../ui/SourceDots';
import type { DataSource } from '../ui/SourceDots';
import SourceCard, { AddSourceCard } from '../ui/SourceCard';
import type { SourceConfig } from '../ui/SourceCard';
import { DASHBOARD_FONTS } from '../../constants/theme';
import DataMixerMatrix from './DataMixerMatrix';

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'combined' | 'split' | 'compare';
export type TimeClass = 'all' | 'bullet' | 'blitz' | 'rapid' | 'classical';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SOURCES: SourceConfig[] = [
    { id: 'chess.com', username: 'GrandmasterJD', games: 847, rating: 1523, ratingSystem: 'Elo', lastSync: '2 min ago' },
    { id: 'lichess', username: 'DrNykterstein', games: 1203, rating: 1847, ratingSystem: 'Glicko-2', lastSync: '5 min ago' },
    { id: 'pgn', username: 'Tournament 2024.pgn', games: 156, rating: null, ratingSystem: null, lastSync: 'Yesterday' },
];

// Games count by time class (for filtering display)
const GAMES_BY_TIME: Record<TimeClass, number> = { all: 2206, bullet: 312, blitz: 887, rapid: 749, classical: 258 };

const MOCK_OPENINGS: {
    eco: string; name: string; games: number; winRate: number; drawRate: number; lossRate: number; sources: DataSource[]
}[] = [
        { eco: 'B20', name: 'Sicilian Defense', games: 234, winRate: 76.6, drawRate: 11.2, lossRate: 12.2, sources: ['chess.com', 'lichess'] },
        { eco: 'C50', name: 'Italian Game', games: 189, winRate: 71.2, drawRate: 14.8, lossRate: 14.0, sources: ['chess.com', 'lichess', 'pgn'] },
        { eco: 'D06', name: "Queen's Gambit", games: 145, winRate: 58.3, drawRate: 22.1, lossRate: 19.6, sources: ['lichess'] },
        { eco: 'C44', name: 'Scotch Game', games: 98, winRate: 82.1, drawRate: 8.2, lossRate: 9.7, sources: ['chess.com'] },
        { eco: 'A45', name: 'Indian Defense', games: 87, winRate: 64.7, drawRate: 15.3, lossRate: 20.0, sources: ['chess.com', 'pgn'] },
        { eco: 'B01', name: 'Scandinavian Defense', games: 76, winRate: 55.2, drawRate: 18.5, lossRate: 26.3, sources: ['lichess', 'pgn'] },
        { eco: 'C60', name: 'Ruy Lopez', games: 62, winRate: 69.4, drawRate: 16.1, lossRate: 14.5, sources: ['chess.com', 'lichess'] },
    ];


// ─── Sub-components ───────────────────────────────────────────────────────────

const WDLBar: React.FC<{ w: number; d: number; l: number }> = ({ w, d, l }) => (
    <div className="flex h-[4px] rounded-full overflow-hidden w-28 bg-white/5">
        <div className="transition-all duration-700" style={{ width: `${w}%`, background: '#10B981' }} />
        <div className="transition-all duration-700" style={{ width: `${d}%`, background: 'rgba(255,255,255,0.15)' }} />
        <div className="transition-all duration-700" style={{ width: `${l}%`, background: '#EF4444' }} />
    </div>
);

interface KPICardProps {
    label: string;
    value: string;
    sub?: string;
    sources: DataSource[];
    activeSources: DataSource[];
    color?: string;
}
const KPICard: React.FC<KPICardProps> = ({ label, value, sub, sources, activeSources, color }) => (
    <Card className="flex-1 min-w-[130px] bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
            <span className={DASHBOARD_FONTS.label}>{label}</span>
            <SourceDots sources={sources} activeSources={activeSources} />
        </div>
        <div className={DASHBOARD_FONTS.kpi} style={color ? { color } : {}}>{value}</div>
        {sub && <div className="text-[10px] text-slate-600 mt-1.5">{sub}</div>}
    </Card>
);


const RatingChart: React.FC<{ activeSources: DataSource[] }> = ({ activeSources }) => {
    const gridValues = [2000, 1750, 1500, 1250];
    return (
        <div className="px-6 pt-4 pb-5">
            <div className="relative h-36">
                {gridValues.map((v, i) => (
                    <div key={v} className="absolute left-0 w-full flex items-center" style={{ top: `${i * 33.3}%` }}>
                        <span className="text-[9px] font-mono text-slate-700 w-8 text-right pr-2 flex-shrink-0">{v}</span>
                        <div className="flex-1 border-t border-white/5" />
                    </div>
                ))}
                <svg className="absolute" style={{ left: 36, top: 0, width: 'calc(100% - 44px)', height: '100%' }} viewBox="0 0 400 144" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="dmLg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E8E8E8" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#E8E8E8" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="dmCg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7FA650" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#7FA650" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {activeSources.includes('lichess') && (
                        <>
                            <path d="M0,52 C30,50 60,48 100,42 C160,36 220,30 280,26 C340,23 380,20 400,18" fill="none" stroke="#E8E8E8" strokeWidth="1.5" opacity="0.5" />
                            <path d="M0,52 C30,50 60,48 100,42 C160,36 220,30 280,26 C340,23 380,20 400,18 L400,144 L0,144Z" fill="url(#dmLg)" />
                        </>
                    )}
                    {activeSources.includes('chess.com') && (
                        <>
                            <path d="M0,88 C30,85 60,82 100,78 C160,72 220,66 280,60 C340,56 380,54 400,52" fill="none" stroke="#7FA650" strokeWidth="1.5" opacity="0.5" />
                            <path d="M0,88 C30,85 60,82 100,78 C160,72 220,66 280,60 C340,56 380,54 400,52 L400,144 L0,144Z" fill="url(#dmCg)" />
                        </>
                    )}
                </svg>
                <div className="absolute bottom-0 right-0 flex gap-4">
                    {activeSources.includes('lichess') && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-[2px] rounded-full bg-[#E8E8E8] opacity-40" />
                            <span className="text-[9px] text-slate-500">Lichess · 1,847</span>
                        </div>
                    )}
                    {activeSources.includes('chess.com') && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-[2px] rounded-full bg-[#7FA650] opacity-40" />
                            <span className="text-[9px] text-slate-500">Chess.com · 1,523</span>
                        </div>
                    )}
                </div>
            </div>
            {activeSources.includes('chess.com') && activeSources.includes('lichess') && (
                <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[9.5px] text-amber-500/60">
                    <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" />
                    Chess.com (Elo) and Lichess (Glicko-2) use different rating scales — direct comparison is not meaningful.
                </div>
            )}
        </div>
    );
};

// ─── vs Opponent Subcomponents ───────────────────────────────────────────────

const CompareKPI: React.FC<{ label: string; valYou: string; valOpp: string; youBetter?: boolean; isNeutral?: boolean }> = ({ label, valYou, valOpp, youBetter, isNeutral }) => {
    const youColor = isNeutral ? 'text-white' : youBetter ? 'text-emerald-400' : 'text-rose-400';
    const oppColor = isNeutral ? 'text-white' : !youBetter ? 'text-emerald-400' : 'text-rose-400';
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors px-2 -mx-2 rounded">
            <div className={`w-[40%] text-right font-bold text-sm ${youColor}`}>{valYou}</div>
            <div className="w-[20%] text-center text-[10px] uppercase font-bold text-slate-500 tracking-wider">{label}</div>
            <div className={`w-[40%] text-left font-bold text-sm ${oppColor}`}>{valOpp}</div>
        </div>
    );
};

// ─── View mode config ──────────────────────────────────────────────────────────

const VIEW_MODES: { id: ViewMode; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'combined', label: 'Aggregated', Icon: ({ size, className }) => <Combine size={size} className={className} /> },
    { id: 'split', label: 'By Source', Icon: ({ size, className }) => <LayoutGrid size={size} className={className} /> },
    { id: 'compare', label: 'vs Opponent', Icon: ({ size, className }) => <Swords size={size} className={className} /> },
];

const TIME_CLASSES: { id: TimeClass; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'bullet', label: 'Bullet' },
    { id: 'blitz', label: 'Blitz' },
    { id: 'rapid', label: 'Rapid' },
    { id: 'classical', label: 'Classical' },
];

// ─── Main page ────────────────────────────────────────────────────────────────

interface DataMixerPageProps {
    onNavigate?: (tab: string) => void;
    isDemoMode: boolean;
    isConnected?: boolean;
    theme: { color: string };
    onReportWidgetHint?: (hintKey: string | null, data?: any) => void;
}

const DataMixerPage: React.FC<DataMixerPageProps> = ({ isDemoMode, isConnected, theme, onReportWidgetHint }) => {
    const [activeSources, setActiveSources] = useState<DataSource[]>(['chess.com', 'lichess', 'pgn']);
    const [timeClass, setTimeClass] = useState<TimeClass>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('combined');

    const toggleSource = (id: DataSource) =>
        setActiveSources(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    // Time multiplier applied to mock data sizes
    const timeMultipliers: Record<TimeClass, number> = { all: 1, bullet: 0.14, blitz: 0.40, rapid: 0.34, classical: 0.12 };
    const mult = timeMultipliers[timeClass];

    const totalGames = Math.round(GAMES_BY_TIME[timeClass]);
    // Also scale opening games counts and modify winrate slightly to show visual change
    const visibleOpenings = MOCK_OPENINGS
        .filter(o => o.sources.some(s => activeSources.includes(s)))
        .map(o => ({
            ...o,
            games: Math.max(1, Math.round(o.games * mult)),
            winRate: Math.min(100, Math.max(0, parseFloat((o.winRate + (timeClass === 'blitz' ? 2.5 : timeClass === 'bullet' ? -4.3 : timeClass === 'rapid' ? 4.1 : 0)).toFixed(1))))
        }));

    // Adjust peak rating randomly based on time class just for simple visual indication
    const ratingOffset = timeClass === 'rapid' ? 50 : timeClass === 'blitz' ? -30 : timeClass === 'bullet' ? -80 : 0;
    const peakRating = activeSources.includes('lichess') ? (1847 + ratingOffset).toLocaleString() : activeSources.includes('chess.com') ? (1523 + ratingOffset).toLocaleString() : '—';
    const peakRatingSub = activeSources.includes('lichess') ? 'Lichess · Glicko-2' : 'Chess.com · Elo';

    // Adjust accuracy
    const accBase = 78.4;
    const accOffset = timeClass === 'rapid' ? 3.2 : timeClass === 'blitz' ? -2.1 : timeClass === 'bullet' ? -5.5 : 0;
    const accuracy = activeSources.includes('chess.com') ? (accBase + accOffset).toFixed(1) + '%' : '—';
    const accuracySub = activeSources.includes('chess.com') ? 'Chess.com only' : 'Requires Chess.com';

    // Adjust Win Rate
    const wrOffset = timeClass === 'rapid' ? 4.1 : timeClass === 'blitz' ? -2.3 : timeClass === 'bullet' ? -6.2 : timeClass === 'classical' ? 5.5 : 0;
    const dynamicWR = (64.3 + wrOffset).toFixed(1);
    const winGames = Math.round(totalGames * ((64.3 + wrOffset) / 100));
    const drawGames = Math.round(totalGames * 0.18);
    const lossGames = Math.max(0, totalGames - winGames - drawGames);
    const dynamicWDL = `W ${winGames} · D ${drawGames} · L ${lossGames}`;



    // ── Opponent state ─────────────────────────────────────────────────────────
    type OpponentConfig = { name: string; username: string; source: 'chess.com' | 'lichess' | 'pgn'; rating: number | null; games: number };
    const [opponent, setOpponent] = useState<OpponentConfig | null>(null);
    const [oppSource, setOppSource] = useState<'chess.com' | 'lichess' | 'pgn'>('chess.com');
    const [oppUsername, setOppUsername] = useState('');
    const [oppLoading, setOppLoading] = useState(false);

    // TODO(backend): Replace with real Chess.com/Lichess API call
    const loadOpponent = useCallback(() => {
        if (!oppUsername.trim()) return;
        setOppLoading(true);
        setTimeout(() => {
            const mockData: Record<string, { rating: number | null; games: number }> = {
                'chess.com': { rating: 2882, games: 3247 },
                'lichess': { rating: 3205, games: 5123 },
                'pgn': { rating: null, games: 156 },
            };
            setOpponent({ name: oppUsername.trim(), username: oppUsername.trim(), source: oppSource, rating: mockData[oppSource].rating, games: mockData[oppSource].games });
            setOppLoading(false);
        }, 1200);
    }, [oppUsername, oppSource]);


    // PRO Plan but NO DATA connected
    if (isDemoMode && !isConnected) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 mt-12 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Layers size={32} className="text-purple-500" />
                </div>
                <h2 className={DASHBOARD_FONTS.h2 + " mb-2"}>Data Mixer Unavailable</h2>
                <p className={DASHBOARD_FONTS.body + " max-w-md mb-8"}>Please connect your chess accounts or upload a PGN file on the Home screen to start mixing your data.</p>
            </div>
        );
    }

    // MAIN CONTENT (For PRO connected, or FREE blurred)
    const content = (
        <div className="space-y-6 animate-in fade-in pb-8">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-white/8 pb-5">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${theme.color}15`, border: `1px solid ${theme.color}30` }}>
                            <Layers size={16} style={{ color: theme.color }} />
                        </div>
                        <h1 className={DASHBOARD_FONTS.h1}>Data Mixer</h1>
                    </div>
                    <p className={DASHBOARD_FONTS.body}>
                        Aggregate your chess games from Chess.com, Lichess, and PGN files — separately or all at once.
                    </p>
                </div>

                {/* View mode switcher */}
                <div className="flex gap-1 bg-white/3 border border-white/5 rounded-xl p-1 flex-shrink-0">
                    {VIEW_MODES.map(m => {
                        const isActive = viewMode === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => {
                                    setViewMode(m.id);
                                    if (onReportWidgetHint) onReportWidgetHint('mixer_mode_' + m.id);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px] font-semibold transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                style={isActive ? { background: `${theme.color}18`, color: theme.color } : {}}
                            >
                                <m.Icon size={13} />
                                <span>{m.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Source cards ─────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3">
                {MOCK_SOURCES.map((cfg, i) => (
                    <SourceCard
                        key={cfg.id}
                        config={cfg}
                        enabled={activeSources.includes(cfg.id)}
                        onToggle={() => toggleSource(cfg.id)}
                        animDelay={i * 80}
                    />
                ))}
                <AddSourceCard />
            </div>

            {/* ── Time filter ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className={`${DASHBOARD_FONTS.label} mr-1`}>Time:</span>
                {TIME_CLASSES.map(tc => {
                    const isActive = timeClass === tc.id;
                    return (
                        <button
                            key={tc.id}
                            onClick={() => {
                                setTimeClass(tc.id);
                                if (onReportWidgetHint) onReportWidgetHint('mixer_time_' + tc.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 border ${isActive ? 'text-white border-transparent' : 'bg-white/2 text-slate-500 hover:text-slate-300 border-white/5 hover:border-white/10'}`}
                            style={isActive ? { background: `${theme.color}18`, borderColor: `${theme.color}35`, color: theme.color } : {}}
                        >
                            {tc.label}
                        </button>
                    );
                })}
                <div className="flex-1" />
                <span className={DASHBOARD_FONTS.small}>
                    {totalGames.toLocaleString()} games · {activeSources.length} source{activeSources.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* ── Compare mode CTA ──────────────────────────────────────────────── */}
            {viewMode === 'compare' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Head-to-Head Banner */}
                    <Card padding="p-0" className="bg-gradient-to-r from-violet-900/40 via-[#0F1623] to-rose-900/40 border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="relative z-10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* You */}
                            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-violet-400 mb-1">Player 1</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                        <User size={24} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">You</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Aggregated Stats</div>
                                    </div>
                                </div>
                            </div>

                            {/* VS Badge */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-[#0F1623] border border-white/20 flex items-center justify-center shadow-inner z-20">
                                    <span className="text-sm font-black text-slate-300 italic pr-0.5">VS</span>
                                </div>
                                <div className="h-px w-32 bg-gradient-to-r from-violet-500 via-white/50 to-rose-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 md:w-full md:max-w-[200px]"></div>
                            </div>

                            {/* Opponent Panel */}
                            <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-rose-400 mb-1">Player 2</div>

                                {opponent ? (
                                    /* ── Configured State ── */
                                    <div className="flex items-center gap-3 flex-row-reverse md:flex-row">
                                        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(243,113,113,0.5)]">
                                            <User size={24} className="text-rose-400" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xl font-bold text-white leading-tight">{opponent.name}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${opponent.source === 'chess.com' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    opponent.source === 'lichess' ? 'bg-violet-500/20 text-violet-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>{SOURCE_META[opponent.source].label}</span>
                                                {opponent.rating != null && <span className="text-xs text-slate-400">{opponent.rating.toLocaleString()} rating</span>}
                                                <span className="text-xs text-slate-500">{opponent.games.toLocaleString()} games</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setOpponent(null); setOppUsername(''); }}
                                            className="ml-2 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                            title="Change opponent"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    /* ── Setup Form ── */
                                    <div className="w-full max-w-[300px] text-left">
                                        {/* Source selector tabs */}
                                        <div className="flex gap-1 mb-3">
                                            {(['chess.com', 'lichess', 'pgn'] as const).map(src => (
                                                <button
                                                    key={src}
                                                    onClick={() => setOppSource(src)}
                                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-200 tracking-wide uppercase ${oppSource === src
                                                        ? src === 'chess.com' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                                            : src === 'lichess' ? 'bg-violet-500/20 border-violet-500/40 text-violet-400'
                                                                : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                                        : 'bg-white/3 border-white/5 text-slate-500 hover:text-slate-300'
                                                        }`}
                                                >
                                                    {src === 'chess.com' ? 'Chess.com' : src === 'lichess' ? 'Lichess' : 'PGN'}
                                                </button>
                                            ))}
                                        </div>

                                        {oppSource !== 'pgn' ? (
                                            /* Username input */
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                                    <input
                                                        type="text"
                                                        value={oppUsername}
                                                        onChange={e => setOppUsername(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && !oppLoading && loadOpponent()}
                                                        placeholder={`${oppSource === 'chess.com' ? 'Chess.com' : 'Lichess'} username...`}
                                                        className="w-full pl-7 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/50 focus:bg-white/8 transition-colors"
                                                    />
                                                </div>
                                                <button
                                                    onClick={loadOpponent}
                                                    disabled={!oppUsername.trim() || oppLoading}
                                                    className="px-3 py-1.5 bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold rounded-lg transition-all uppercase tracking-wide flex items-center gap-1.5"
                                                >
                                                    {oppLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                                                    Load
                                                </button>
                                            </div>
                                        ) : (
                                            /* PGN info */
                                            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/15 rounded-lg">
                                                <FileUp size={14} className="text-blue-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-[10px] font-bold text-blue-300">Enter a PGN username</div>
                                                    <div className="text-[9px] text-slate-500 mt-0.5">We will match games from your PGN imports</div>
                                                </div>
                                            </div>
                                        )}
                                        {oppSource === 'pgn' && (
                                            <div className="flex gap-2 mt-2">
                                                <div className="relative flex-1">
                                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                                    <input
                                                        type="text"
                                                        value={oppUsername}
                                                        onChange={e => setOppUsername(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && !oppLoading && loadOpponent()}
                                                        placeholder="Opponent name in PGN..."
                                                        className="w-full pl-7 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                                    />
                                                </div>
                                                <button
                                                    onClick={loadOpponent}
                                                    disabled={!oppUsername.trim() || oppLoading}
                                                    className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold rounded-lg transition-all uppercase tracking-wide flex items-center gap-1.5"
                                                >
                                                    {oppLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                                                    Match
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* KPI Comparison */}
                        <Card padding="p-6" className="bg-gradient-to-b from-[#0F1623] to-[#0B1220] border-white/5 xl:col-span-1 shadow-lg">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                                <Target size={16} className="text-violet-400" />
                                <h3 className={DASHBOARD_FONTS.widgetTitle}>Head-to-Head KPIs</h3>
                            </div>
                            <div className="flex flex-col gap-1">
                                <CompareKPI label="Rating (Peak)" valYou={peakRating} valOpp={(2882 + ratingOffset).toLocaleString()} youBetter={false} />
                                <CompareKPI label="Win Rate" valYou="64.3%" valOpp="82.1%" youBetter={false} />
                                <CompareKPI label="Accuracy" valYou={accuracy} valOpp="94.2%" youBetter={false} />
                                <CompareKPI label="Blunders/Game" valYou="1.2" valOpp="0.1" youBetter={false} />
                                <CompareKPI label="Best Time Controls" valYou="Rapid" valOpp="Classical" isNeutral />
                                <CompareKPI label="Active Sources" valYou={activeSources.length.toString()} valOpp="2" youBetter={activeSources.length > 2} />
                            </div>
                        </Card>

                        {/* Openings Head-to-Head */}
                        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 xl:col-span-2 shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="px-6 py-5 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Swords size={16} className="text-rose-400" />
                                    <div className={DASHBOARD_FONTS.widgetTitle}>Repertoire Clash</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {onReportWidgetHint && (
                                        <button
                                            onClick={() => onReportWidgetHint('mixer_opponent')}
                                            className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                                        >
                                            <Sparkles className="w-3 h-3" /> Insights
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="overflow-auto max-h-[320px] p-6 pt-0">
                                <div className="text-[11px] text-slate-400 mb-4 mt-4 leading-relaxed bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl flex items-start gap-2">
                                    <AlertTriangle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        Based on your combined data and <strong>{opponent?.name ?? 'your opponent'}</strong>'s history, here are the openings where your repertoires overlap.
                                    </div>
                                </div>

                                <div className="grid border-b border-white/5 pb-2 mb-2" style={{ gridTemplateColumns: 'minmax(120px, 1.5fr) 1fr 1fr' }}>
                                    <span className={DASHBOARD_FONTS.label}>Opening</span>
                                    <span className={DASHBOARD_FONTS.label + " text-center"}>Your Win %</span>
                                    <span className={DASHBOARD_FONTS.label + " text-center"}>Opponent Win %</span>
                                </div>

                                {[
                                    { name: 'Sicilian Defense', you: 76.6, opp: 88.4 },
                                    { name: 'Italian Game', you: 71.2, opp: 65.1 },
                                    { name: "Queen's Gambit", you: 58.3, opp: 91.2 },
                                    { name: 'Ruy Lopez', you: 69.4, opp: 85.0 },
                                ].map((o, i) => (
                                    <div key={i} className="grid items-center py-2.5 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors -mx-4 px-4 rounded" style={{ gridTemplateColumns: 'minmax(120px, 1.5fr) 1fr 1fr' }}>
                                        <span className="text-xs font-bold text-white truncate pr-2">{o.name}</span>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`text-xs font-bold ${o.you > o.opp ? 'text-emerald-400' : 'text-slate-300'}`}>{o.you}%</span>
                                            {o.you > o.opp && <TrendingUp size={12} className="text-emerald-400" />}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`text-xs font-bold ${o.opp > o.you ? 'text-rose-400' : 'text-slate-300'}`}>{o.opp}%</span>
                                            {o.opp > o.you && <TrendingUp size={12} className="text-rose-400" />}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* ── KPI row ───────────────────────────────────────────────────────── */}
            {viewMode !== 'compare' && (
                <div className="flex flex-wrap gap-3">
                    <KPICard label="Total Games" value={totalGames.toLocaleString()} sub="from active sources" sources={['chess.com', 'lichess', 'pgn']} activeSources={activeSources} color={theme.color} />
                    <KPICard label="Win Rate" value={`${dynamicWR}%`} sub={dynamicWDL} sources={['chess.com', 'lichess']} activeSources={activeSources} />
                    <KPICard label="Peak Rating" value={peakRating} sub={peakRatingSub} sources={['lichess', 'chess.com']} activeSources={activeSources} />
                    <KPICard label="Accuracy" value={accuracy} sub={accuracySub} sources={['chess.com']} activeSources={activeSources} />
                </div>
            )}

            {/* ── Split view notice ─────────────────────────────────────────────── */}
            {viewMode === 'split' && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/3 border border-white/5 text-[11px] text-slate-400">
                    <LayoutGrid size={14} className="flex-shrink-0" style={{ color: theme.color }} />
                    By Source — each widget shows data broken down per platform. Toggle sources above to include or exclude them.
                </div>
            )}

            {/* ── Widgets grid ──────────────────────────────────────────────────── */}
            {viewMode !== 'compare' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Opening Repertoire */}
                    <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        <div className="px-6 py-5 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} style={{ color: theme.color }} />
                                <div className={DASHBOARD_FONTS.widgetTitle}>Opening Repertoire</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <SourceDots sources={['chess.com', 'lichess', 'pgn']} activeSources={activeSources} />
                                {onReportWidgetHint && (
                                    <button
                                        onClick={() => onReportWidgetHint('mixer_openings')}
                                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-3 h-3" /> Insights
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="overflow-auto max-h-[320px]">
                            {visibleOpenings.length > 0 ? (
                                <>
                                    <div className="grid px-6 py-2 border-b border-white/5" style={{ gridTemplateColumns: '24px 36px 1fr auto 112px 44px 36px' }}>
                                        {['#', 'ECO', 'Name', '', 'W / D / L', 'Win%', 'N'].map((h, i) => (
                                            <span key={i} className={DASHBOARD_FONTS.label} style={{ textAlign: i > 3 ? 'right' : 'left' }}>{h}</span>
                                        ))}
                                    </div>
                                    {visibleOpenings.map((o, idx) => (
                                        <div
                                            key={o.eco}
                                            className="grid px-6 py-2.5 items-center border-b border-white/3 hover:bg-white/2 transition-colors cursor-pointer"
                                            style={{ gridTemplateColumns: '24px 36px 1fr auto 112px 44px 36px', gap: 8 }}
                                        >
                                            <span className="text-[10px] font-mono text-slate-700">{idx + 1}</span>
                                            <span className="text-[10px] font-mono text-slate-600">{o.eco}</span>
                                            <span className="text-[12.5px] font-medium text-white truncate">{o.name}</span>
                                            <SourceDots sources={o.sources} activeSources={activeSources} size={5} />
                                            <WDLBar w={o.winRate} d={o.drawRate} l={o.lossRate} />
                                            <span className={`text-[11.5px] font-bold text-right ${o.winRate > 65 ? 'text-emerald-400' : o.winRate > 50 ? 'text-amber-400' : 'text-red-400'}`}>{o.winRate}%</span>
                                            <span className="text-[10px] text-slate-600 text-right">{o.games}</span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="py-16 text-center text-slate-600 text-xs">Select at least one source to view openings</div>
                            )}
                        </div>
                    </Card>

                    {/* Activity Heatmap */}
                    <DataMixerMatrix variant="platform" activeSources={activeSources} timeClass={timeClass} onHint={onReportWidgetHint} />

                    {/* Rating Dynamics — full width */}
                    <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 xl:col-span-2">
                        <div className="px-6 py-5 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} style={{ color: theme.color }} />
                                <div className={DASHBOARD_FONTS.widgetTitle}>Rating Dynamics</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <SourceDots sources={['chess.com', 'lichess']} activeSources={activeSources} />
                                {onReportWidgetHint && (
                                    <button
                                        onClick={() => onReportWidgetHint('mixer_rating')}
                                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-3 h-3" /> Insights
                                    </button>
                                )}
                            </div>
                        </div>
                        <RatingChart activeSources={activeSources} />
                    </Card>
                </div>
            )}

            {/* ── Split Widgets grid ──────────────────────────────────────────────── */}
            {viewMode === 'split' && (
                <div className={`grid grid-cols-1 ${activeSources.length === 2 ? 'xl:grid-cols-2' : activeSources.length === 3 ? 'xl:grid-cols-3' : ''} gap-6`}>
                    {activeSources.map(source => {
                        const sMeta = SOURCE_META[source];
                        // Filter data to only this source
                        const sourceOpenings = visibleOpenings.filter(o => o.sources.includes(source));

                        const renderIcon = () => {
                            if (source === 'chess.com') return <div className="w-4 h-4 rounded-sm bg-[#7FA650]" />;
                            if (source === 'lichess') return <div className="w-4 h-4 rounded-sm bg-white" />;
                            if (source === 'pgn') return <div className="w-4 h-4 rounded-sm bg-[#60A5FA]" />;
                            return <Layers size={16} style={{ color: sMeta.color }} />;
                        };

                        return (
                            <div key={source} className="space-y-6">
                                {/* Source Header */}
                                <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sMeta.color}20` }}>
                                        {renderIcon()}
                                    </div>
                                    <h3 className="text-lg font-bold text-white tracking-wide">{sMeta.label}</h3>
                                </div>

                                {/* Opening Repertoire */}
                                <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 transition-all duration-300">
                                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between gap-2">
                                        <div className={DASHBOARD_FONTS.widgetTitle}>Opening Repertoire ({source})</div>
                                        {onReportWidgetHint && (
                                            <button
                                                onClick={() => onReportWidgetHint(`mixer_openings_${source.replace('.', '')}`)}
                                                className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5 shrink-0"
                                            >
                                                <Sparkles className="w-3 h-3" /> Insights
                                            </button>
                                        )}
                                    </div>
                                    <div className="overflow-auto max-h-[250px]">
                                        {sourceOpenings.length > 0 ? (
                                            <>
                                                <div className="grid px-4 py-2 border-b border-white/5" style={{ gridTemplateColumns: '24px 36px 1fr 44px 36px' }}>
                                                    {['#', 'ECO', 'Name', 'Win%', 'N'].map((h, i) => (
                                                        <span key={i} className={DASHBOARD_FONTS.label} style={{ textAlign: i > 2 ? 'right' : 'left' }}>{h}</span>
                                                    ))}
                                                </div>
                                                {sourceOpenings.slice(0, 5).map((o, idx) => (
                                                    <div
                                                        key={o.eco}
                                                        className="grid px-4 py-2.5 items-center border-b border-white/3 hover:bg-white/2 transition-colors cursor-pointer"
                                                        style={{ gridTemplateColumns: '24px 36px 1fr 44px 36px', gap: 6 }}
                                                    >
                                                        <span className="text-[10px] font-mono text-slate-700">{idx + 1}</span>
                                                        <span className="text-[10px] font-mono text-slate-600">{o.eco}</span>
                                                        <span className="text-[11.5px] font-medium text-white truncate">{o.name}</span>
                                                        <span className={`text-[10.5px] font-bold text-right ${o.winRate > 65 ? 'text-emerald-400' : o.winRate > 50 ? 'text-amber-400' : 'text-red-400'}`}>{o.winRate}%</span>
                                                        <span className="text-[10px] text-slate-600 text-right">{o.games}</span>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="py-8 text-center text-slate-600 text-[10px]">No openings found</div>
                                        )}
                                    </div>
                                </Card>

                                {/* Activity Heatmap */}
                                <DataMixerMatrix variant="performance" activeSources={[source]} timeClass={timeClass} onHint={onReportWidgetHint} />

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    // If Free Mode (not demo mode), show the overlay
    if (!isDemoMode) {
        return (
            <div className="relative">
                <div className="opacity-40 pointer-events-none select-none blur-sm grayscale-[0.5]">
                    {content}
                </div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <div className="sticky top-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-br from-[#080C14] to-[#0A0F1A] border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl mb-6 border border-white/10">
                            <Layers size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2">Chess Analytics PRO</h2>
                        <h3 className="text-xl font-bold text-white mb-4">Master Chess Faster with AI.</h3>
                        <p className="text-slate-400 mb-8 max-w-sm">Unlock the advanced Data Mixer. Aggregate accounts, overlay PGN games, and unlock the Head-to-Head opponent comparison tool.</p>
                        <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-0.5">
                            Upgrade Now · €15/mo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Pro mode connected
    return content;
};

export default DataMixerPage;
