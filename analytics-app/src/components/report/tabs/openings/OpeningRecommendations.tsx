import React from 'react';
import Card from '../../../ui/Card';
import { Lightbulb, ArrowRight, UserPlus, Users } from 'lucide-react';
import Badge from '../../../ui/Badge';

const OpeningRecommendations: React.FC = () => {
    return (
        <Card className="flex flex-col h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <Lightbulb size={20} className="text-amber-400" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Recommendations</h3>
                </div>
                <Badge type="pro" label="AI Insight" />
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-6 relative z-10">
                <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    The Simple Fix
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                    Your games out of the <span className="text-white font-semibold">Sicilian Defense</span> suffer when opponents play aggressively. Focus on solidifying your central pawn structure before committing your knights to the edge of the board.
                </p>
            </div>

            <div className="space-y-4 mt-auto relative z-10">
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 flex items-center justify-between bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 font-bold rounded-xl px-4 py-3 transition-all duration-300 group/btn shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <div className="flex items-center gap-3 text-sm">
                            <Users size={16} />
                            <span>Join Opening Group</span>
                        </div>
                        <ArrowRight size={16} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                    </button>

                    <button className="flex-1 flex items-center justify-between bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 rounded-xl px-4 py-3 transition-all duration-300 group/btn">
                        <div className="flex items-center gap-3 text-sm">
                            <UserPlus size={16} />
                            <span>Book Coach</span>
                        </div>
                        <ArrowRight size={16} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default OpeningRecommendations;
