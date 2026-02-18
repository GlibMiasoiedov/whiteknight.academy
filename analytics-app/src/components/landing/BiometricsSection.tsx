
import { FONTS } from '../../constants/theme';
import { Activity, Heart, Zap, Brain, Watch, ChevronRight, Lock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const BiometricsSection = ({ onRegister }: { onRegister?: () => void }) => {

    return (
        <section id="biometrics" className="py-20 md:py-32 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6 backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className={`text-xs font-bold text-rose-400 uppercase tracking-wider ${FONTS.label}`}>IN DEVELOPMENT · BIOMETRICS</span>
                    </div>

                    <h2 className={`${FONTS.h2} text-white mb-6 md:text-5xl lg:text-5xl xl:text-6xl`}>
                        Measure How Stress <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Affects Your Chess</span>
                    </h2>

                    <p className={`${FONTS.body} text-slate-400 text-lg md:text-xl max-w-2xl mx-auto`}>
                        Connect wearable data (like Apple Watch) to understand how stress, sleep, and energy correlate with blunders, time trouble, accuracy, and win rate — so your improvement plan becomes truly personal.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 xl:gap-20 items-center">

                    {/* LEFT: Cards */}
                    <div className="space-y-6">
                        {/* Card 1 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Play-Performance Correlation</h3>
                                    <p className="text-slate-400 leading-relaxed">See how sleep quality, resting HR, and HRV relate to your accuracy and decision-making.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">Stress & Tilt Detection</h3>
                                    <p className="text-slate-400 leading-relaxed">Spot patterns: when stress spikes, which mistakes appear more often (blunders, missed wins, time trouble).</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <Brain size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Training at the Right Time</h3>
                                    <p className="text-slate-400 leading-relaxed">Find your "peak hours" for calculation and focus, and schedule tactics/openings accordingly.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Visualization */}
                    <div className="relative hidden md:block">
                        <GlassCard className="p-8 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400"><Heart size={20} /></div>
                                    <span className="text-slate-300 font-bold text-sm">Heart Rate vs. Accuracy</span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 font-medium">Last 5 Games</div>
                            </div>

                            {/* Mock Chart */}
                            <div className="mt-8 relative h-[200px] w-full">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    <div className="w-full h-px bg-white/5"></div>
                                    <div className="w-full h-px bg-white/5"></div>
                                    <div className="w-full h-px bg-white/5"></div>
                                    <div className="w-full h-px bg-white/5"></div>
                                </div>

                                {/* Graph Lines (SVG) */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                    {/* Accuracy (Green) */}
                                    <path
                                        d="M0,50 C40,40 80,45 120,60 C160,80 200,140 240,160 C280,170 320,100 360,80 C400,60 440,50 480,40"
                                        fill="none"
                                        stroke="#10B981"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] opacity-80"
                                    />
                                    {/* Heart Rate (Red - Inverse correlation simulation) */}
                                    <path
                                        d="M0,150 C40,160 80,155 120,140 C160,120 200,40 240,20 C280,10 320,100 360,120 C400,140 440,150 480,160"
                                        fill="none"
                                        stroke="#F43F5E"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                                    />

                                    {/* Annotations */}
                                    <circle cx="240" cy="20" r="6" fill="#F43F5E" className="animate-pulse" />
                                    <circle cx="240" cy="160" r="4" fill="#10B981" />
                                </svg>

                                {/* Labels */}
                                <div className="absolute top-0 left-[45%] -translate-x-1/2 -translate-y-6">
                                    <div className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap">
                                        Stress Spike (125 BPM)
                                    </div>
                                </div>
                                <div className="absolute bottom-[10%] left-[45%] -translate-x-1/2 translate-y-8">
                                    <div className="px-3 py-1.5 bg-slate-800 border border-red-500/30 text-red-300 text-xs font-bold rounded-lg shadow-lg whitespace-nowrap">
                                        Blunder detected
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between text-xs text-slate-500 font-medium">
                                <span>Game Start</span>
                                <span>Critical Moment</span>
                                <span>Endgame</span>
                            </div>
                        </GlassCard>

                        {/* Planned Support List */}
                        <div className="mt-8 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/5">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Watch size={18} className="text-slate-400" /> Planned Integration
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {['Sleep', 'HRV', 'Resting HR', 'Stress Score', 'Apple Watch', 'Google Fit'].map(item => (
                                    <span key={item} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Trust / CTA */}
                <div className="mt-16 md:mt-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-8 opacity-80">
                        <Lock size={14} />
                        <span>Coming soon: We’ll never access medical records — only the metrics you choose to share.</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={onRegister} className="px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-lg shadow-lg shadow-rose-600/20 transition-all hover:-translate-y-1 w-full sm:w-auto btn-premium">
                            Join Biometrics Early Access
                        </button>
                        <button onClick={onRegister} className="px-8 py-4 rounded-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold text-lg transition-all w-full sm:w-auto flex items-center justify-center gap-2 btn-premium">
                            Get Your Free Starter Report <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BiometricsSection;
