import React from 'react';
import { Clock, AlertTriangle, Crosshair, Sparkles } from 'lucide-react';
import Card from '../../../ui/Card';
import { DASHBOARD_FONTS } from '../../../../constants/theme';
import Badge from '../../../ui/Badge';

interface PracticalEndgameIssuesProps {
    onHint?: () => void;
}

const PracticalEndgameIssues: React.FC<PracticalEndgameIssuesProps> = ({ onHint }) => {
    const issues = [
        { label: 'Time Trouble', metric: '68%', desc: 'Endgames played with < 1 min on the clock', badge: 'Critical', badgeType: 'high', icon: Clock, color: 'text-red-400', bg: 'bg-red-500/10' },
        { label: 'Low Material Blunders', metric: '1.4', desc: 'Average blunders in +30 move endgames', badge: 'Warning', badgeType: 'medium', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Late Game Accuracy', metric: '62%', desc: 'CAPS score in the defining last 10 moves', badge: 'Room to Improve', badgeType: 'medium', icon: Crosshair, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Practical Issues</div>
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

            {/* Content */}
            <div className="p-6 relative z-10">
                <div className="space-y-4">
                    {issues.map((issue, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border border-white/5 bg-black/20 flex flex-col gap-3 group/item transition-all duration-300 hover:bg-black/40`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <issue.icon size={16} className={issue.color} />
                                    <span className="font-bold text-sm text-white">{issue.label}</span>
                                </div>
                                <Badge type={issue.badgeType as any} label={issue.badge} />
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="text-xs text-slate-400 max-w-[70%] font-manrope">{issue.desc}</div>
                                <div className={`text-xl font-bold font-unbounded ${issue.color}`}>{issue.metric}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </Card>
    );
};

export default PracticalEndgameIssues;
