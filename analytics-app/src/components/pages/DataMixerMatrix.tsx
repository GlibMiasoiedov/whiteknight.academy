import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Card from '../ui/Card';
import { DASHBOARD_FONTS } from '../../constants/theme';
import { Activity, Sparkles } from 'lucide-react';
import type { TimeClass } from './DataMixerPage';
import type { DataSource } from '../ui/SourceDots';

interface DataMixerMatrixProps {
    variant?: 'platform' | 'performance';
    onHint?: (data?: any) => void;
    activeSources: DataSource[];
    timeClass: TimeClass;
}

type ViewMode = 'day' | 'dayHour' | 'hour';

const DataMixerMatrix: React.FC<DataMixerMatrixProps> = ({ variant = 'platform', onHint, activeSources, timeClass }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('dayHour');
    const [hoveredCell, setHoveredCell] = useState<{
        type: string, x: number, y: number, dayIdx: number, hourIdx: number,
        d: { total: number, chesscom: number, lichess: number, pgn: number, dominant: DataSource | null, wins: number, draws: number, losses: number, winRate: number }, id: string
    } | null>(null);

    const handleMouseMove = (e: React.MouseEvent, type: string, dayIdx: number, hourIdx: number, d: any, id: string) => {
        setHoveredCell({ type, dayIdx, hourIdx, d, id, x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => setHoveredCell(null);

    // Predictable procedural data generation
    const { matrix, dayTotals, hourTotals, globalMax, dayMax, hourMax } = useMemo(() => {
        const timeMultipliers: Record<TimeClass, number> = { all: 1, bullet: 0.14, blitz: 0.40, rapid: 0.34, classical: 0.12 };
        const mult = timeMultipliers[timeClass] || 1;

        let gMax = 0;
        const dTotals = Array(7).fill(0).map(() => ({ total: 0, chesscom: 0, lichess: 0, pgn: 0, dominant: null as DataSource | null, wins: 0, draws: 0, losses: 0, winRate: 0 }));
        const hTotals = Array(24).fill(0).map(() => ({ total: 0, chesscom: 0, lichess: 0, pgn: 0, dominant: null as DataSource | null, wins: 0, draws: 0, losses: 0, winRate: 0 }));

        const mat = Array(7).fill(0).map((_, d) =>
            Array(24).fill(0).map((_, h) => {
                const globalIdx = d * 24 + h;

                let chesscom = 0, lichess = 0, pgn = 0;

                // pseudo random noise, specific to each platform to make them dominant at different times
                if (activeSources.includes('chess.com')) {
                    const cNoise = ((globalIdx * 7) % 11) > 3 ? ((globalIdx * 13) % 12) + 2 : 0;
                    chesscom = Math.max(0, Math.round(cNoise * mult));
                }
                if (activeSources.includes('lichess')) {
                    const lNoise = ((globalIdx * 11) % 13) > 5 ? ((globalIdx * 17) % 10) + 1 : 0;
                    lichess = Math.max(0, Math.round(lNoise * mult));
                }
                if (activeSources.includes('pgn')) {
                    const pNoise = ((globalIdx * 19) % 23) > 18 ? ((globalIdx * 5) % 8) + 1 : 0;
                    pgn = Math.max(0, Math.round(pNoise * mult));
                }

                const total = chesscom + lichess + pgn;
                let dominant: DataSource | null = null;

                if (total > 0) {
                    if (chesscom >= lichess && chesscom >= pgn) dominant = 'chess.com';
                    else if (lichess >= chesscom && lichess >= pgn) dominant = 'lichess';
                    else dominant = 'pgn';
                }

                // Win/Loss generation (deterministic based on globals)
                const winRatio = 0.4 + (((globalIdx * 3) % 40) / 100); // 40-80%
                const drawRatio = 0.1;
                const wins = Math.round(total * winRatio);
                const draws = Math.round(total * drawRatio);
                const losses = Math.max(0, total - wins - draws);
                const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

                const cell = { total, chesscom, lichess, pgn, dominant, wins, draws, losses, winRate };

                if (cell.total > gMax) gMax = cell.total;
                dTotals[d].total += cell.total;
                dTotals[d].chesscom += cell.chesscom;
                dTotals[d].lichess += cell.lichess;
                dTotals[d].pgn += cell.pgn;
                dTotals[d].wins += cell.wins;
                dTotals[d].draws += cell.draws;
                dTotals[d].losses += cell.losses;

                hTotals[h].total += cell.total;
                hTotals[h].chesscom += cell.chesscom;
                hTotals[h].lichess += cell.lichess;
                hTotals[h].pgn += cell.pgn;
                hTotals[h].wins += cell.wins;
                hTotals[h].draws += cell.draws;
                hTotals[h].losses += cell.losses;

                return cell;
            })
        );

        // Final dominant assignment and WR computation for days and hours
        dTotals.forEach(d => {
            if (d.total > 0) {
                if (d.chesscom >= d.lichess && d.chesscom >= d.pgn) d.dominant = 'chess.com';
                else if (d.lichess >= d.chesscom && d.lichess >= d.pgn) d.dominant = 'lichess';
                else d.dominant = 'pgn';
                d.winRate = Math.round((d.wins / d.total) * 100);
            }
        });
        hTotals.forEach(h => {
            if (h.total > 0) {
                if (h.chesscom >= h.lichess && h.chesscom >= h.pgn) h.dominant = 'chess.com';
                else if (h.lichess >= h.chesscom && h.lichess >= h.pgn) h.dominant = 'lichess';
                else h.dominant = 'pgn';
                h.winRate = Math.round((h.wins / h.total) * 100);
            }
        });

        return {
            matrix: mat,
            dayTotals: dTotals,
            hourTotals: hTotals,
            globalMax: gMax || 1,
            dayMax: Math.max(...dTotals.map(d => d.total)) || 1,
            hourMax: Math.max(...hTotals.map(h => h.total)) || 1
        };
    }, [activeSources, timeClass]);

    const handleHintClick = () => {
        if (!onHint) return;
        if (variant === 'platform') {
            onHint('mixer_heatmap');
        } else {
            // Send source-specific hint (remove dots for keys like chess.com -> chesscom)
            const sourceKey = activeSources[0].replace('.', '');
            onHint(`mixer_source_matrix_${sourceKey}`);
        }
    };

    const getPlatformColorClass = (total: number, dominant: DataSource | null) => {
        if (total === 0 || !dominant) return 'bg-white/5 border-white/5 border-transparent';

        const ratio = total / globalMax;

        if (dominant === 'chess.com') { // Emerald
            if (ratio < 0.2) return 'bg-emerald-500/20 border-emerald-500/20 shadow-none border-transparent hover:border-emerald-300';
            if (ratio < 0.5) return 'bg-emerald-500/40 border-emerald-500/30 shadow-none hover:border-emerald-300';
            if (ratio < 0.8) return 'bg-emerald-500/70 border-emerald-400/50 shadow-none hover:border-emerald-300';
            return 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)] hover:border-emerald-300';
        }
        if (dominant === 'lichess') { // Violet/Purple
            if (ratio < 0.2) return 'bg-violet-500/20 border-violet-500/20 shadow-none border-transparent hover:border-violet-300';
            if (ratio < 0.5) return 'bg-violet-500/40 border-violet-500/30 shadow-none hover:border-violet-300';
            if (ratio < 0.8) return 'bg-violet-500/70 border-violet-400/50 shadow-none hover:border-violet-300';
            return 'bg-violet-400 border-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:border-violet-300';
        }
        // PGN (Blue)
        if (ratio < 0.2) return 'bg-blue-500/20 border-blue-500/20 shadow-none border-transparent hover:border-blue-300';
        if (ratio < 0.5) return 'bg-blue-500/40 border-blue-500/30 shadow-none hover:border-blue-300';
        if (ratio < 0.8) return 'bg-blue-500/70 border-blue-400/50 shadow-none hover:border-blue-300';
        return 'bg-blue-400 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:border-blue-300';
    };

    const getPerformanceColorClass = (total: number, winRate: number) => {
        if (total === 0) return 'bg-white/5 border-white/5 shadow-none border-transparent hover:border-white/20';

        // High winrate (Green)
        if (winRate >= 55) {
            if (total > 8) return 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)] hover:border-white/50';
            if (total > 4) return 'bg-emerald-500/70 border-emerald-400/50 shadow-none hover:border-white/50';
            if (total > 2) return 'bg-emerald-500/40 border-emerald-500/30 shadow-none hover:border-white/50';
            return 'bg-emerald-500/20 border-emerald-500/20 shadow-none hover:border-white/50';
        }

        // Average (Neutral/Blueish)
        if (winRate >= 45) {
            if (total > 8) return 'bg-slate-400 border-slate-300 shadow-[0_0_10px_rgba(148,163,184,0.3)] hover:border-white/50';
            if (total > 4) return 'bg-slate-500/70 border-slate-400/50 shadow-none hover:border-white/50';
            if (total > 2) return 'bg-slate-500/40 border-slate-500/30 shadow-none hover:border-white/50';
            return 'bg-slate-500/20 border-slate-500/20 shadow-none hover:border-white/50';
        }

        // Poor winrate (Red)
        if (total > 8) return 'bg-rose-500 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)] hover:border-white/50';
        if (total > 4) return 'bg-rose-500/70 border-rose-400/50 shadow-none hover:border-white/50';
        if (total > 2) return 'bg-rose-500/40 border-rose-500/30 shadow-none hover:border-white/50';
        return 'bg-rose-500/20 border-rose-500/20 shadow-none hover:border-white/50';
    };

    const getCellColorClass = (cell: any) => {
        if (variant === 'platform') return getPlatformColorClass(cell.total, cell.dominant);
        return getPerformanceColorClass(cell.total, cell.winRate);
    };

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getHourLabel = (h: number) => {
        if (h === 0) return '12 AM';
        if (h === 12) return '12 PM';
        return h < 12 ? `${h} AM` : `${h - 12} PM`;
    };

    return (
        <Card padding="p-0" className="flex flex-col bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(52,211,153,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="p-4 flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                        <Activity size={16} className={variant === 'platform' ? "text-emerald-400" : "text-amber-400"} />
                        <div className={DASHBOARD_FONTS.widgetTitle}>
                            {variant === 'platform' ? 'Platform Matrix' : `Activity Matrix (${activeSources.join(', ')})`}
                        </div>
                    </div>
                    {onHint && (
                        <button
                            onClick={handleHintClick}
                            className={`px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5 shrink-0`}
                        >
                            <Sparkles className="w-3 h-3" /> Insights
                        </button>
                    )}
                </div>

                <div className="flex w-full mb-4 relative mt-1">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
                    <div className="grid grid-cols-3 w-full lg:w-3/4 max-w-sm">
                        <button onClick={() => setViewMode('day')} className={`pb-1.5 text-[10px] font-bold tracking-wide transition-all uppercase relative ${viewMode === 'day' ? (variant === 'platform' ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-500 hover:text-slate-300'}`}>
                            Day
                            {viewMode === 'day' && <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-${variant === 'platform' ? 'emerald' : 'amber'}-400 shadow-[0_0_8px_rgba(${variant === 'platform' ? '52,211,153' : '245,158,11'},0.5)]`} />}
                        </button>
                        <button onClick={() => setViewMode('dayHour')} className={`pb-1.5 text-[10px] font-bold tracking-wide transition-all uppercase relative ${viewMode === 'dayHour' ? (variant === 'platform' ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-500 hover:text-slate-300'}`}>
                            Day & Hour
                            {viewMode === 'dayHour' && <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-${variant === 'platform' ? 'emerald' : 'amber'}-400 shadow-[0_0_8px_rgba(${variant === 'platform' ? '52,211,153' : '245,158,11'},0.5)]`} />}
                        </button>
                        <button onClick={() => setViewMode('hour')} className={`pb-1.5 text-[10px] font-bold tracking-wide transition-all uppercase relative ${viewMode === 'hour' ? (variant === 'platform' ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-500 hover:text-slate-300'}`}>
                            Hour
                            {viewMode === 'hour' && <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-${variant === 'platform' ? 'emerald' : 'amber'}-400 shadow-[0_0_8px_rgba(${variant === 'platform' ? '52,211,153' : '245,158,11'},0.5)]`} />}
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col relative z-20 min-h-[170px]">
                    {viewMode === 'day' && (
                        <div className="flex-1 w-full flex">
                            <div className="flex flex-col text-[9px] text-slate-500 font-bold tracking-wider pr-1.5 select-none shrink-0 border-r border-white/5 mr-1.5">
                                <div className="grid grid-rows-7 gap-1 flex-1 items-center">
                                    {daysOfWeek.map((day, i) => <div key={i} className="flex justify-center w-3">{day}</div>)}
                                </div>
                            </div>
                            <div className="flex-1 grid grid-rows-7 gap-1 relative py-1" onMouseLeave={handleMouseLeave}>
                                {dayTotals.map((d, dIdx) => {
                                    const widthPercent = Math.max((d.total / dayMax) * 100, 1);
                                    const isHovered = hoveredCell?.id === `day-${dIdx}`;
                                    return (
                                        <div key={dIdx} className="w-full h-full relative cursor-pointer flex items-center pr-8 hover:z-50 group" onMouseMove={(e) => handleMouseMove(e, 'day', dIdx, -1, d, `day-${dIdx}`)}>
                                            <div className={`h-2.5 rounded-r-sm transition-all duration-300 relative ${isHovered ? 'shadow-[0_0_12px_rgba(255,255,255,0.3)] ring-1 ring-white/30 scale-y-110 z-10' : ''} ${getCellColorClass(d)}`} style={{ width: `${widthPercent}%`, minWidth: d.total === 0 ? '4px' : 'auto' }} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {viewMode === 'dayHour' && (
                        <div className="flex-1 w-full flex flex-col">
                            <div className="flex-1 flex overflow-x-auto scroller-hidden">
                                <div className="flex flex-col text-[9px] text-slate-500 font-bold tracking-wider pr-1.5 select-none shrink-0 border-r border-white/5 mr-1.5">
                                    <div className="grid grid-rows-7 gap-[2px] flex-1 items-center">
                                        {daysOfWeek.map((day, i) => <div key={i} className="flex justify-center w-3 h-full">{day}</div>)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[300px] grid grid-rows-7 gap-[2px]" onMouseLeave={handleMouseLeave}>
                                    {matrix.map((row, dIdx) => (
                                        <div key={dIdx} className="grid grid-cols-24 gap-[2px] h-full w-full">
                                            {row.map((cell, hIdx) => {
                                                const isHovered = hoveredCell?.id === `cell-${dIdx}-${hIdx}`;
                                                return (
                                                    <div key={hIdx} className={`w-full h-full rounded-[1px] border transition-colors relative cursor-pointer hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:z-50 ${isHovered ? 'border-white/50 z-50 ring-1 ring-white' : ''} ${getCellColorClass(cell)}`} onMouseMove={(e) => handleMouseMove(e, 'cell', dIdx, hIdx, cell, `cell-${dIdx}-${hIdx}`)} />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex mt-1 pl-6">
                                <div className="flex-1 relative h-3 text-[8px] text-slate-500 font-bold tracking-wider min-w-[300px]">
                                    {[0, 6, 12, 18].map(h => (
                                        <span key={h} className="absolute whitespace-nowrap -translate-x-1/2" style={{ left: `${(h / 24) * 100}%` }}>{getHourLabel(h)}</span>
                                    ))}
                                    <span className="absolute whitespace-nowrap -translate-x-full" style={{ left: '100%' }}>12 AM</span>
                                </div>
                            </div>

                            {variant === 'platform' ? (
                                <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 pt-2 border-t border-white/5 flex-wrap gap-2">
                                    <span className="uppercase tracking-widest font-bold">Brightness = Volume, Color = Dominant Platform</span>
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-emerald-500" /> <span>Chess.com</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-violet-400" /> <span>Lichess</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-blue-500" /> <span>PGN</span></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 pt-2 border-t border-white/5 flex-wrap gap-2">
                                    <span className="uppercase tracking-widest font-bold">Brightness = Volume, Color = WR%</span>
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-emerald-400 border border-emerald-300" /> <span>&ge; 55%</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-slate-400 border border-slate-300" /> <span>Avg</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-rose-500 border border-rose-400" /> <span>&le; 45%</span></div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {viewMode === 'hour' && (
                        <div className="flex-1 w-full pl-5 flex flex-col">
                            <div className="flex-1 relative border-b border-white/10 pb-1 mt-2 min-h-[140px]" onMouseLeave={handleMouseLeave}>
                                <div className="absolute inset-0 flex items-end gap-[2px] pb-0.5 pointer-events-none">
                                    {hourTotals.map((h, hIdx) => {
                                        const heightPercent = Math.max((h.total / hourMax) * 100, 1);
                                        const isHovered = hoveredCell?.id === `hour-${hIdx}`;
                                        return (
                                            <div key={hIdx} className="flex-1 h-full relative cursor-pointer pointer-events-auto flex justify-center group" onMouseMove={(e) => handleMouseMove(e, 'hour', -1, hIdx, h, `hour-${hIdx}`)}>
                                                <div className={`absolute bottom-0 w-2.5 rounded-t-[1px] transition-all duration-300 ${isHovered ? 'shadow-[0_0_12px_rgba(255,255,255,0.3)] ring-1 ring-white/30 scale-x-110 z-10' : ''} ${getCellColorClass(h)}`} style={{ height: `${heightPercent}%`, minHeight: h.total === 0 ? '4px' : 'auto' }} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex mt-1">
                                <div className="flex-1 relative h-3 text-[8px] text-slate-500 font-bold tracking-wider">
                                    {[0, 6, 12, 18].map(h => <span key={h} className="absolute whitespace-nowrap -translate-x-1/2" style={{ left: `${(h / 24) * 100}%` }}>{getHourLabel(h)}</span>)}
                                    <span className="absolute whitespace-nowrap -translate-x-full" style={{ left: '100%' }}>12 AM</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {hoveredCell && createPortal(
                    <div
                        className="fixed z-[55] pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95 bg-[#0F1623]/95 backdrop-blur-md text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] whitespace-nowrap flex flex-col border border-emerald-500/30"
                        style={{
                            left: `${hoveredCell.type === 'day' ? hoveredCell.x + 16 : hoveredCell.x}px`,
                            top: `${hoveredCell.type === 'day' ? hoveredCell.y : hoveredCell.y - 12}px`,
                            transform: hoveredCell.type === 'day' ? 'translateY(-50%)' : 'translate(-50%, -100%)',
                            alignItems: hoveredCell.type === 'day' ? 'flex-start' : 'center',
                            borderColor: variant === 'platform' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)',
                            boxShadow: variant === 'platform' ? '0 0 20px rgba(16,185,129,0.2)' : '0 0 20px rgba(245,158,11,0.2)'
                        }}
                    >
                        <span className="font-bold mb-0.5">
                            {hoveredCell.type === 'day' && fullDaysOfWeek[hoveredCell.dayIdx]}
                            {hoveredCell.type === 'cell' && fullDaysOfWeek[hoveredCell.dayIdx]}
                            {hoveredCell.type === 'hour' && `${getHourLabel(hoveredCell.hourIdx)} - ${getHourLabel(hoveredCell.hourIdx + 1)}`}
                        </span>
                        {hoveredCell.type === 'cell' && (
                            <span className="text-slate-600 mb-1">{getHourLabel(hoveredCell.hourIdx)} - {getHourLabel(hoveredCell.hourIdx + 1)}</span>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-white font-black">{hoveredCell.d.total} games</span>
                            {hoveredCell.d.total > 0 && variant === 'platform' && (
                                <div className="flex items-center gap-1.5 text-[9px] font-bold">
                                    {hoveredCell.d.chesscom > 0 && <span className="text-emerald-400">{hoveredCell.d.chesscom} <span className="text-slate-500 font-medium">ch</span></span>}
                                    {hoveredCell.d.lichess > 0 && <span className="text-violet-400">{hoveredCell.d.lichess} <span className="text-slate-500 font-medium">li</span></span>}
                                    {hoveredCell.d.pgn > 0 && <span className="text-blue-400">{hoveredCell.d.pgn} <span className="text-slate-500 font-medium">pgn</span></span>}
                                </div>
                            )}
                            {hoveredCell.d.total > 0 && variant === 'performance' && (
                                <div className="flex items-center gap-1.5 text-[9px] font-bold">
                                    <span className="text-emerald-400">{hoveredCell.d.wins} <span className="text-slate-500 font-medium">W</span></span>
                                    <span className="text-slate-400">{hoveredCell.d.draws} <span className="text-slate-500 font-medium">D</span></span>
                                    <span className="text-rose-400">{hoveredCell.d.losses} <span className="text-slate-500 font-medium">L</span></span>
                                    <span className="text-white ml-1 bg-white/10 px-1 py-0.5 rounded leading-none">{hoveredCell.d.winRate}%</span>
                                </div>
                            )}
                        </div>
                        <div className={`absolute border-[5px] border-transparent ${hoveredCell.type === 'day' ? 'top-1/2 right-full -translate-y-1/2 border-r-[#0F1623]' : 'top-full left-1/2 -translate-x-1/2 border-t-[#0F1623]'}`} />
                    </div>,
                    document.body
                )}
            </div>
        </Card>
    );
};

export default DataMixerMatrix;
