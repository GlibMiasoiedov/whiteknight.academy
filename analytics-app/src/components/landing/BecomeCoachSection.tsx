import { useState } from 'react';
import { FONTS } from '../../constants/theme';
import CoachApplicationModal from './CoachApplicationModal';

const BecomeCoachSection = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <section id="coach" className="py-20 md:py-10 relative z-10 overflow-hidden">
                <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className={`${FONTS.h1} text-white mb-6 md:mb-8 whitespace-nowrap`}>
                            Want to be our coach?
                        </h2>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md mb-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className={`text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider ${FONTS.label}`}>Players: start with a free report. Coaches: apply below.</span>
                        </div>
                        <p className={`text-lg md:text-2xl text-slate-400 mb-10 md:mb-12 ${FONTS.body} leading-relaxed`}>
                            Join White Knight Academy as a coach. Use analytics reports to teach faster, track student progress, and run structured sessions.
                        </p>
                        <button onClick={() => setShowModal(true)} className={`bg-transparent border border-white/30 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-slate-900 transition-all ${FONTS.body}`}>Apply as a Coach</button>
                    </div>
                </div>
            </section>
            <CoachApplicationModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default BecomeCoachSection;
