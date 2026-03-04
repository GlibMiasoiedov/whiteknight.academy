import React from 'react';
import { Lightbulb, Droplets, Coffee, Sparkles } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { DASHBOARD_FONTS, THEMES } from '../../../constants/theme';

const BiometricsRecommendations: React.FC = () => {
    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none rounded-xl overflow-hidden" />

            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2 relative z-10 shrink-0">
                <Lightbulb size={16} className="text-emerald-400" />
                <div className={DASHBOARD_FONTS.widgetTitle}>Recommendations</div>
            </div>

            <div className="p-5 flex-1 flex flex-col relative z-10 space-y-6">

                {/* Physical Setup Tips */}
                <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Preparation & Environment</div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                                <Droplets size={14} className="text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white mb-0.5">Hydration Warning</div>
                                <div className="text-xs text-slate-400 leading-relaxed">Fatigue spikes typically after 45 mins. Keep water at your desk to maintain clarity.</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                                <Coffee size={14} className="text-amber-400" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white mb-0.5">Limit Session Length</div>
                                <div className="text-xs text-slate-400 leading-relaxed">Your stress resilience drops after 3 consecutive losses. Step away for 10 minutes.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                {/* Coaching CTA */}
                <div className="flex-1 flex flex-col justify-end">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Action Plan</div>
                    <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex gap-3">
                            <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                                <Sparkles size={12} className="text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Performance Under Pressure</h4>
                                <p className="text-xs text-slate-400">Join a specialized group session to learn stress management techniques during time scrambles.</p>
                            </div>
                        </div>
                        <Button
                            themeColor={THEMES.coaching.color}
                            size="sm"
                            fullWidth
                            className="font-bold hover-glow-emerald hover:-translate-y-0.5 shadow-sm"
                        >
                            Find a Coach
                        </Button>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default BiometricsRecommendations;
