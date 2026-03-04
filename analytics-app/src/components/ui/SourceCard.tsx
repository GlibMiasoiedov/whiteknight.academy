import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, CheckSquare, Square } from 'lucide-react';
import type { DataSource } from './SourceDots';
import { SOURCE_META } from './SourceDots';

export interface SourceConfig {
    id: DataSource;
    username: string;
    games: number;
    rating: number | null;
    ratingSystem: string | null;
    lastSync: string;
}

interface SourceCardProps {
    config: SourceConfig;
    enabled: boolean;
    onToggle: () => void;
    animDelay?: number;
}

/**
 * Togglable card representing a single data source (Chess.com / Lichess / PGN).
 * Animates in on mount. Glows with its brand color when enabled.
 */
const SourceCard: React.FC<SourceCardProps> = ({ config, enabled, onToggle, animDelay = 0 }) => {
    const [mounted, setMounted] = useState(false);
    const meta = SOURCE_META[config.id];

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), animDelay);
        return () => clearTimeout(t);
    }, [animDelay]);

    return (
        <div
            onClick={onToggle}
            className="flex-1 min-w-[200px] rounded-xl p-3 px-4 border cursor-pointer relative overflow-hidden transition-all duration-300 group bg-[#0B1220]/50"
            style={{
                background: enabled
                    ? `linear-gradient(135deg, ${meta.color}15, ${meta.color}05)`
                    : 'rgba(255,255,255,0.02)',
                borderColor: enabled ? `${meta.color}40` : 'rgba(255,255,255,0.05)',
                opacity: mounted ? (enabled ? 1 : 0.4) : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                boxShadow: enabled ? `0 4px 20px -8px ${meta.color}30` : 'none',
            }}
        >
            {/* Top accent bar */}
            {enabled && (
                <div
                    className="absolute top-0 left-0 right-0 h-[1.5px]"
                    style={{ background: `linear-gradient(90deg, ${meta.color}90, ${meta.color}10)` }}
                />
            )}

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                        style={{
                            background: meta.color,
                            boxShadow: enabled ? `0 0 8px ${meta.color}80` : 'none',
                        }}
                    />
                    <span className="text-xs font-bold text-white tracking-wide">{meta.label}</span>
                    <span className="text-[9px] font-mono text-slate-500 max-w-[80px] truncate ml-1">{config.username}</span>
                </div>
                <div style={{ color: meta.color }} className="opacity-70 transition-opacity group-hover:opacity-100">
                    {enabled ? <CheckSquare size={13} /> : <Square size={13} />}
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div className="flex gap-4">
                    <div>
                        <div className="text-sm font-black text-white leading-none">{config.games.toLocaleString()}</div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">games</div>
                    </div>
                    {config.rating != null && (
                        <div>
                            <div className="text-sm font-black text-white leading-none">{config.rating.toLocaleString()}</div>
                            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{config.ratingSystem}</div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-[8px] text-slate-600">
                    <RefreshCw size={8} />
                    <span>{config.lastSync}</span>
                </div>
            </div>
        </div>
    );
};

/** Phantom card for adding a new source */
export const AddSourceCard: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
    <div
        onClick={onClick}
        className="w-[60px] rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5 cursor-pointer opacity-50 hover:opacity-100 hover:border-white/30 hover:bg-white/5 transition-all duration-300 shrink-0"
        style={{ minHeight: '66px' }}
    >
        <Plus size={16} className="text-slate-400" />
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest shrink-0">Add</span>
    </div>
);

export default SourceCard;
