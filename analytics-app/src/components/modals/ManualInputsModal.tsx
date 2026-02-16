import React, { useState } from 'react';
import { Plus, X, Check, Trash2, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { FONTS } from '../../constants/theme';

interface ManualInputsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    canSkip?: boolean;
    theme: { color: string };
}

interface TimeSlot {
    day: string;
    time: string;
}

const TIMEZONES = [
    { label: "Europe/Kyiv (GMT+2)", value: "Europe/Kyiv" },
    { label: "Europe/Warsaw (GMT+1)", value: "Europe/Warsaw" },
    { label: "Europe/London (GMT+0)", value: "Europe/London" },
    { label: "Europe/Berlin (GMT+1)", value: "Europe/Berlin" },
    { label: "Europe/Paris (GMT+1)", value: "Europe/Paris" },
    { label: "US/Eastern (GMT-5)", value: "US/Eastern" },
    { label: "US/Pacific (GMT-8)", value: "US/Pacific" },
    { label: "US/Central (GMT-6)", value: "US/Central" },
    { label: "Canada/Toronto (GMT-5)", value: "Canada/Toronto" },
    { label: "Australia/Sydney (GMT+11)", value: "Australia/Sydney" },
    { label: "UTC", value: "UTC" }
];

const LANGUAGES = ["English", "Ukrainian", "Polish", "Chinese", "Spanish", "French", "German"];

