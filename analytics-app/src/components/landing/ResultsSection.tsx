
import { FONTS } from '../../constants/theme';
import { Star } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const ResultsSection = () => {
    return (
        <section id="results" className="py-16 md:py-32 relative z-10">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 text-center">
                <h2 className={`${FONTS.h1} text-center text-white mb-6 md:mb-16`}>Real Results</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { name: "David M.", rating: "800 → 1250", quote: "I was stuck for 2 years. White Knight showed me I was losing because of time trouble, not tactics. Fixed it in 3 weeks." },
                        { name: "Sarah K.", rating: "1100 → 1450", quote: "The customized opening prep is insane. I'm getting winning positions every game now." },
                        { name: "James L.", rating: "1500 → 1800", quote: "My coach used the report to build my training plan. It saved us like 5 hours of analysis." }
                    ].map((result, i) => (
                        <GlassCard key={i} className="p-6 md:p-8 bg-white/5 border-white/5">
                            <div className="flex items-center gap-2 text-amber-400 mb-4">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                            <p className="text-slate-300 text-base md:text-lg mb-6 italic">"{result.quote}"</p>
                            <div>
                                <div className="text-white font-bold">{result.name}</div>
                                <div className="text-emerald-400 text-sm font-bold">{result.rating} in 3 months</div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ResultsSection;
