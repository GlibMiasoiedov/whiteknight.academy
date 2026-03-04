import React from 'react';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import MostPlayedOpenings from '../widgets/MostPlayedOpenings';
import OpeningHealthSummary from './openings/OpeningHealthSummary';
import OpeningSuccessRate from './openings/OpeningSuccessRate';

interface OpeningsTabProps {
    onHint?: (hintKey: string, data?: any) => void;
}

const OpeningsTab: React.FC<OpeningsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-2">
                <h2 className={DASHBOARD_FONTS.h2}>Opening Repertoire</h2>
                <div className={DASHBOARD_FONTS.body + " max-w-3xl"}>
                    Deep dive into your first 15 moves performance.
                </div>
            </div>

            <OpeningHealthSummary />

            <OpeningSuccessRate onHint={() => onHint?.('opening_success_rate')} />

            <MostPlayedOpenings
                onHintWhite={() => onHint?.('openings_white')}
                onHintBlack={() => onHint?.('openings_black')}
            />

            <div className="grid grid-cols-1 gap-6 pb-6">
                {/* Mistakes have been moved to the Right Panel */}
            </div>
        </div>
    );
};

export default OpeningsTab;
