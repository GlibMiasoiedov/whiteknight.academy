import React, { useState, useRef, useMemo } from 'react';
import { Upload, RefreshCw, Lock, ArrowUpRight, ChevronDown, Filter, Crosshair, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { DASHBOARD_FONTS } from '../../constants/theme';
import StatRoseChart, { type StatType } from '../landing/StatRoseChart';

import TimeControlsTable from './widgets/TimeControlsTable';
import EloEstimateCard from './widgets/EloEstimateCard';
import MostPlayedOpenings from './widgets/MostPlayedOpenings';
import ActivityHeatmap from './widgets/ActivityHeatmap';
import TopOpponentsList from './widgets/TopOpponentsList';
import RatingDynamicsChart from './widgets/RatingDynamicsChart';
import FiltersDrawer from './widgets/FiltersDrawer';
import EloExplanationModal from '../modals/EloExplanationModal';
import OpeningsTab from './tabs/OpeningsTab';

export interface ReportDashboardProps {
    showStateB: boolean;
    theme: { color: string };
    onUpgradeClick?: () => void;
    /** Fires when activeSlice changes (for RightPanel dynamic insights) */
    onActiveSliceChange?: (sliceId: string | null) => void;
    /** Fires when a widget "?" hint button is clicked */
    onWidgetHint?: (hintKey: string, data?: any) => void;
    /** 0–1 value representing how many days to show in heatmap */
    timeRangeDays?: number;
    /** Fires when the active sub-tab inside Report changes */
    onActiveTabChange?: (tab: string) => void;
}

const REPORT_TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'openings', label: 'Openings' },
    { id: 'tactics', label: 'Middlegame & Tactics' },
    { id: 'endgame', label: 'Endgame' },
    { id: 'time', label: 'Time & Habits' },
    { id: 'opponents', label: 'Opponents' },
    { id: 'compare', label: 'Compare', isPro: true },
    { id: 'biometrics', label: 'Biometrics', isPro: true },
    { id: 'action-plan', label: 'Action Plan', highlight: true }
];

