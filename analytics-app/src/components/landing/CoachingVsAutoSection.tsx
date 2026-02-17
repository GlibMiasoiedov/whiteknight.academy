import { FONTS } from '../../constants/theme';
import { Brain, X, Users, CheckCircle } from 'lucide-react';

const CoachingVsAutoSection = ({ onRegister }: { onRegister: () => void }) => (
    <section id="coaching" className="py-16 md:py-20 relative z-10">
        <div className="w-full px-6 md:px-12 lg:px-24 text-center">
            <h2 className={`${FONTS.h1} text-white mb-6`}>Why Real Coaching Wins</h2>
            <p className={`text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 md:mb-20 ${FONTS.body}`}>Analytics shows the problem. Coaching fixes it — faster, with feedback you can’t get from automated training alone.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                {/* 1. Automated Apps */}
                <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/5 text-left opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/5">
                            <Brain size={32} />
                        </div>
                        <h3 className={`text-xl md:text-3xl font-bold text-white ${FONTS.h2}`}>Automated Training Apps</h3>
                    </div>
                    <ul className={`space-y-4 md:space-y-8 text-slate-400 text-base md:text-xl ${FONTS.body}`}>
                        <li className="flex items-start gap-4 md:gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> One-size-fits-all content</li>
                        <li className="flex items-start gap-4 md:gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> Weak link to your recurring mistakes</li>
                        <li className="flex items-start gap-4 md:gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> No “why” behind decisions</li>
                        <li className="flex items-start gap-4 md:gap-5"><X size={28} className="text-slate-600 mt-1 flex-shrink-0" /> Progress stalls after early gains</li>
                    </ul>
                </div>

                {/* 2. Coaching (Winner) */}
                <div className="p-6 md:p-12 text-left ring-1 ring-violet-500/50 shadow-[0_0_80px_-20px_rgba(139,92,246,0.15)] bg-gradient-to-br from-violet-900/20 to-transparent rounded-[2rem] md:rounded-[3rem] relative overflow-hidden backdrop-blur-xl border border-white/10">
                    <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-violet-600 flex flex-shrink-0 aspect-square items-center justify-center text-white shadow-lg shadow-violet-500/40">
                            <Users size={32} />
                        </div>
                        <h3 className={`text-xl md:text-3xl font-bold text-white ${FONTS.h2}`}>Training with Real Coaches</h3>
                    </div>
                    <ul className={`space-y-4 md:space-y-8 text-slate-200 font-medium text-base md:text-xl ${FONTS.body}`}>
                        <li className="flex items-start gap-4 md:gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Coach matched to goals, rating, language, schedule</li>
                        <li className="flex items-start gap-4 md:gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Live feedback on your real games (“why this move?”)</li>
                        <li className="flex items-start gap-4 md:gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Session plan built from your patterns — not generic exercises</li>
                        <li className="flex items-start gap-4 md:gap-5"><CheckCircle size={28} className="text-emerald-400 mt-1 flex-shrink-0 drop-shadow-md" /> Progress tracked week to week in your dashboard</li>
                    </ul>
                    <div className="mt-8 md:mt-12 text-center">
                        <button onClick={onRegister} className={`w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-100 transition-all hover:-translate-y-1 ${FONTS.body}`}>
                            Match Me With a Coach
                        </button>
                        <p className="text-slate-400 text-sm mt-3">Coaching is optional. Start with a free analytics report.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default CoachingVsAutoSection;
