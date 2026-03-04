import React from 'react';
import { UserCircle2, Sparkles, Zap, Shield, Timer, Coffee } from 'lucide-react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';

interface PlayerArchetypesProps {
    onHint?: () => void;
}

const PlayerArchetypes: React.FC<PlayerArchetypesProps> = ({ onHint }) => {
    // Mock Data - performance vs different styles
    const archetypes = [
        {
            title: 'Aggressive',
            desc: 'High tactical complication rate',
            icon: Zap,
            color: 'text-rose-400',
            bgGlow: 'hover-glow-red-strong',
            bgLight: 'bg-rose-500/10',
            borderHover: 'hover:border-rose-500/30',
            winRate: 42,
            games: 45
        },
        {
            title: 'Positional',
            desc: 'Solid structures, slow maneuvering',
            icon: Shield,
            color: 'text-amber-400',
            bgGlow: 'hover-glow-amber-strong',
            bgLight: 'bg-amber-500/10',
            borderHover: 'hover:border-amber-500/30',
            winRate: 64,
            games: 82
        },
        {
            title: 'Blitzers',
            desc: 'Play fast, keep high clock pressure',
            icon: Timer,
            color: 'text-violet-400',
            bgGlow: 'hover-glow-violet-strong',
            bgLight: 'bg-violet-500/10',
            borderHover: 'hover:border-violet-500/30',
            winRate: 35,
            games: 30
        },
        {
            title: 'Thinkers',
            desc: 'Use over 80% of allotted time',
            icon: Coffee,
            color: 'text-emerald-400',
            bgGlow: 'hover-glow-emerald-strong',
            bgLight: 'bg-emerald-500/10',
            borderHover: 'hover:border-emerald-500/30',
            winRate: 58,
            games: 48
        }
    ];

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <UserCircle2 size={16} className="text-blue-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Performance vs Styles</div>
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

            <div className="p-5 flex-1 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {archetypes.map((type, i) => {
                        const Icon = type.icon;
                        const isGood = type.winRate >= 50;
                        const wrColor = isGood ? 'text-emerald-400' : 'text-red-400';

                        return (
                            <div key={i} className={`bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 ${type.borderHover} ${type.bgGlow} group/item`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg ${type.bgLight}`}>
                                        <Icon size={16} className={type.color} />
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${wrColor}`}>{type.winRate}%</div>
                                        <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Win Rate</div>
                                    </div>
                                </div>

                                <div className="font-bold text-sm text-slate-200 group-hover/item:text-white transition-colors mb-1">{type.title}</div>
                                <div className="text-[10px] text-slate-400 leading-tight mb-3 h-6">{type.desc}</div>

                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-white/5 pt-2">
                                    Sample: <span className="text-slate-300">{type.games} games</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

export default PlayerArchetypes;
