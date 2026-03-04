import React from 'react';
import { DASHBOARD_FONTS } from '../../../constants/theme';
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
            <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
                <h2 className={DASHBOARD_FONTS.h2}>Opponents & Matchups</h2>
                <div className={DASHBOARD_FONTS.body + " max-w-3xl"}>
                    Analyze your performance against specific players and different playing styles to identify your most difficult matchups.
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
