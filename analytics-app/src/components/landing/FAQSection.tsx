import { useState } from 'react';
import { FONTS } from '../../constants/theme';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    const faqs = [
        { q: "How does the AI analysis work?", a: "We analyze your games to detect recurring patterns: where you lose advantage, what decisions repeat under pressure, and which themes cost you rating. You get evidence from your own positions plus coach-ready recommendations." },
        { q: "Can I use this without a Chess.com account?", a: "Yes. You can connect Chess.com, connect Lichess, or upload PGNs." },
        { q: "How are coaches selected?", a: "If you choose coaching, we match you to a coach (or group) based on your goals, rating range, language, and schedule. Coaching is optional." },
        { q: "What is the difference between Free and Pro?", a: "Free includes the starter report with core metrics. Pro includes unlimited analysis, deeper history, AI assistant features, and advanced opponent preparation tools." },
        { q: "Is my data private?", a: "Yes. We never ask for your password. Your game data is used to generate your reports and improve your experience. You can disconnect platforms or delete uploads anytime." },
        { q: "Is White Knight Analytics affiliated with Chess.com or Lichess?", a: "No. White Knight Analytics is an independent product." }
    ];

    return (
        <section id="faq" className="py-16 md:py-16 relative z-10">
            <div className="w-full px-6 md:px-12 lg:px-24">
                <h2 className={`${FONTS.h1} text-center text-white mb-10 md:mb-16`}>Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => toggle(i)}
                            className={`border border-white/10 rounded-3xl p-8 transition-all cursor-pointer group ${openIndex === i ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 hover:border-white/20 bg-black/20'}`}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className={`font-bold text-white text-xl ${FONTS.h2} !text-xl`}>{item.q}</h3>
                                    <ChevronDown size={24} className={`text-slate-500 group-hover:text-white transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-white' : ''}`} />
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-slate-400 text-lg leading-relaxed pt-2">{item.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
