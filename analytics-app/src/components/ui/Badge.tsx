import React from 'react';
import { Lock, Check } from 'lucide-react';

interface BadgeProps {
    type?: 'high' | 'medium' | 'success' | 'neutral' | 'plan' | 'pro' | 'locked' | 'connected' | string;
    label: string;
    className?: string;
    onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({ type = 'medium', label, className = '', onClick }) => {
    const styles: Record<string, string> = {
        high: 'bg-red-500/10 text-red-400 border-red-500/20',
        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        neutral: 'bg-slate-800 text-slate-400 border-slate-700',
        plan: 'bg-violet-500/10 text-violet-300 border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.15)]',
        pro: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
        locked: 'bg-slate-800 text-slate-500 border-slate-700',
        connected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        done: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    };

    // Fallback to neutral if type is not found
    const styleClass = styles[type] || styles.neutral;

    return (
        <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${styleClass} ${className}`}
            onClick={onClick}
        >
            {type === 'locked' && <Lock size={8} />}
            {type === 'connected' && <Check size={8} />}
            {label}
        </span>
    );
};

export default Badge;
