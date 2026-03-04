import React from 'react';
import { Flag, Sparkles, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Card from '../../ui/Card';
import ProgressBar from '../../ui/ProgressBar';
import { DASHBOARD_FONTS } from '../../../constants/theme';

interface TerminationBreakdownProps {
    onHint?: () => void;
}

const TerminationBreakdown: React.FC<TerminationBreakdownProps> = ({ onHint }) => {
    // Mock Data
    const totalWins = 120;
    const wins = {
        checkmate: 55,
        resign: 45,
        timeout: 20
    };

    const totalLosses = 85;
    const losses = {
        checkmate: 30,
        resign: 40,
        timeout: 15
    };

    const renderBar = (label: string, value: number, total: number, color: string, Icon: any, isLoss = false) => {
        const percentage = Math.round((value / total) * 100) || 0;
        return (
            <div className="flex items-center gap-3">
                <div className="w-24 shrink-0 flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Icon size={14} className={isLoss ? 'text-red-400' : 'text-emerald-400'} />
                    {label}
                </div>
                <div className="flex-1">
                    <ProgressBar current={value} max={total} color={color} />
                </div>
                <div className="w-12 text-right text-xs font-bold text-white shrink-0">{percentage}%</div>
            </div>
        );
    };

    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Flag size={16} className="text-emerald-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Termination Breakdown</div>
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

                {/* Wins Section */}
                <div>
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Wins <span className="text-slate-500 font-medium">({totalWins} games)</span>
                    </div>
                    <div className="space-y-3">
                        {renderBar('Checkmate', wins.checkmate, totalWins, '#10b981', CheckCircle2)}
                        {renderBar('Resignation', wins.resign, totalWins, '#34d399', Flag)}
                        {renderBar('Timeout', wins.timeout, totalWins, '#6ee7b7', Clock)}
                    </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                {/* Losses Section */}
                <div>
                    <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Losses <span className="text-slate-500 font-medium">({totalLosses} games)</span>
                    </div>
                    <div className="space-y-3">
                        {renderBar('Checkmate', losses.checkmate, totalLosses, '#f43f5e', XCircle, true)}
                        {renderBar('Resignation', losses.resign, totalLosses, '#fb7185', Flag, true)}
                        {renderBar('Timeout', losses.timeout, totalLosses, '#fda4af', Clock, true)}
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default TerminationBreakdown;
