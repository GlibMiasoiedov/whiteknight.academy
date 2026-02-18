import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

const MobileGate: React.FC = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const check = () => setShow(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[99999] bg-[#080C14] flex flex-col items-center justify-center p-8 text-center">
            {/* Animated glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
            </div>

            {/* Icon */}
            <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/20 border border-white/10">
                    <Monitor size={40} className="text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-white/10">
                    <Smartphone size={16} className="text-slate-400" />
                </div>
            </div>

            {/* Text */}
            <h1 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">
                Desktop Required
            </h1>
            <p className="font-body text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
                White Knight Analytics is optimised for desktop and laptop screens.
                Please switch to a computer for the best experience.
            </p>

            {/* Mobile App Badge */}
            <div className="px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider mb-8">
                📱 Mobile App — Coming Soon
            </div>

            {/* Back link */}
            <a
                href="https://whiteknight.academy"
                className="text-sm text-slate-500 hover:text-white transition-colors underline underline-offset-4"
            >
                ← Back to whiteknight.academy
            </a>
        </div>
    );
};

export default MobileGate;
