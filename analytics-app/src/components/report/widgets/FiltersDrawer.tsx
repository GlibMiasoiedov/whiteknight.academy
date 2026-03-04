import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../ui/Button';
import { DASHBOARD_FONTS, THEMES } from '../../../constants/theme';

interface FiltersDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ORDER_OPTIONS = ['Most Played', 'Best', 'Worst'];
const SIDE_OPTIONS = ['Both', 'White', 'Black'];
const TIME_CONTROLS = ['Bullet', 'Blitz', 'Rapid', 'Classical', 'Correspondence', 'Unknown'];
const OUTCOMES = ['Win', 'Draw', 'Loss'];
const TERMINATIONS = ['Resign', 'Mate', 'Clock Flag', 'Abandoned', 'Draw Agreed', 'Stalemate', 'Insufficient Material', 'Threefold Repetition', 'Fifty-move Rule', 'Timeout (vs Insufficient Material)'];
const DATE_OPTIONS = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Year', 'Custom'];
const SOURCE_OPTIONS = [
    { id: 'chess.com', label: 'Chess.com' },
    { id: 'lichess', label: 'Lichess' },
    { id: 'pgn', label: 'PGN / OTB' }
];
const RATED_OPTIONS = ['Both', 'Rated', 'Unrated'];

// Accordion helper
const FilterSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden mb-2 bg-[#080C14]">
            <button
                className="w-full flex items-center justify-between p-3 text-sm text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10"
                onClick={() => setOpen(!open)}
            >
                {title}
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {open && (
                <div className="p-3 border-t border-white/5 flex flex-col gap-2">
                    {children}
                </div>
            )}
        </div>
    );
};



