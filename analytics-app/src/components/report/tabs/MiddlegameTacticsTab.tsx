import { DASHBOARD_FONTS } from '../../../constants/theme';
import MistakeBreakdown from './tactics/MistakeBreakdown';
import TacticalMotifsHeatmap from './tactics/TacticalMotifsHeatmap';
import AdvantageCapitalization from './tactics/AdvantageCapitalization';

interface MiddlegameTacticsTabProps {
    onHint?: (hintKey: string, data?: any) => void;
}

const MiddlegameTacticsTab: React.FC<MiddlegameTacticsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-2">
                <h2 className={DASHBOARD_FONTS.h2}>Middlegame & Tactics</h2>
                <div className={DASHBOARD_FONTS.body + " max-w-3xl"}>
                    Analysis of your middle-game decision making and tactical vision.
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-[1fr_400px] gap-6">
                <div className="xl:col-span-2 2xl:col-span-1">
                    <AdvantageCapitalization onHint={() => onHint?.('advantage_capital')} />
                </div>
                <div className="xl:col-span-1 2xl:col-span-1 2xl:col-start-1 2xl:row-start-2">
                    <TacticalMotifsHeatmap onHint={() => onHint?.('tactical_motifs')} />
                </div>
                <div className="xl:col-span-1 2xl:col-span-1 2xl:col-start-2 2xl:row-start-1 2xl:row-span-2">
                    <MistakeBreakdown onHint={() => onHint?.('mistake_breakdown')} />
                </div>
            </div>
        </div>
    );
};

export default MiddlegameTacticsTab;
