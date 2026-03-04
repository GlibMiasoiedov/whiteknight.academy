import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import Card from '../../ui/Card';
import ProgressBar from '../../ui/ProgressBar';
import Badge from '../../ui/Badge';
import { DASHBOARD_FONTS } from '../../../constants/theme';

interface TimeManagementProps {
    onHint?: () => void;
}

const TimeManagement: React.FC<TimeManagementProps> = ({ onHint }) => {
    // Mock Data for time usage
    const timeStats = {
        opening: 45, // seconds per move
        middlegame: 120, // seconds per move
        endgame: 15, // seconds per move
    };

    const timeTroubleFreq = 42; // % of games ending in time trouble
    const timeTroubleBlunders = 3.2; // blunders per game when in TT
    const normalBlunders = 0.8; // blunders per game normally

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(52,211,153,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Time Management</div>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5 shrink-0"
                    >
                        <Sparkles className="w-3 h-3" /> Insights
                    </button>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col relative z-10 space-y-6">

                {/* Time Usage Per Phase */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Time Per Move</div>
                        <Badge type="neutral" label="By Phase" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-24 shrink-0 text-sm font-medium text-slate-300">Opening</div>
                            <div className="flex-1">
                                <ProgressBar current={timeStats.opening} max={120} color="#10b981" />
                            </div>
                            <div className="w-12 text-right text-xs font-bold text-white shrink-0">{timeStats.opening}s</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 shrink-0 text-sm font-medium text-slate-300">Middlegame</div>
                            <div className="flex-1">
                                <ProgressBar current={timeStats.middlegame} max={120} color="#f59e0b" />
                            </div>
                            <div className="w-12 text-right text-xs font-bold text-white shrink-0">{timeStats.middlegame}s</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 shrink-0 text-sm font-medium text-slate-300">Endgame</div>
                            <div className="flex-1">
                                <ProgressBar current={timeStats.endgame} max={120} color="#f43f5e" />
                            </div>
                            <div className="w-12 text-right text-xs font-bold text-white shrink-0">{timeStats.endgame}s</div>
                        </div>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                {/* Time Trouble Impact */}
                <div className="flex-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Time Pressure Impact</div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col justify-center items-center">
                            <div className="text-xs text-slate-400 font-medium mb-1 text-center">Time Scrambles</div>
                            <div className="text-2xl font-black text-rose-400">{timeTroubleFreq}%</div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-1 text-center font-bold">Of Games</div>
                        </div>

                        <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col justify-center items-center">
                            <div className="text-xs text-slate-400 font-medium mb-1 text-center">Blunder Rate</div>
                            <div className="text-2xl font-black text-white flex items-baseline gap-1">
                                {timeTroubleBlunders}
                                <span className="text-[10px] text-slate-500 uppercase">vs {normalBlunders}</span>
                            </div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-1 text-center font-bold">Per Game</div>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default TimeManagement;