const ManualInputsModal: React.FC<ManualInputsModalProps> = ({ isOpen, onClose, onSave, canSkip = false, theme }) => {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [coachingType, setCoachingType] = useState<'individual' | 'group'>('individual');

    // Form States
    const [timezone, setTimezone] = useState(TIMEZONES[0].value);
    const [primaryLang, setPrimaryLang] = useState("English");
    const [secondaryLang, setSecondaryLang] = useState("None");
    const [level, setLevel] = useState("Intermediate (800-1200)");

    // Availability
    const [availability, setAvailability] = useState<TimeSlot[]>([
        { day: 'Mon, Wed, Fri', time: '18:00 - 20:00' } // Default example
    ]);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    const [newSlotDay, setNewSlotDay] = useState("Monday");
    const [newSlotTime, setNewSlotTime] = useState("18:00");

    if (!isOpen) return null;

    const toggleGoal = (goal: string) => {
        if (selectedGoals.includes(goal)) {
            setSelectedGoals(selectedGoals.filter(g => g !== goal));
        } else {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };

    const handleAddSlot = () => {
        setAvailability([...availability, { day: newSlotDay, time: newSlotTime }]);
        setIsAddingSlot(false);
    };

    const removeSlot = (index: number) => {
        setAvailability(availability.filter((_, i) => i !== index));
    };

    // Calculate Pricing Display
    const getPricingDisplay = () => {
        if (coachingType === 'group') {
            return (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="text-sm text-slate-400 mb-1">Group Subscription</div>
                    <div className="text-xl font-bold text-white">€99 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                    <div className="text-xs text-slate-500 mt-1">or €990 / yr (Save 17%)</div>
                </div>
            );
        } else {
            return (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <div className="text-sm text-slate-400 mb-1">Standard Rate</div>
                    <div className="text-xl font-bold text-white">€29 <span className="text-xs font-normal text-slate-500">/ lesson</span></div>
                    <div className="text-xs text-slate-500 mt-1">Pay per session (50 min)</div>
                </div>
            );
        }
    };

    const saveProfile = () => {
        // Here we would save to localStorage/Cookie
        const profile = {
            timezone, primaryLang, secondaryLang, level, selectedGoals, availability, coachingType
        };
        localStorage.setItem('wk_coaching_profile', JSON.stringify(profile));
        if (onSave) onSave();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-[800px] max-h-[90vh] bg-[#0F1623] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#080C14]">
                    <div>
                        <h2 className="text-xl font-bold text-white">Coach Matching & Goals</h2>
                        <p className="text-xs text-slate-400">Help us personalize your training plan.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* Section 1: Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={FONTS.label}>Timezone <span className="text-red-400">*</span></label>
                            <select
                                value={timezone} onChange={e => setTimezone(e.target.value)}
                                className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                            >
                                {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={FONTS.label}>Primary Language <span className="text-red-400">*</span></label>
                            <select
                                value={primaryLang} onChange={e => { setPrimaryLang(e.target.value); if (secondaryLang === e.target.value) setSecondaryLang('None'); }}
                                className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                            >
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={FONTS.label}>Current Level <span className="text-red-400">*</span></label>
                            <select
                                value={level} onChange={e => setLevel(e.target.value)}
                                className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                            >
                                <option>Beginner (&lt;800)</option>
                                <option>Intermediate (800-1200)</option>
                                <option>Club Player (1200-1600)</option>
                                <option>Advanced (1600-2000)</option>
                                <option>Expert (2000+)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={FONTS.label}>Secondary Language (Optional)</label>
                            <select
                                value={secondaryLang} onChange={e => setSecondaryLang(e.target.value)}
                                className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                            >
                                <option>None</option>
                                {LANGUAGES.filter(l => l !== primaryLang).map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Section 2: Goals */}
                    <div>
                        <label className={FONTS.label}>Training Goals <span className="text-red-400">*</span></label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {['Improve Tactics', 'Opening Repertoire', 'Endgame Mastery', 'Tournament Prep', 'Chess960', 'Psychology', 'Other'].map(goal => (
                                <div
                                    key={goal}
                                    onClick={() => toggleGoal(goal)}
                                    className={`px-3 py-1.5 rounded-full text-sm border cursor-pointer transition-colors flex items-center gap-2 ${selectedGoals.includes(goal) ? `bg-[${theme.color}]/20 border-[${theme.color}] text-white` : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                    style={selectedGoals.includes(goal) ? { borderColor: theme.color, backgroundColor: `${theme.color}33` } : {}}
                                >
                                    {selectedGoals.includes(goal) && <Check size={12} />}
                                    {goal}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Availability & Coaching */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={FONTS.label}>Weekly Availability</label>
                            <div className="bg-[#080C14] border border-white/10 rounded-lg p-4 space-y-2 min-h-[140px]">
                                {availability.map((slot, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm text-slate-300 bg-white/5 p-2 rounded group">
                                        <div className="flex gap-2 items-center">
                                            <Clock size={14} className="text-slate-500" />
                                            <span>{slot.day}</span>
                                            <span className="text-slate-500">|</span>
                                            <span>{slot.time}</span>
                                        </div>
                                        <button onClick={() => removeSlot(idx)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                    </div>
                                ))}

                                {isAddingSlot ? (
                                    <div className="bg-white/5 p-2 rounded border border-white/10 animate-in fade-in">
                                        <select className="w-full bg-[#0F1623] text-xs text-white p-1 rounded mb-2 border border-white/10" value={newSlotDay} onChange={e => setNewSlotDay(e.target.value)}>
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d}>{d}</option>)}
                                        </select>
                                        <input type="time" className="w-full bg-[#0F1623] text-xs text-white p-1 rounded mb-2 border border-white/10" value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} />
                                        <div className="flex gap-2">
                                            <Button size="sm" fullWidth onClick={handleAddSlot}>Add</Button>
                                            <Button size="sm" variant="secondary" fullWidth onClick={() => setIsAddingSlot(false)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div onClick={() => setIsAddingSlot(true)} className="border border-dashed border-white/10 rounded-lg p-2 flex items-center justify-center text-slate-500 text-xs cursor-pointer hover:bg-white/5 transition-colors">
                                        <Plus size={14} className="mr-1" /> Add time slot
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={FONTS.label}>Coaching Preference</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${coachingType === 'group' ? 'border-violet-500' : 'border-slate-500'}`}>
                                            {coachingType === 'group' && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                                        </div>
                                        <input type="radio" className="hidden" checked={coachingType === 'group'} onChange={() => setCoachingType('group')} />
                                        Group (Max 4)
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${coachingType === 'individual' ? 'border-violet-500' : 'border-slate-500'}`}>
                                            {coachingType === 'individual' && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                                        </div>
                                        <input type="radio" className="hidden" checked={coachingType === 'individual'} onChange={() => setCoachingType('individual')} />
                                        Individual
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className={FONTS.label + " mb-2 block"}>Estimated Price</label>
                                {getPricingDisplay()}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Consent */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" className="mt-1 accent-violet-500 w-4 h-4 rounded border-white/20 bg-white/5" defaultChecked />
                            <span className="text-sm text-slate-400 group-hover:text-slate-300">
                                Allow detailed engine analysis of my games <span className="text-red-400">*</span>
                                <span className="block text-xs text-slate-500 mt-0.5">Required to generate reports and training plans.</span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-[#080C14] flex justify-end gap-3">
                    {canSkip && <Button variant="secondary" onClick={onClose}>Skip for now</Button>}
                    {!canSkip && <Button variant="secondary" onClick={onClose}>Cancel</Button>}
                    <Button themeColor={theme.color} onClick={saveProfile}>Save Profile</Button>
                </div>
            </div>
        </div>
    );
};
export default ManualInputsModal;
