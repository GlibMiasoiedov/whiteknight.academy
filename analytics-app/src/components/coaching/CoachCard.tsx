import React from 'react';
import type { Coach } from './mockData';
import { LANGUAGE_FLAGS } from './mockData';
import Badge from '../ui/Badge';

interface CoachCardProps {
    coach: Coach;
    compact?: boolean;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach, compact = false }) => {
    // Generate initials for avatar placeholder
    const initials = coach.name.split(' ').map(n => n[0]).join('');

    if (compact) {
        return (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initials}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">{coach.title} {coach.name}</div>
                    <div className="text-xs text-slate-400">{coach.specialties[0]}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-amber-500/20">
                {initials}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{coach.title} {coach.name}</span>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{coach.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {coach.specialties.map(s => (
                        <Badge key={s} type="neutral" label={s} />
                    ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>Languages:</span>
                    {coach.languages.map(lang => (
                        <span key={lang} title={lang.toUpperCase()}>{LANGUAGE_FLAGS[lang] || lang}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoachCard;
