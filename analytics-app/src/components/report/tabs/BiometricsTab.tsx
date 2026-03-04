import React from 'react';
import BiometricsTimelineChart from '../widgets/BiometricsTimelineChart';
import BiometricsSummaryCard from '../widgets/BiometricsSummaryCard';
import BiometricsSleepCorrelation from '../widgets/BiometricsSleepCorrelation';
import BiometricsHRVStatus from '../widgets/BiometricsHRVStatus';
import BiometricsRecoveryTimer from '../widgets/BiometricsRecoveryTimer';
import BiometricsFatigueDecay from '../widgets/BiometricsFatigueDecay';
import BiometricsAdrenalineSpikes from '../widgets/BiometricsAdrenalineSpikes';
import BiometricsCircadianHeatmap from '../widgets/BiometricsCircadianHeatmap';

interface BiometricsTabProps {
    onHint: (hint: string, data?: any) => void;
}

const BiometricsTab: React.FC<BiometricsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Biometrics Overlay</h2>
                <p className="text-sm font-medium text-slate-400 max-w-2xl">
                    Correlation of physical stress, fatigue, and focus against your chess performance.
                    Identify the exact physical states that lead to blunders or peak accuracy.
                </p>
            </div>

            {/* Row 1: Core Timeline & Summary */}
            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 flex-col">
                <div className="2xl:col-span-8 order-2 2xl:order-1">
                    <BiometricsTimelineChart onHint={() => onHint('biometrics-timeline')} />
                </div>
                <div className="2xl:col-span-4 order-1 2xl:order-2">
                    <BiometricsSummaryCard onHint={() => onHint('biometrics-summary')} />
                </div>
            </div>

            {/* Row 2: Sleep, Readiness, Recovery */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                <div className="min-h-[340px]">
                    <BiometricsSleepCorrelation onHint={() => onHint('biometrics-sleep')} />
                </div>
                <div className="min-h-[340px]">
                    <BiometricsHRVStatus onHint={() => onHint('biometrics-hrv')} />
                </div>
                <div className="md:col-span-2 2xl:col-span-1 min-h-[340px]">
                    <BiometricsRecoveryTimer onHint={() => onHint('biometrics-recovery')} />
                </div>
            </div>

            {/* Row 3: Fatigue Drop & Adrenaline Spikes */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="min-h-[380px]">
                    <BiometricsFatigueDecay onHint={() => onHint('biometrics-fatigue')} />
                </div>
                <div className="min-h-[380px]">
                    <BiometricsAdrenalineSpikes onHint={() => onHint('biometrics-adrenaline')} />
                </div>
            </div>

            {/* Row 4: Circadian Rhythm */}
            <div className="grid grid-cols-1 gap-6">
                <div className="min-h-[380px]">
                    <BiometricsCircadianHeatmap onHint={() => onHint('biometrics-circadian')} />
                </div>
            </div>
        </div>
    );
};

export default BiometricsTab;