const FiltersDrawer: React.FC<FiltersDrawerProps> = ({ isOpen, onClose }) => {
    const [order, setOrder] = useState('Most Played');
    const [side, setSide] = useState('Both');
    const [selectedTimeControls, setSelectedTimeControls] = useState<string[]>(['Rapid']);
    const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
    const [selectedTerminations, setSelectedTerminations] = useState<string[]>([]);

    // New Backend-ready states
    const [dateRange, setDateRange] = useState('All Time');
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [eventText, setEventText] = useState('');
    const [ratedStatus, setRatedStatus] = useState('Both');
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [opponentName, setOpponentName] = useState('');
    const [minMoves, setMinMoves] = useState('');
    const [maxMoves, setMaxMoves] = useState('');
    const [minGames, setMinGames] = useState('');

    const toggleArrayItem = (item: string, state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (state.includes(item)) setter(state.filter(i => i !== item));
        else setter([...state, item]);
    };

    return createPortal(
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`w-[320px] bg-[#0B1220] border-l border-white/10 flex flex-col fixed inset-y-0 right-0 z-[60] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0F1623]">
                    <h2 className={`${DASHBOARD_FONTS.h2} flex items-center gap-2`}>
                        Advanced Filters
                    </h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto premium-scrollbar p-5 space-y-6">

                    {/* Order Block */}
                    <div>
                        <div className={`${DASHBOARD_FONTS.label} mb-3`}>Order</div>
                        <div className="flex rounded-lg overflow-hidden border border-white/10">
                            {ORDER_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setOrder(opt)}
                                    className={`flex-1 py-1.5 text-[11px] xl:text-xs font-bold transition-colors ${order === opt ? 'bg-emerald-600/30 text-emerald-300' : 'bg-[#080C14] text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Block Header */}
                    <div>
                        <div className={`${DASHBOARD_FONTS.label} mb-3`}>Filter</div>

                        <div className="flex rounded-lg overflow-hidden border border-white/10 mb-3">
                            {SIDE_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSide(opt)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] xl:text-xs font-bold transition-colors ${side === opt ? 'bg-emerald-600/30 text-emerald-300' : 'bg-[#080C14] text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {/* Accordions */}
                        <FilterSection title="Time Control" defaultOpen>
                            {TIME_CONTROLS.map(tc => (
                                <label key={tc} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedTimeControls.includes(tc)}
                                        onChange={() => toggleArrayItem(tc, selectedTimeControls, setSelectedTimeControls)}
                                        className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    {tc}
                                </label>
                            ))}
                        </FilterSection>

                        <FilterSection title="Outcome">
                            {OUTCOMES.map(out => (
                                <label key={out} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedOutcomes.includes(out)}
                                        onChange={() => toggleArrayItem(out, selectedOutcomes, setSelectedOutcomes)}
                                        className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    {out}
                                </label>
                            ))}
                        </FilterSection>

                        <FilterSection title="Termination">
                            <div className={`${DASHBOARD_FONTS.label} mb-1 mt-1 border-b border-white/5 pb-1`}>Win/Loss</div>
                            {TERMINATIONS.slice(0, 4).map(term => (
                                <label key={term} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedTerminations.includes(term)}
                                        onChange={() => toggleArrayItem(term, selectedTerminations, setSelectedTerminations)}
                                        className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    {term}
                                </label>
                            ))}
                            <div className={`${DASHBOARD_FONTS.label} mb-1 mt-3 border-b border-white/5 pb-1`}>Draw</div>
                            {TERMINATIONS.slice(4).map(term => (
                                <label key={term} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedTerminations.includes(term)}
                                        onChange={() => toggleArrayItem(term, selectedTerminations, setSelectedTerminations)}
                                        className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    {term}
                                </label>
                            ))}
                        </FilterSection>

                        <FilterSection title="Date">
                            <div className="flex flex-col gap-1.5">
                                {DATE_OPTIONS.map(opt => (
                                    <label key={opt} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                        <input
                                            type="radio"
                                            name="date_filter"
                                            checked={dateRange === opt}
                                            onChange={() => setDateRange(opt)}
                                            className="bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Source">
                            {SOURCE_OPTIONS.map(src => (
                                <label key={src.id} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedSources.includes(src.id)}
                                        onChange={() => toggleArrayItem(src.id, selectedSources, setSelectedSources)}
                                        className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    {src.label}
                                </label>
                            ))}
                        </FilterSection>

                        <FilterSection title="Event / Tournament">
                            <input
                                type="text"
                                placeholder="e.g. Titled Tuesday"
                                value={eventText}
                                onChange={(e) => setEventText(e.target.value)}
                                className="w-full bg-[#0A0E18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600"
                            />
                        </FilterSection>

                        <FilterSection title="Rated + Unrated">
                            <div className="flex rounded-lg overflow-hidden border border-white/10 mb-1">
                                {RATED_OPTIONS.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setRatedStatus(opt)}
                                        className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-colors ${ratedStatus === opt ? 'bg-emerald-600/30 text-emerald-300' : 'bg-[#080C14] text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Opponent Strength">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={`${DASHBOARD_FONTS.label} w-8`}>Min</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={minRating}
                                        onChange={(e) => setMinRating(e.target.value)}
                                        className="flex-1 bg-[#0A0E18] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`${DASHBOARD_FONTS.label} w-8`}>Max</span>
                                    <input
                                        type="number"
                                        placeholder="3000"
                                        value={maxRating}
                                        onChange={(e) => setMaxRating(e.target.value)}
                                        className="flex-1 bg-[#0A0E18] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </FilterSection>

                        <FilterSection title="Opponent Name">
                            <input
                                type="text"
                                placeholder="Username"
                                value={opponentName}
                                onChange={(e) => setOpponentName(e.target.value)}
                                className="w-full bg-[#0A0E18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600"
                            />
                        </FilterSection>

                        <FilterSection title="Game Limits">
                            <div className="flex flex-col gap-3">
                                <div>
                                    <div className={`${DASHBOARD_FONTS.label} mb-1`}>Minimum Length (Moves)</div>
                                    <input
                                        type="number"
                                        placeholder="e.g. 10"
                                        value={minMoves}
                                        onChange={(e) => setMinMoves(e.target.value)}
                                        className="w-full bg-[#0A0E18] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                                <div>
                                    <div className={`${DASHBOARD_FONTS.label} mb-1`}>Maximum Length (Moves)</div>
                                    <input
                                        type="number"
                                        placeholder="e.g. 150"
                                        value={maxMoves}
                                        onChange={(e) => setMaxMoves(e.target.value)}
                                        className="w-full bg-[#0A0E18] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                                <div>
                                    <div className={`${DASHBOARD_FONTS.label} mb-1`}>Minimum Games Played</div>
                                    <input
                                        type="number"
                                        placeholder="e.g. 5"
                                        value={minGames}
                                        onChange={(e) => setMinGames(e.target.value)}
                                        className="w-full bg-[#0A0E18] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </FilterSection>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-white/10 bg-[#0F1623] flex flex-col gap-3">
                    <Button onClick={onClose} fullWidth themeColor={THEMES.report.color} className="font-bold hover-glow-emerald-strong shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        Apply Filters
                    </Button>
                    <button onClick={() => {
                        setOrder('Most Played');
                        setSide('Both');
                        setSelectedOutcomes([]);
                        setSelectedTerminations([]);
                        setSelectedTimeControls(['Rapid']);
                        setDateRange('All Time');
                        setSelectedSources([]);
                        setEventText('');
                        setRatedStatus('Both');
                        setMinRating('');
                        setMaxRating('');
                        setOpponentName('');
                        setMinMoves('');
                        setMaxMoves('');
                        setMinGames('');
                    }} className={`${DASHBOARD_FONTS.label} hover:text-slate-300 transition-colors w-full text-center py-2`}>
                        Reset Defaults
                    </button>
                </div>
            </aside>
        </>,
        document.body
    );
};

export default FiltersDrawer;
