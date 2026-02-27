import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../ui/Button';

interface FiltersDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ORDER_OPTIONS = ['Most Played', 'Best', 'Worst'];
const SIDE_OPTIONS = ['Both', 'White', 'Black'];
const TIME_CONTROLS = ['Bullet', 'Blitz', 'Rapid', 'Classical', 'Correspondence', 'Unknown'];
const OUTCOMES = ['Win', 'Draw', 'Loss'];
const TERMINATIONS = ['Resign', 'Mate', 'Clock Flag', 'Abandoned', 'Draw Agreed', 'Stalemate', 'Insufficient Material', 'Threefold Repetition', 'Fifty-move Rule', 'Timeout (vs Insufficient Material)'];

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

// Simple flat link helper
const FilterLink: React.FC<{ title: string; onClick?: () => void }> = ({ title, onClick }) => (
    <div className="border border-white/10 rounded-lg overflow-hidden mb-2 bg-[#080C14]">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-3 text-sm text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10"
        >
            {title}
        </button>
    </div>
);

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({ isOpen, onClose }) => {
    const [order, setOrder] = useState('Most Played');
    const [side, setSide] = useState('Both');
    const [selectedTimeControls, setSelectedTimeControls] = useState<string[]>(['Rapid']);
    const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
    const [selectedTerminations, setSelectedTerminations] = useState<string[]>([]);

    const toggleArrayItem = (item: string, state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (state.includes(item)) setter(state.filter(i => i !== item));
        else setter([...state, item]);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`w-[320px] bg-[#0B1220] border-l border-white/10 flex flex-col fixed inset-y-0 right-0 z-[70] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0F1623]">
                    <h2 className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
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
                        <div className="text-xs tracking-widest text-slate-400 font-bold mb-3 uppercase">Order</div>
                        <div className="flex rounded-lg overflow-hidden border border-white/10">
                            {ORDER_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setOrder(opt)}
                                    className={`flex-1 py-1.5 text-[11px] xl:text-xs font-bold transition-colors ${order === opt ? 'bg-violet-600/30 text-violet-300' : 'bg-[#080C14] text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Block Header */}
                    <div>
                        <div className="text-xs tracking-widest text-slate-400 font-bold mb-3 uppercase">Filter</div>

                        <div className="flex rounded-lg overflow-hidden border border-white/10 mb-3">
                            {SIDE_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSide(opt)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] xl:text-xs font-bold transition-colors ${side === opt ? 'bg-violet-600/30 text-violet-300' : 'bg-[#080C14] text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {opt === 'White' && '♟ '}
                                    {opt === 'Black' && '♟ '}
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
                                        className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500"
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
                                        className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500"
                                    />
                                    {out}
                                </label>
                            ))}
                        </FilterSection>

                        <FilterSection title="Termination">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 mt-1 border-b border-white/5 pb-1">Win/Loss</div>
                            {TERMINATIONS.slice(0, 4).map(term => (
                                <label key={term} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedTerminations.includes(term)}
                                        onChange={() => toggleArrayItem(term, selectedTerminations, setSelectedTerminations)}
                                        className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500"
                                    />
                                    {term}
                                </label>
                            ))}
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 mt-3 border-b border-white/5 pb-1">Draw</div>
                            {TERMINATIONS.slice(4).map(term => (
                                <label key={term} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white px-2 py-1 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedTerminations.includes(term)}
                                        onChange={() => toggleArrayItem(term, selectedTerminations, setSelectedTerminations)}
                                        className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500"
                                    />
                                    {term}
                                </label>
                            ))}
                        </FilterSection>

                        <FilterLink title="Date" />
                        <FilterLink title="Source" />
                        <FilterLink title="Event" />
                        <FilterLink title="Rated + Unrated" />
                        <FilterLink title="Opponent Strength" />
                        <FilterLink title="Opponent Name" />
                        <FilterLink title="Min. Moves" />
                        <FilterLink title="Max. Moves" />
                        <FilterLink title="Min. Games" />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-white/10 bg-[#0F1623] flex flex-col gap-3">
                    <Button onClick={onClose} fullWidth themeColor="violet" className="font-bold hover-glow-violet-strong shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        Apply Filters
                    </Button>
                    <button onClick={() => {
                        setOrder('Most Played');
                        setSide('Both');
                        setSelectedOutcomes([]);
                        setSelectedTerminations([]);
                        setSelectedTimeControls(['Rapid']);
                    }} className="text-[11px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors w-full text-center py-2">
                        Reset Defaults
                    </button>
                </div>
            </aside>
        </>
    );
};

export default FiltersDrawer;
