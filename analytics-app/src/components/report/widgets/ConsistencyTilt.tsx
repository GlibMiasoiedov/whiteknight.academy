import React from 'react';
import { Target, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import { DASHBOARD_FONTS } from '../../../constants/theme';

interface ConsistencyTiltProps {
    onHint?: () => void;
}

const ConsistencyTilt: React.FC<ConsistencyTiltProps> = ({ onHint }) => {
    // Mock Data
    const tiltData = {
        normalWinRate: 52,
        winRateAfterLoss: 38,
    };

    const sessionData = [
        { label: 'Short (1-3 games)', wr: 56, icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Medium (4-8 games)', wr: 49, icon: TrendingDown, color: 'text-amber-400' },
        { label: 'Long (9+ games)', wr: 35, icon: TrendingDown, color: 'text-rose-400' },
    ];

    const isTilting = tiltData.normalWinRate - tiltData.winRateAfterLoss >= 10;

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Target size={16} className="text-rose-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Consistency & Tilt</div>
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

                {/* Tilt Metric */}
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Performance After Losses</div>
                        <Badge type={isTilting ? "high" : "low"} label={isTilting ? "High Tilt" : "Stable"} />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-black/30 border border-white/5 rounded-lg px-4 py-3 flex-1 flex flex-col justify-center items-center">
                            <div className="text-xs font-medium text-slate-500 mb-0.5">Base Win Rate</div>
                            <div className="text-xl font-bold text-white">{tiltData.normalWinRate}%</div>
                        </div>
                        <div className="text-slate-600 font-bold shrink-0">→</div>
                        <div className={`bg-black/30 border border-white/5 rounded-lg px-4 py-3 flex-1 flex flex-col justify-center items-center ${isTilting ? 'ring-1 ring-rose-500/30' : ''}`}>
                            <div className="text-[10px] font-medium text-slate-500 mb-0.5 whitespace-nowrap hidden sm:block">Win Rate After Loss</div>
                            <div className="text-[10px] font-medium text-slate-500 mb-0.5 whitespace-nowrap block sm:hidden">After Loss</div>
                            <div className={`text-xl font-bold ${isTilting ? 'text-rose-400' : 'text-emerald-400'}`}>{tiltData.winRateAfterLoss}%</div>
                        </div>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                {/* Session Length Impact */}
                <div className="flex-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Win Rate vs Session Length</div>

                    <div className="space-y-3">
                        {sessionData.map((session, i) => {
                            const Icon = session.icon;
                            return (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                    <div className="text-xs font-medium text-slate-300">{session.label}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-bold text-white">{session.wr}%</div>
                                        <Icon size={14} className={session.color} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default ConsistencyTilt;