const ReportDashboard: React.FC<ReportDashboardProps> = ({ showStateB, theme, onUpgradeClick: _onUpgradeClick, onActiveSliceChange, onWidgetHint, onActiveTabChange }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Notify parent component when local activeTab changes, and reset local slice state
    React.useEffect(() => {
        onActiveTabChange?.(activeTab);
        setActiveSlice(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);
    const [isEloModalOpen, setIsEloModalOpen] = useState(false);
    const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

    // Global Filters State
    // NOTE FOR V2 (DATA INTEGRATION): 
    // These states will be used as parameters for your API calls.
    // E.g., const { data } = useAnalyticsData(userId, timeFilter, modeFilter, colorFilter);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [timeFilter, setTimeFilter] = useState('Last 30 Days');
    const [modeFilter, setModeFilter] = useState('Blitz & Rapid');
    const [colorFilter, setColorFilter] = useState('White & Black');

    // Tab Scrolling State - Arrow logic removed in favor of premium-scrollbar
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Create a composite key to force re-render/re-animation of widgets when filters change
    // When real data is hooked up, the components will naturally re-render when their data props change,
    // but forcing a key change is a good way to re-trigger entry animations.
    const filterKey = `${timeFilter} -${modeFilter} -${colorFilter} `;

    const gameCount = useMemo(() => {
        if (timeFilter.includes('30')) return 42;
        if (timeFilter.includes('90')) return 128;
        if (timeFilter.includes('Year')) return 512;
        if (timeFilter.includes('All')) return 1024;
        return 50;
    }, [timeFilter]);

    // Chart State
    const [activeSlice, setActiveSlice] = useState<string | null>(null);
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

    const handleSliceClick = (id: string) => {
        const next = activeSlice === id ? null : id;
        setActiveSlice(next);
        onActiveSliceChange?.(next);
    };

    const mockStats: StatType[] = [
        { id: 'opening', label: 'Opening', score: 85, gradientFrom: '#8B5CF6', gradientTo: '#6D28D9', insight: { title: 'Solid Preparation', leak: 'Missing aggressive continuations in the Italian Game.', action: 'Focus on early middle-game plans.' } },
        { id: 'tactics', label: 'Tactics', score: 65, gradientFrom: '#3B82F6', gradientTo: '#1D4ED8', insight: { title: 'Room for Growth', leak: 'Missing 2-move tactical sequences under pressure.', action: 'Daily tactical puzzles focusing on pins.' } },
        { id: 'endgame', label: 'Ending', score: 45, gradientFrom: '#10B981', gradientTo: '#047857', insight: { title: 'Critical Weakness', leak: 'Poor rook endgame technique costs +1 advantage.', action: 'Join Rook Endgames group.' } },
        { id: 'advantage', label: 'Advantage Cap.', score: 75, gradientFrom: '#F43F5E', gradientTo: '#BE123C', insight: { title: 'Good Conversion', leak: 'Occasional blunders in clearly winning positions (+5).', action: 'Simplify when ahead.' } },
        { id: 'time', label: 'Time Mgmt', score: 55, gradientFrom: '#F59E0B', gradientTo: '#B45309', insight: { title: 'Time Trouble', leak: 'Averaging less than 30s for the last 15 moves.', action: 'Speed up opening play.' } },
        { id: 'resourcefulness', label: 'Resourcefulness', score: 90, gradientFrom: '#06B6D4', gradientTo: '#0E7490', insight: { title: 'Excellent Defense', leak: 'None major. Very resilient in worse positions.', action: 'Keep playing tricky lines when losing.' } }
    ];

    const timeOptions = ['Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'];
    const modeOptions = ['Blitz & Rapid', 'Bullet', 'Classical', 'Daily'];
    const colorOptions = ['White & Black', 'White Only', 'Black Only'];

    // Global Filter Bar (Sticky)
    const FilterBar = () => (
        <div className="sticky top-0 z-20 bg-[#080C14]/90 backdrop-blur-md border-b border-white/5 py-3 mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400 mr-2">
                <Filter size={16} />
                <span className="text-sm font-semibold text-white">Filters:</span>
            </div>

            {/* Time Filter */}
            <div className="relative">
                <button
                    onClick={() => setActiveDropdown(activeDropdown === 'time' ? null : 'time')}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-slate-300 flex items-center gap-2 transition-colors"
                >
                    {timeFilter} <ChevronDown size={14} className={`transition - transform ${activeDropdown === 'time' ? 'rotate-180' : ''} `} />
                </button>
                {activeDropdown === 'time' && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-[#0F1623] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        {timeOptions.map(opt => (
                            <button
                                key={opt}
                                onClick={() => { setTimeFilter(opt); setActiveDropdown(null); }}
                                className={`w-full text-left px-4 py-2 text-xs transition-colors block ${timeFilter === opt ? 'bg-violet-600/20 text-violet-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Mode Filter */}
            <div className="relative">
                <button
                    onClick={() => setActiveDropdown(activeDropdown === 'mode' ? null : 'mode')}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-slate-300 flex items-center gap-2 transition-colors"
                >
                    {modeFilter} <ChevronDown size={14} className={`transition - transform ${activeDropdown === 'mode' ? 'rotate-180' : ''} `} />
                </button>
                {activeDropdown === 'mode' && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-[#0F1623] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        {modeOptions.map(opt => (
                            <button
                                key={opt}
                                onClick={() => { setModeFilter(opt); setActiveDropdown(null); }}
                                className={`w-full text-left px-4 py-2 text-xs transition-colors block ${modeFilter === opt ? 'bg-violet-600/20 text-violet-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Color Filter */}
            <div className="relative">
                <button
                    onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-slate-300 flex items-center gap-2 transition-colors"
                >
                    {colorFilter} <ChevronDown size={14} className={`transition - transform ${activeDropdown === 'color' ? 'rotate-180' : ''} `} />
                </button>
                {activeDropdown === 'color' && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-[#0F1623] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        {colorOptions.map(opt => (
                            <button
                                key={opt}
                                onClick={() => { setColorFilter(opt); setActiveDropdown(null); }}
                                className={`w-full text-left px-4 py-2 text-xs transition-colors block ${colorFilter === opt ? 'bg-violet-600/20 text-violet-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Invisible overlay to catch outside clicks and close dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveDropdown(null)}
                />
            )}

            {/* Advanced Filters Button */}
            <div className="ml-auto">
                <button
                    onClick={() => setIsFiltersDrawerOpen(true)}
                    className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-2 hover-glow-emerald-strong hover:-translate-y-0.5"
                >
                    <Filter size={14} /> Advanced
                </button>
            </div>
        </div>
    );

    // Render Sub Navigation
    const SubNav = () => (
        <div className="flex items-center mb-6 -mx-2 px-2">
            <div
                ref={scrollContainerRef}
                className="flex-1 flex items-center gap-3 overflow-x-auto premium-scrollbar pb-4 pt-2 px-1 scroll-smooth"
            >
                {REPORT_TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    const isHighlight = tab.highlight;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={isActive && !isHighlight ? {
                                backgroundColor: `${theme.color}25`,
                                borderColor: `${theme.color}60`,
                                boxShadow: `0 8px 25px -5px ${theme.color}50`,
                                color: 'white'
                            } : undefined}
                            className={`px-4 py-1.5 text-[13px] font-bold whitespace-nowrap rounded-xl border transition-all duration-300 relative group flex-shrink-0
                                ${isActive
                                    ? (isHighlight
                                        ? 'bg-amber-500/25 border-amber-500/60 text-amber-300 shadow-[0_8px_25px_-5px_rgba(245,158,11,0.5)]'
                                        : '')
                                    : (isHighlight ? 'tab-inactive-highlight' : 'tab-inactive')
                                }`}
                        >
                            <span className="flex items-center gap-2 relative z-10 tracking-wide">
                                {tab.label}
                                {tab.isPro && <Lock size={13} className={isActive ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-400'} />}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderOverview = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            {/* Header Card */}
            <Card className="mb-6 bg-gradient-to-r from-white/[0.03] to-transparent border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 border-l-4 border-violet-500 pl-4 w-full xl:w-auto">
                        <div>
                            <div className="flex items-center gap-3">
                                <Badge type="pro" label="GM" className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-bold px-2 py-1 text-sm rounded shadow-[0_0_15px_rgba(245,158,11,0.2)]" />
                                <h2 className="text-3xl font-bold text-white tracking-tight">John Doe</h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-semibold">1450</span>
                                    <span>Rapid</span>
                                    <span className="flex items-center text-emerald-400 font-medium text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shadow-sm">
                                        <ArrowUpRight size={14} className="mr-0.5" /> +14
                                    </span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-slate-300 border border-white/5 break-words">High Confidence</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between xl:justify-end gap-y-4 gap-x-6 px-4 py-3 bg-black/20 rounded-xl border border-white/5 w-full xl:w-auto">
                        <div className="text-left w-auto">
                            <div className="text-white font-bold text-base md:text-lg">79,570</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Played in Total</div>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                        <div className="text-left w-auto">
                            <div className="font-bold text-base md:text-lg"><span className="text-emerald-400">76.6%</span> <span className="text-slate-600">-</span> <span className="text-slate-400">11.1%</span> <span className="text-slate-600">-</span> <span className="text-red-400">12.3%</span></div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Win - Draw - Loss</div>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                        <div className="text-left w-[100%] md:w-auto border-t md:border-none border-white/5 pt-3 md:pt-0">
                            <div className="text-white font-bold text-base md:text-lg">1 day ago</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Last Recorded</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Data Widgets Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-4 xl:gap-6 mb-6">
                <RatingDynamicsChart key={`rdc - ${filterKey} `} onHint={() => onWidgetHint?.('rating')} />
                <EloEstimateCard key={`elo - ${filterKey} `} onExplainElo={() => setIsEloModalOpen(true)} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-4 xl:gap-6 mb-6">
                <Card className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] flex flex-col items-center p-8 relative overflow-hidden border border-white/5 hover:border-violet-500/30 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none" />
                    <div className="w-full flex justify-between items-start z-10 absolute top-6 left-6 pr-12">
                        <div className="flex items-center gap-2">
                            <Crosshair size={16} className="text-violet-400" />
                            <div className={DASHBOARD_FONTS.widgetTitle}>Performance Radar</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge type="info" label={`Based on ${gameCount} games`} className="bg-white/5 border-white/10 hidden md:flex" />
                            <button
                                onClick={() => {
                                    setActiveSlice(null);
                                    onActiveSliceChange?.(null);
                                    onWidgetHint?.('radar');
                                }}
                                className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3 h-3" /> Insights
                            </button>
                        </div>
                    </div>
                    <div className="w-full max-w-[380px] xl:max-w-[440px] aspect-square flex items-center justify-center mt-8 z-10 transition-transform duration-500 mx-auto">
                        <StatRoseChart
                            key={`radar - ${filterKey} `}
                            activeSlice={activeSlice}
                            hoveredSlice={hoveredSlice}
                            onHover={setHoveredSlice}
                            onClick={handleSliceClick}
                            stats={mockStats}
                            idPrefix="report-"
                        />
                    </div>
                </Card>
                <TopOpponentsList key={`opp - ${filterKey} `} onHint={() => onWidgetHint?.('opponents')} onViewAll={() => setActiveTab('opponents')} />
            </div>

            <div className="mb-6">
                <ActivityHeatmap key={`heatmap - ${filterKey} `} onHint={(data) => onWidgetHint?.('activity', data)} />
            </div>

            <div className="mb-6">
                <TimeControlsTable key={`tc - ${filterKey} `} onHint={() => onWidgetHint?.('timecontrols')} />
            </div>

            <div className="mb-6">
                <MostPlayedOpenings
                    key={`op - ${filterKey} `}
                    onHintWhite={() => onWidgetHint?.('openings_white')}
                    onHintBlack={() => onWidgetHint?.('openings_black')}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-4 animate-in fade-in">
            <EloExplanationModal isOpen={isEloModalOpen} onClose={() => setIsEloModalOpen(false)} />
            <FiltersDrawer isOpen={isFiltersDrawerOpen} onClose={() => setIsFiltersDrawerOpen(false)} />
            <div className="flex justify-between items-end pb-2">
                <div className="mb-4">
                    <h1 className={DASHBOARD_FONTS.h1 + " mb-1"}>
                        {showStateB ? (
                            <>Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Report</span></>
                        ) : (
                            <>Report <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Locked</span></>
                        )}
                    </h1>
                    <p className={DASHBOARD_FONTS.body}>
                        {showStateB ? "Generated Today • Based on last 50 games" : "Connect your chess account on the Home screen to generate your analysis."}
                    </p>
                </div>
                {showStateB && (
                    <div className="flex gap-2">
                        <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all duration-200 shadow-sm" title="Export PDF">
                            <Upload size={18} />
                        </button>
                        <Button themeColor={theme.color} icon={RefreshCw}>Refresh</Button>
                    </div>
                )}
            </div>

            {showStateB ? (
                <>
                    {FilterBar()}
                    {SubNav()}
                    <div className="mt-6">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'openings' && <OpeningsTab onHint={(hintKey, data) => onWidgetHint?.(hintKey, data)} />}
                        {activeTab !== 'overview' && activeTab !== 'openings' && (
                            <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
                                <h3 className="text-xl font-bold text-white mb-2">{REPORT_TABS.find(t => t.id === activeTab)?.label}</h3>
                                <p className="text-slate-400">Detailed analysis module coming soon.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 mt-12 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <Lock size={32} className="text-emerald-500" />
                    </div>
                    <h2 className={DASHBOARD_FONTS.h2 + " mb-2"}>Analysis Unavailable</h2>
                    <p className={DASHBOARD_FONTS.body + " max-w-md mb-8"}>Please connect your chess accounts on the Home screen to unlock your detailed performance report.</p>
                </div>
            )}
        </div>
    );
};

export default ReportDashboard;
