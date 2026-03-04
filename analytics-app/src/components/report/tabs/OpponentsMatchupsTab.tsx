import React from 'react';
import TerminationBreakdown from '../widgets/TerminationBreakdown';
import PlayerArchetypes from '../widgets/PlayerArchetypes';
import TopOpponentsList from '../widgets/TopOpponentsList';

interface OpponentsMatchupsTabProps {
    onHint?: (hintKey: string, data?: any) => void;
}

const OpponentsMatchupsTab: React.FC<OpponentsMatchupsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 animate-in fade-in pb-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-1">
                        Opponents & Matchups
                    </h2>
                    <p className="text-sm font-medium text-slate-400 max-w-2xl">
                        Analyze your performance against specific players and different playing styles to identify your most difficult matchups.
                    </p>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="flex flex-col gap-6">

                {/* 1. Performance vs Styles (First, all screens, full width) */}
                <div className="w-full">
                    <PlayerArchetypes onHint={() => onHint?.('player_archetypes')} />
                </div>

                {/* 2 & 3. Specific Opponents & Termination Breakdown (Side-by-side on large screens) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TopOpponentsList onHint={() => onHint?.('opponents')} />
                    <TerminationBreakdown onHint={() => onHint?.('termination_breakdown')} />
                </div>

            </div>
        </div>
    );
};

export default OpponentsMatchupsTab;
