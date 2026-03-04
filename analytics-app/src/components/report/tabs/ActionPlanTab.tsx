import React from 'react';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { Target, Calendar, Users, GraduationCap } from 'lucide-react';

const ActionPlanTab: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-2">
                <h2 className={DASHBOARD_FONTS.h2}>Your Action Plan</h2>
                <div className={DASHBOARD_FONTS.body + " max-w-3xl"}>
                    Targeted recommendations based on your performance over the last 30 days.
                </div>
            </div>

            {/* Priority Ladder */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target size={18} className="text-emerald-400" /> Top Priorities
                </h3>

                {/* Priority 1 */}
                <Card padding="p-0" className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-xl font-bold text-white">1. Master Rook Endgames</h4>
                                    <Badge type="error" label="Critical Impact" className="bg-red-500/10 text-red-400 border-red-500/20" />
                                </div>
                                <p className="text-slate-300 text-sm max-w-2xl">
                                    You are consistently reaching the endgame with an advantage but failing to convert in rook and pawn endings.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Evidence</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-red-400">32%</span>
                                    <span className="text-sm text-slate-300">of games drawn/lost from winning rook endgames</span>
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Target Milestone</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-bold">Philidor & Lucena</span>
                                    <span className="text-sm text-slate-300">Master fundamental defensive setups</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button themeColor="#10B981" icon={Users}>Join Rook Endgames Group</Button>
                            <Button variant="secondary" icon={GraduationCap}>Book Endgame Coach</Button>
                        </div>
                    </div>
                </Card>

                {/* Priority 2 */}
                <Card padding="p-0" className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-xl font-bold text-white">2. Time Management in Openings</h4>
                                    <Badge type="warning" label="High Impact" className="bg-amber-500/10 text-amber-400 border-amber-500/20" />
                                </div>
                                <p className="text-slate-300 text-sm max-w-2xl">
                                    You are spending too much time calculating theory in the first 10 moves, leading to time trouble later on.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Evidence</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-amber-400">45s</span>
                                    <span className="text-sm text-slate-300">avg. time spent per move before move 10</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button themeColor="#8B5CF6" icon={Users}>Join Opening Repertoire Group</Button>
                        </div>
                    </div>
                </Card>

                {/* Priority 3 */}
                <Card padding="p-0" className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-xl font-bold text-white">3. Reduce 2-Move Blunders</h4>
                                    <Badge type="info" label="Medium Impact" className="bg-blue-500/10 text-blue-400 border-blue-500/20" />
                                </div>
                                <p className="text-slate-300 text-sm max-w-2xl">
                                    Overlooking simple pins and forks in complex middlegame positions.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Evidence</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-blue-400">1.2</span>
                                    <span className="text-sm text-slate-300">avg. blunders per game</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button themeColor="#3B82F6" icon={GraduationCap}>Book Tactical Coach</Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Suggested Schedule */}
            <div className="mt-8 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-emerald-400" /> Suggested Training Schedule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Week 1-2 */}
                    <Card padding="p-0" className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20 relative group hover:border-emerald-500/40 hover:-translate-y-1">
                        <div className="p-5 border-b border-emerald-500/10">
                            <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                Phase 1: Weeks 1-2
                            </h4>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black/40 border border-emerald-500/20 flex flex-shrink-0 items-center justify-center text-emerald-400 font-bold">1</div>
                                <div>
                                    <div className="font-bold text-white text-sm">Rook Endgames Clinic</div>
                                    <div className="text-xs text-slate-400 mt-0.5">Focus on theoretical drawn/won positions. Join the group sessions on Tuesdays.</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black/40 border border-emerald-500/20 flex flex-shrink-0 items-center justify-center text-emerald-400 font-bold">2</div>
                                <div>
                                    <div className="font-bold text-white text-sm">Opening Speed Drills</div>
                                    <div className="text-xs text-slate-400 mt-0.5">Practice first 10 moves against computer to improve time management.</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Week 3-4 */}
                    <Card padding="p-0" className="bg-gradient-to-br from-violet-500/5 to-transparent border-violet-500/20 relative group hover:border-violet-500/40 hover:-translate-y-1">
                        <div className="p-5 border-b border-violet-500/10">
                            <h4 className="font-bold text-violet-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
                                Phase 2: Weeks 3-4
                            </h4>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black/40 border border-violet-500/20 flex flex-shrink-0 items-center justify-center text-violet-400 font-bold">3</div>
                                <div>
                                    <div className="font-bold text-white text-sm">Tactical Vision 1:1 Coaching</div>
                                    <div className="text-xs text-slate-400 mt-0.5">Review blunder patterns with a coach to build a checking process.</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black/40 border border-violet-500/20 flex flex-shrink-0 items-center justify-center text-violet-400 font-bold">4</div>
                                <div>
                                    <div className="font-bold text-white text-sm">Integration Play</div>
                                    <div className="text-xs text-slate-400 mt-0.5">Play 10 rapid games focusing purely on applying the new habits.</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ActionPlanTab;
