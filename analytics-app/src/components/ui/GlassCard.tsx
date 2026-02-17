import React from 'react';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl ${className}`}>
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
    </div>
);

export default GlassCard;
