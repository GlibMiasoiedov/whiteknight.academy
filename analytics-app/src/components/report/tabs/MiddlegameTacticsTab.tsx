import MistakeBreakdown from './tactics/MistakeBreakdown';
import TacticalMotifsHeatmap from './tactics/TacticalMotifsHeatmap';
import AdvantageCapitalization from './tactics/AdvantageCapitalization';

interface MiddlegameTacticsTabProps {
    onHint?: (hintKey: string, data?: any) => void;
}

const MiddlegameTacticsTab: React.FC<MiddlegameTacticsTabProps> = ({ onHint }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Middlegame & Tactics</h2>
                    <p className="text-slate-400 text-sm">Analysis of your middle-game decision making and tactical vision.</p>
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
