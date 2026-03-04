import React from 'react';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import EndgamePerformance from './endgame/EndgamePerformance';
import EndgameThemes from './endgame/EndgameThemes';
import PracticalEndgameIssues from './endgame/PracticalEndgameIssues';

interface EndgameTabProps {
    onHint?: (hintKey: string, data?: any) => void;
}

const EndgameTab: React.FC<EndgameTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Summary */}
            <div className="flex flex-col gap-2">
                <h2 className={DASHBOARD_FONTS.h2}>Endgame Mastery</h2>
                <div className={DASHBOARD_FONTS.body + " max-w-3xl"}>
                    An analysis of your performance after move 30. Discover how effectively you convert advantages, calculate in low-material positions, and manage time scrambles.
                </div>
            </div>

            {/* Widget Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-[1fr_400px] gap-6">
                <div className="xl:col-span-2 2xl:col-span-1">
                    <EndgamePerformance onHint={() => onHint?.('endgame_performance')} />
                </div>

                <div className="xl:col-span-1 2xl:col-span-1 2xl:col-start-1 2xl:row-start-2">
                    <EndgameThemes onHint={() => onHint?.('endgame_themes')} />
                </div>

                <div className="xl:col-span-1 2xl:col-span-1 2xl:col-start-2 2xl:row-start-1 2xl:row-span-2">
                    <PracticalEndgameIssues onHint={() => onHint?.('endgame_issues')} />
                </div>
            </div>
        </div>
    );
};

export default EndgameTab;
