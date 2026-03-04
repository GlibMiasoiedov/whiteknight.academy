import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Button from '../../../ui/Button';
import Badge from '../../../ui/Badge';

const TacticsRecommendations: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-[#0F1623] to-[#0B1220] border border-white/5 rounded-xl p-6 mt-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Badge type="warning" label="Primary Leak" className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-2 py-0.5" />
                    <h3 className="text-white font-bold text-lg">Missed Tactics Under Pressure</h3>
                </div>
                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                    You are missing <strong className="text-amber-400">2-move pins and forks</strong> when your clock drops below 2 minutes.
                    This accounts for <span className="text-white font-bold">40%</span> of your blunders in the middlegame.
                    Focus on tactical vision when time is low.
                </p>
            </div>
            <div className="relative z-10 flex-shrink-0 w-full md:w-auto flex flex-col gap-3">
                <Button variant="primary" themeColor="#10B981" icon={ArrowUpRight} className="w-full">
                    Join Tactics Group
                </Button>
                <div className="text-center text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                    Or book 1:1 Coach
                </div>
            </div>
        </div>
    );
};

export default TacticsRecommendations;
