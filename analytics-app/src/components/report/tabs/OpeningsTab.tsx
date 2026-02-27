import React from 'react';
import MostPlayedOpenings from '../widgets/MostPlayedOpenings';
import OpeningHealthSummary from './openings/OpeningHealthSummary';
import OpeningSuccessRate from './openings/OpeningSuccessRate';

interface OpeningsTabProps {
    onHint?: (hintKey: string, data?: any) => void;
}

const OpeningsTab: React.FC<OpeningsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Opening Repertoire</h2>
                    <p className="text-slate-400 text-sm">Deep dive into your first 15 moves performance.</p>
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
