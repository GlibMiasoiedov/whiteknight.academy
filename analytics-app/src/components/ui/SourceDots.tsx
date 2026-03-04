import React from 'react';

export type DataSource = 'chess.com' | 'lichess' | 'pgn';

export const SOURCE_META: Record<DataSource, { color: string; label: string }> = {
    'chess.com': { color: '#7FA650', label: 'Chess.com' },
    'lichess': { color: '#E8E8E8', label: 'Lichess' },
    'pgn': { color: '#60A5FA', label: 'PGN' },
};

interface SourceDotsProps {
    /** Sources that this widget/row has data from */
    sources: DataSource[];
    /** Sources that are currently toggled ON by the user */
    activeSources: DataSource[];
    size?: number;
}

/**
 * Minimalistic dot row showing which data sources contributed
 * to a given widget. Active + matching = colored glow; otherwise dimmed.
 */
const SourceDots: React.FC<SourceDotsProps> = ({ sources, activeSources, size = 6 }) => {
    return (
        <div className="flex items-center gap-1">
            {(Object.keys(SOURCE_META) as DataSource[]).map((key) => {
                const active = activeSources.includes(key) && sources.includes(key);
                const meta = SOURCE_META[key];
                return (
                    <div
                        key={key}
                        title={active ? meta.label : `${meta.label} (inactive)`}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            background: active ? meta.color : 'rgba(255,255,255,0.08)',
                            boxShadow: active ? `0 0 6px ${meta.color}60` : 'none',
                            transition: 'all 0.4s ease',
                            flexShrink: 0,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default SourceDots;
