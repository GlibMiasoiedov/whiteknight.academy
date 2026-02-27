import React from 'react';
import Card from '../../../ui/Card';
import { Target, TrendingUp, TrendingDown, Swords } from 'lucide-react';
import Badge from '../../../ui/Badge';

const OpeningHealthSummary: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* White Stats Card */}
            <Card className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-white rounded-sm border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
                        <h3 className="text-xl font-bold text-white tracking-tight">Playing as White</h3>
                    </div>
                    <Badge type="success" label="Solid" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                            <Target size={12} className="text-emerald-400" />
                            Avg Eval (Move 15)
                        </div>
                        <div className="text-2xl font-bold text-white">
                            +0.6 <span className="text-sm font-normal text-slate-500">cp</span>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                            <Swords size={12} className="text-violet-400" />
                            Win Rate
                        </div>
                        <div className="text-2xl font-bold text-white">
                            54.2%
                        </div>
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                            <TrendingUp size={14} className="text-emerald-400" />
                            <span>Best Performing:</span>
                        </div>
                        <span className="font-semibold text-emerald-400">Italian Game (68%)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                            <TrendingDown size={14} className="text-red-400" />
                            <span>Needs Work:</span>
                        </div>
                        <span className="font-semibold text-red-400">Ruy Lopez (41%)</span>
                    </div>
                </div>
            </Card>

            {/* Black Stats Card */}
            <Card className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.5),transparent_50%)] pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-slate-900 rounded-sm border border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                        <h3 className="text-xl font-bold text-white tracking-tight">Playing as Black</h3>
                    </div>
                    <Badge type="medium" label="Needs Focus" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                            <Target size={12} className="text-amber-400" />
                            Avg Eval (Move 15)
                        </div>
                        <div className="text-2xl font-bold text-white">
                            -0.8 <span className="text-sm font-normal text-slate-500">cp</span>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                            <Swords size={12} className="text-violet-400" />
                            Win Rate
                        </div>
                        <div className="text-2xl font-bold text-white">
                            46.5%
                        </div>
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                            <TrendingUp size={14} className="text-emerald-400" />
                            <span>Best Performing:</span>
                        </div>
                        <span className="font-semibold text-emerald-400">Caro-Kann (55%)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                            <TrendingDown size={14} className="text-red-400" />
                            <span>Needs Work:</span>
                        </div>
                        <span className="font-semibold text-red-400">Sicilian Def. (38%)</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OpeningHealthSummary;
