import React from 'react';
import { TrendingUp, Sparkles, Clock } from 'lucide-react';
import Card from '../../../ui/Card';
import { DASHBOARD_FONTS } from '../../../../constants/theme';
import Badge from '../../../ui/Badge';

interface AdvantageCapitalizationProps {
    onHint?: () => void;
}

const AdvantageCapitalization: React.FC<AdvantageCapitalizationProps> = ({ onHint }) => {
    const conversions = [
        { advantage: '+1.0', rate: '65%', desc: 'Slight Edge', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', barColor: 'bg-emerald-500', width: '65%' },
        { advantage: '+3.0', rate: '82%', desc: 'Clear Advantage', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400', barColor: 'bg-blue-500', width: '82%' },
        { advantage: '+5.0', rate: '94%', desc: 'Winning Position', color: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-400', barColor: 'bg-violet-500', width: '94%' },
    ];

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Advantage Capitalization</div>
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

            <div className="p-6 relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {conversions.map((conv) => (
                        <div key={conv.advantage} className={`rounded-xl border border-white/5 bg-gradient-to-br ${conv.color} p-4 flex flex-col justify-between`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className={`font-bold text-xl ${conv.iconColor}`}>{conv.advantage}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{conv.desc}</div>
                                </div>
                                <div className="text-white font-bold text-xl">{conv.rate}</div>
                            </div>

                            <div className="space-y-1.5 mt-auto">
                                <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                                    <span>Conversion Rate</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${conv.barColor}`} style={{ width: conv.width }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                            <Clock size={18} />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">Time Usage when Winning (+3.0)</div>
                            <div className="text-slate-400 text-xs mt-0.5">You spend 40% less time per move when clearly ahead.</div>
                        </div>
                    </div>
                    <Badge type="warning" label="Rushing" className="bg-amber-500/10 text-amber-400 border-amber-500/20 hidden sm:flex px-2 py-1" />
                </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </Card>
    );
};

export default AdvantageCapitalization;
