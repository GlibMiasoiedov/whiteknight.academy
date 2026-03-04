import React from 'react';
import { DASHBOARD_FONTS } from '../../../constants/theme';
import BiometricsSummaryCard from '../widgets/BiometricsSummaryCard';
import BiometricsTimelineChart from '../widgets/BiometricsTimelineChart';
import BiometricsRecommendations from '../widgets/BiometricsRecommendations';

interface BiometricsTabProps {
    onHint: (hint: string, data?: any) => void;
}

const BiometricsTab: React.FC<BiometricsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h2 className={DASHBOARD_FONTS.h2}>Biometrics Overlay</h2>
                <div className={DASHBOARD_FONTS.body + " max-w-3xl"}>
                    Analyze your body's stress response during games. Correlate heart rate and fatigue metrics with critical mistakes and eval swings.
                </div>
            </div>

            {/* Widget Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Timeline Chart (Large block, 8 cols width) */}
                <div className="col-span-1 xl:col-span-8">
                    <BiometricsTimelineChart onHint={() => onHint('biometrics_timeline')} />
                </div>

                {/* Right Stack: Summary & Recommendations */}
                <div className="col-span-1 xl:col-span-4 flex flex-col gap-6">
                    <div className="flex-1 min-h-[300px]">
                        <BiometricsSummaryCard onHint={() => onHint('biometrics_summary')} />
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <BiometricsRecommendations />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BiometricsTab;
