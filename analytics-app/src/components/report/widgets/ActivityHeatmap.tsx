import React, { useMemo, useState } from 'react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import { Activity, Sparkles } from 'lucide-react';

interface ActivityHeatmapProps {
    onHint?: (data?: any) => void;
}

type ViewMode = 'day' | 'dayHour' | 'hour';

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ onHint }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('dayHour');
    const [hoveredCell, setHoveredCell] = useState<{
        type: string, x: number, y: number, dayIdx: number, hourIdx: number,
        d: { total: number, wins: number, draws: number, losses: number }, id: string
    } | null>(null);

    // Track mouse movement to absolutely position a global tooltip
    const handleMouseMove = (e: React.MouseEvent, type: string, dayIdx: number, hourIdx: number, d: any, id: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Position relative to the hovered item's coordinates
        setHoveredCell({
            type,
            dayIdx,
            hourIdx,
            d,
            id,
            x: rect.left + rect.width / 2,
            y: rect.top
        });
    };

    const handleMouseLeave = () => setHoveredCell(null);

    // Generate single uniform 7x24 matrix for all views
    // Generate single uniform 7x24 matrix for all views with enriched performance data
    const { matrix, dayTotals, hourTotals, globalMax, dayMax, hourMax } = useMemo(() => {
        const mat = Array(7).fill(0).map(() =>
            Array(24).fill(0).map(() => {
                const total = Math.floor(Math.random() * 50);
                let wins = 0, draws = 0, losses = 0;
                if (total > 0) {
                    wins = Math.floor(Math.random() * (total + 1));
                    losses = Math.floor(Math.random() * (total - wins + 1));
                    draws = total - wins - losses;
                }
                return { total, wins, draws, losses };
            })
        );
        let gMax = 0;
        const dTotals = Array(7).fill(0).map(() => ({ total: 0, wins: 0, draws: 0, losses: 0 }));
        const hTotals = Array(24).fill(0).map(() => ({ total: 0, wins: 0, draws: 0, losses: 0 }));

        for (let d = 0; d < 7; d++) {
            for (let h = 0; h < 24; h++) {
                const cell = mat[d][h];
                if (cell.total > gMax) gMax = cell.total;
                dTotals[d].total += cell.total;
                dTotals[d].wins += cell.wins;
                dTotals[d].draws += cell.draws;
                dTotals[d].losses += cell.losses;
                hTotals[h].total += cell.total;
                hTotals[h].wins += cell.wins;
                hTotals[h].draws += cell.draws;
                hTotals[h].losses += cell.losses;
            }
        }
        return {
            matrix: mat,
            dayTotals: dTotals,
            hourTotals: hTotals,
            globalMax: gMax || 1, // Prevent division by 0
            dayMax: Math.max(...dTotals.map(d => d.total)) || 1,
            hourMax: Math.max(...hTotals.map(h => h.total)) || 1
        };
    }, []);

    // Insight Calculation
    const handleHintClick = () => {
        if (!onHint) return;

        // Find best and worst hours (min 5 games to be statistically relevant)
        let bestHour = -1;
        let bestWR = -1;
        let worstHour = -1;
        let worstWR = 2; // Impossibly high starting point

        hourTotals.forEach((h, hIdx) => {
            if (h.total >= 5) {
                const wr = h.wins / h.total;
                if (wr > bestWR) {
                    bestWR = wr;
                    bestHour = hIdx;
                }
                if (wr < worstWR) {
                    worstWR = wr;
                    worstHour = hIdx;
                }
            }
        });

        onHint({
            bestHour: bestHour >= 0 ? bestHour : null,
            worstHour: worstHour >= 0 ? worstHour : null,
            bestWR: bestHour >= 0 ? Math.round(bestWR * 100) : null,
            worstWR: worstHour >= 0 ? Math.round(worstWR * 100) : null
        });
    };

    // Color logic: Brightness = Volume (Total), Hue = Performance (Win Rate)
    const getPerformanceColorClass = (total: number, wins: number, draws: number) => {
        if (total === 0) return 'bg-white/5 border-white/5';

        // Count a draw as 0.5 win for the score
        const score = (wins + draws * 0.5) / total;
        let hue = 'amber'; // average
        if (score >= 0.55) hue = 'emerald';
        else if (score <= 0.45) hue = 'rose';

        const ratio = total / globalMax;

        if (hue === 'emerald') {
            if (ratio < 0.2) return 'bg-emerald-500/20 border-emerald-500/20';
            if (ratio < 0.5) return 'bg-emerald-500/40 border-emerald-500/30';
            if (ratio < 0.8) return 'bg-emerald-500/70 border-emerald-400/50';
            return 'bg-emerald-400 border-emerald-300';
        }
        if (hue === 'rose') {
            if (ratio < 0.2) return 'bg-rose-500/20 border-rose-500/20';
            if (ratio < 0.5) return 'bg-rose-500/40 border-rose-500/30';
            if (ratio < 0.8) return 'bg-rose-500/70 border-rose-400/50';
            return 'bg-rose-400 border-rose-300';
        }
        // amber
        if (ratio < 0.2) return 'bg-amber-500/20 border-amber-500/20';
        if (ratio < 0.5) return 'bg-amber-500/40 border-amber-500/30';
        if (ratio < 0.8) return 'bg-amber-500/70 border-amber-400/50';
        return 'bg-amber-400 border-amber-300';
    };

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Formatting helper
    const getHourLabel = (h: number) => {
        if (h === 0) return '12 AM';
        if (h === 12) return '12 PM';
        return h < 12 ? `${h} AM` : `${h - 12} PM`;
    };

    return (
        <Card className="flex flex-col bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(52,211,153,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="p-6 pb-0 flex flex-col h-full relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Activity size={16} className="text-emerald-400" />
                        <div className={DASHBOARD_FONTS.widgetTitle}>Activity Matrix</div>
                    </div>
                    {onHint && (
                        <button
                            onClick={handleHintClick}
                            className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                        >
                            <Sparkles className="w-3 h-3" /> Insights
                        </button>
                    )}
                </div>

                <h3 className="text-slate-400 text-xs mb-6 font-medium tracking-wide">
                    Your game distribution by day of week and time of day
                </h3>

                {/* 3-Tab Navigator */}
                <div className="flex w-full mb-6 relative">
                    {/* Background track line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />

                    <div className="grid grid-cols-3 w-full lg:w-3/4 max-w-lg">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`pb-2 text-xs font-bold tracking-wide transition-all uppercase relative ${viewMode === 'day' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Day
                            {viewMode === 'day' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                        </button>
                        <button
                            onClick={() => setViewMode('dayHour')}
                            className={`pb-2 text-xs font-bold tracking-wide transition-all uppercase relative ${viewMode === 'dayHour' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Day & Hour
                            {viewMode === 'dayHour' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                        </button>
                        <button
                            onClick={() => setViewMode('hour')}
                            className={`pb-2 text-xs font-bold tracking-wide transition-all uppercase relative ${viewMode === 'hour' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Hour
                            {viewMode === 'hour' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                        </button>
                    </div>
                </div>

                {/* Body Engine */}
                <div className="flex-1 w-full flex flex-col min-h-[220px] pb-6 relative z-20">

                    {/* View: DAY (Horizontal Bars) */}
                    {viewMode === 'day' && (
                        <div className="flex-1 w-full flex">
                            {/* Y-axis */}
                            <div className="flex flex-col text-[10px] text-slate-500 font-bold tracking-wider pr-2 select-none shrink-0 border-r border-white/5 mr-2">
                                <div className="grid grid-rows-7 gap-1.5 flex-1 items-center">
                                    {daysOfWeek.map((day, i) => (
                                        <div key={i} className="flex justify-center w-4">{day}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="flex-1 grid grid-rows-7 gap-1.5 relative py-1" onMouseLeave={handleMouseLeave}>
                                {dayTotals.map((d, dIdx) => {
                                    const widthPercent = Math.max((d.total / dayMax) * 100, 1);
                                    const isHovered = hoveredCell?.id === `day-${dIdx}`;

                                    return (
                                        <div
                                            key={dIdx}
                                            className="w-full h-full relative cursor-pointer flex items-center pr-12 hover:z-50 group"
                                            onMouseEnter={(e) => handleMouseMove(e, 'day', dIdx, -1, d, `day-${dIdx}`)}
                                        >
                                            <div className="w-full flex items-center h-full">
                                                {/* Bar */}
                                                <div
                                                    className={`h-3 md:h-3.5 rounded-r-md transition-all duration-300 relative ${isHovered ? 'shadow-[0_0_12px_rgba(255,255,255,0.3)] ring-1 ring-white/30 scale-y-110 z-10' : ''} ${getPerformanceColorClass(d.total, d.wins, d.draws)}`}
                                                    style={{ width: `${widthPercent}%`, minWidth: d.total === 0 ? '4px' : 'auto' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* View: DAY & HOUR (Heatmap Grid) */}
                    {viewMode === 'dayHour' && (
                        <div className="flex-1 w-full flex flex-col">
                            <div className="flex-1 flex">
                                {/* Y-axis */}
                                <div className="flex flex-col text-[10px] text-slate-500 font-bold tracking-wider pr-2 select-none shrink-0 border-r border-white/5 mr-2">
                                    <div className="grid grid-rows-7 gap-[2px] sm:gap-[3px] flex-1 items-center">
                                        {daysOfWeek.map((day, i) => (
                                            <div key={i} className="flex justify-center w-4 h-full">{day}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* 7x24 Grid */}
                                <div className="flex-1 grid grid-rows-7 gap-[2px] sm:gap-[3px]" onMouseLeave={handleMouseLeave}>
                                    {matrix.map((row, dIdx) => (
                                        <div key={dIdx} className="grid grid-cols-24 gap-[2px] sm:gap-[3px] h-full w-full">
                                            {row.map((cell, hIdx) => {
                                                const isHovered = hoveredCell?.id === `cell-${dIdx}-${hIdx}`;
                                                return (
                                                    <div
                                                        key={hIdx}
                                                        className={`w-full h-full rounded-[1px] md:rounded-[2px] border transition-colors relative cursor-pointer hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:z-50 ${isHovered ? 'border-white/50 z-50 ring-1 ring-white' : ''} ${getPerformanceColorClass(cell.total, cell.wins, cell.draws)}`}
                                                        onMouseEnter={(e) => handleMouseMove(e, 'cell', dIdx, hIdx, cell, `cell-${dIdx}-${hIdx}`)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* X-axis for Heatmap */}
                            <div className="flex mt-1 pl-8">
                                <div className="flex-1 relative h-4 text-[9px] text-slate-500 font-bold tracking-wider">
                                    {/* Place marks at 0, 6, 12, 18, 24 */}
                                    {[0, 6, 12, 18].map(h => (
                                        <span key={h} className="absolute whitespace-nowrap -translate-x-1/2" style={{ left: `${(h / 24) * 100}%` }}>
                                            {getHourLabel(h)}
                                        </span>
                                    ))}
                                    <span className="absolute whitespace-nowrap -translate-x-full" style={{ left: '100%' }}>
                                        12 AM
                                    </span>
                                </div>
                            </div>

                            {/* Global Legend Line for Heatmap */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-3 border-t border-white/5">
                                <span className="uppercase tracking-widest font-bold">Brightness = Volume, Color = WR%</span>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" /> <span>&ge; 55%</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-500" /> <span>Avg</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-[2px] bg-rose-500" /> <span>&le; 45%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: HOUR (Vertical Bars) */}
                    {viewMode === 'hour' && (
                        <div className="flex-1 w-full pl-6 flex flex-col">
                            {/* SVG Chart Area */}
                            {/* Using strictly static wrappers and absolute bars calculating bottom origins */}
                            <div className="flex-1 relative border-b border-white/10 pb-1 mt-4" onMouseLeave={handleMouseLeave}>
                                <div className="absolute inset-0 flex items-end gap-1 sm:gap-1.5 pb-1 pointer-events-none">
                                    {hourTotals.map((h, hIdx) => {
                                        const heightPercent = Math.max((h.total / hourMax) * 100, 1);
                                        const isHovered = hoveredCell?.id === `hour-${hIdx}`;

                                        return (
                                            <div
                                                key={hIdx}
                                                className="flex-1 h-full relative cursor-pointer pointer-events-auto flex justify-center group"
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const visibleHeight = (heightPercent / 100) * rect.height;
                                                    setHoveredCell({
                                                        type: 'hour',
                                                        dayIdx: -1,
                                                        hourIdx: hIdx,
                                                        d: h,
                                                        id: `hour-${hIdx}`,
                                                        x: rect.left + rect.width / 2,
                                                        y: rect.bottom - visibleHeight
                                                    });
                                                }}
                                            >
                                                <div
                                                    className={`absolute bottom-0 w-3 md:w-4 rounded-t-md transition-all duration-300 ${isHovered ? 'shadow-[0_0_12px_rgba(255,255,255,0.3)] ring-1 ring-white/30 scale-x-110 z-10' : ''} ${getPerformanceColorClass(h.total, h.wins, h.draws)}`}
                                                    style={{ height: `${heightPercent}%`, minHeight: h.total === 0 ? '4px' : 'auto' }}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* X-Axis */}
                            <div className="flex mt-1">
                                <div className="flex-1 relative h-4 text-[9px] text-slate-500 font-bold tracking-wider">
                                    {[0, 6, 12, 18].map(h => (
                                        <span key={h} className="absolute whitespace-nowrap -translate-x-1/2" style={{ left: `${(h / 24) * 100}%` }}>
                                            {getHourLabel(h)}
                                        </span>
                                    ))}
                                    <span className="absolute whitespace-nowrap -translate-x-full" style={{ left: '100%' }}>
                                        12 AM
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Global React Portal Tooltip */}
                {hoveredCell && (
                    <div
                        className="fixed z-[99999] pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95 bg-[#0F1623]/95 backdrop-blur-md text-white text-[11px] px-3 py-2 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] whitespace-nowrap flex flex-col border border-emerald-500/30"
                        style={{
                            left: `${hoveredCell.type === 'day' ? hoveredCell.x + 12 : hoveredCell.x}px`,
                            top: `${hoveredCell.type === 'day' ? hoveredCell.y + 12 : hoveredCell.y - 8}px`, // Shift top up slightly for cell/hour to have margin
                            transform: hoveredCell.type === 'day' ? 'translateY(-50%)' : 'translate(-50%, -100%)',
                            alignItems: hoveredCell.type === 'day' ? 'flex-start' : 'center',
                        }}
                    >
                        {/* Title line */}
                        <span className="font-bold mb-0.5">
                            {hoveredCell.type === 'day' && fullDaysOfWeek[hoveredCell.dayIdx]}
                            {hoveredCell.type === 'cell' && fullDaysOfWeek[hoveredCell.dayIdx]}
                            {hoveredCell.type === 'hour' && `${getHourLabel(hoveredCell.hourIdx)} - ${getHourLabel(hoveredCell.hourIdx + 1)}`}
                        </span>

                        {/* Subtitle line */}
                        {hoveredCell.type === 'cell' && (
                            <span className="text-slate-600 mb-1">{getHourLabel(hoveredCell.hourIdx)} - {getHourLabel(hoveredCell.hourIdx + 1)}</span>
                        )}

                        {/* Value line */}
                        <div className="flex items-center gap-3">
                            <span className="text-white font-black">{hoveredCell.d.total} games</span>
                            {hoveredCell.d.total > 0 && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                    <span className="text-emerald-500">{hoveredCell.d.wins}W</span>
                                    <span className="text-slate-400">{hoveredCell.d.draws}D</span>
                                    <span className="text-rose-500">{hoveredCell.d.losses}L</span>
                                    <span className="ml-1 text-slate-300 bg-white/10 px-1.5 py-0.5 rounded-sm">
                                        WR: {Math.round((hoveredCell.d.wins / hoveredCell.d.total) * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Arrow Pointer */}
                        <div
                            className={`absolute border-[5px] border-transparent ${hoveredCell.type === 'day' ? 'top-1/2 right-full -translate-y-1/2 border-r-[#0F1623]' : 'top-full left-1/2 -translate-x-1/2 border-t-[#0F1623]'}`}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ActivityHeatmap;

