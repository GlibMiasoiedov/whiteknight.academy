import { FONTS } from '../../constants/theme';
import { CheckCircle2, Trophy } from 'lucide-react';

const BeginnersSection = ({ onRegister }: { onRegister: () => void }) => {
    // Generate 16 bars with non-uniform growth (mimicking the screenshot)
    // Small, medium, large variations but generally trending up


    return (
        <section id="beginners" className="py-16 md:py-16 relative z-10">
            <div className="w-full px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-24">
                    {/* LEFT: Text Content */}
                    <div className="flex-1 text-center md:text-left order-2 md:order-1">
                        <h2 className={`${FONTS.h1} text-white mb-6 md:mb-8`}>
                            Also Great for <span className="text-violet-400">Beginners</span>
                        </h2>

                        <div className="space-y-6 mb-10 md:mb-12">
                            <div className="flex items-start gap-4 text-left">
                                <CheckCircle2 className="w-6 h-6 text-violet-400 shrink-0 mt-1" />
                                <p className={`text-lg text-slate-300 ${FONTS.body}`}>
                                    Don’t know how the pieces move? We match you with beginner-friendly coaches.
                                </p>
                            </div>
                            <div className="flex items-start gap-4 text-left">
                                <CheckCircle2 className="w-6 h-6 text-violet-400 shrink-0 mt-1" />
                                <p className={`text-lg text-slate-300 ${FONTS.body}`}>
                                    Your learning path is built around you — pace, language, schedule.
                                </p>
                            </div>
                            <div className="flex items-start gap-4 text-left">
                                <CheckCircle2 className="w-6 h-6 text-violet-400 shrink-0 mt-1" />
                                <p className={`text-lg text-slate-300 ${FONTS.body}`}>
                                    Start from the basics, progress with real feedback, and track milestones.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onRegister}
                            className="w-full md:w-auto px-8 md:px-10 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg md:text-xl transition-all shadow-lg hover:shadow-violet-500/25"
                        >
                            Get Matched With a Beginner Coach
                        </button>
                    </div>

                    {/* RIGHT: Visual / Chart */}
                    <div className="flex-1 w-full order-1 md:order-2">
                        {/* Container with transparent background "remove background around logo" */}
                        <div className="p-2 md:p-6 relative">

                            {/* Card Header Content */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                                        <Trophy className="w-6 h-6 text-violet-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-lg">Beginner to Intermediate</div>
                                        <div className="text-violet-400 text-sm">16-Week Guided Plan</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    Verified Growth
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="relative h-[250px] md:h-[300px] w-full flex items-end gap-1 md:gap-2 px-2 ml-6">
                                {/* Grid Lines & Labels */}
                                <div className="absolute inset-x-2 inset-y-0 flex flex-col justify-between pointer-events-none z-0">
                                    {/* 1200 Line */}
                                    <div className="w-full border-t border-dashed border-white/10 relative">
                                        <span className="absolute -left-8 -top-2 text-[10px] text-slate-500 font-mono">1200</span>
                                    </div>
                                    {/* 800 Line (Approx 66%) */}
                                    <div className="w-full border-t border-dashed border-white/5 relative">
                                        <span className="absolute -left-8 -top-2 text-[10px] text-slate-500 font-mono">800</span>
                                    </div>
                                    {/* 400 Line (Approx 33%) */}
                                    <div className="w-full border-t border-dashed border-white/5 relative">
                                        <span className="absolute -left-8 -top-2 text-[10px] text-slate-500 font-mono">400</span>
                                    </div>
                                    {/* Start Line */}
                                    <div className="w-full border-t border-dashed border-white/10 relative">
                                        <span className="absolute -left-8 -top-2 text-[10px] text-slate-500 font-mono">Start</span>
                                    </div>
                                </div>

                                {/* BARS */}
                                {/* Data: 1 drop, 2 plateaus, mostly up */}
                                {[
                                    15, 25, 25, 40, // W1-4: Growth, Plateau (25)
                                    35, 50, 60, 60, // W5-8: Drop (35), Growth, Plateau (60)
                                    70, 80, 85, 90, // W9-12: Growth
                                    92, 95, 98, 100 // W13-16: Smooth finish
                                ].map((height, index) => (
                                    <div key={index} className="flex-1 h-full flex flex-col justify-end group/bar relative z-10">
                                        {/* Bar */}
                                        <div
                                            className="w-full bg-gradient-to-t from-violet-700 to-violet-400 rounded-t-sm md:rounded-t-md hover:to-violet-300 hover:shadow-[0_0_15px_rgba(167,139,250,0.6)] transition-all duration-300 origin-bottom shadow-[0_0_8px_rgba(139,92,246,0.2)]"
                                            style={{ height: `${height}%` }}
                                        ></div>

                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-violet-600/90 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                                            {index === 0 ? 'Start' : index === 15 ? '1200' : `W${index + 1}`}
                                        </div>
                                    </div>
                                ))}

                                {/* Trend Line / Overlay Text */}
                                <div className="absolute top-8 right-0 bg-violet-600/90 text-white text-xs px-2 py-1 rounded shadow-lg transform translate-x-2 -translate-y-2 z-20">
                                    Target: 1200+
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                                <div className="text-center">
                                    <div className="text-violet-400 font-bold text-xl md:text-2xl mb-1">+1200</div>
                                    <div className="text-slate-500 text-xs uppercase tracking-wider">Rating Points</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-white font-bold text-xl md:text-2xl mb-1">16</div>
                                    <div className="text-slate-500 text-xs uppercase tracking-wider">Weeks</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-white font-bold text-xl md:text-2xl mb-1">24/7</div>
                                    <div className="text-slate-500 text-xs uppercase tracking-wider">AI Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BeginnersSection;
