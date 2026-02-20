import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import Button from '../ui/Button';
import { FONTS } from '../../constants/theme';
import { TIMEZONES } from '../coaching/TimeZoneUtils';

interface ManualInputsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    canSkip?: boolean;
    theme: { color: string };
    connections?: { chessCom: boolean; lichess: boolean; masterDb: boolean };
    openConnectModal?: (platform: 'chessCom' | 'lichess' | 'masterDb') => void;
    disconnectPlatform?: (platform: 'chessCom' | 'lichess' | 'masterDb') => void;
}


// TIMEZONES imported from TimeZoneUtils

const LANGUAGES = ["English", "Ukrainian", "Polish", "Chinese", "Spanish", "French", "German"];

const ManualInputsModal: React.FC<ManualInputsModalProps> = ({ isOpen, onClose, onSave, canSkip = false, theme, connections, openConnectModal, disconnectPlatform }) => {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [coachingType, setCoachingType] = useState<'individual' | 'group'>('group');

    // Form States
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Warsaw');
    const [primaryLang, setPrimaryLang] = useState("English");
    const [secondaryLang, setSecondaryLang] = useState("None");
    const [level, setLevel] = useState("Intermediate (800-1200)");
    const [studentAge, setStudentAge] = useState('');



    // Load existing profile when modal opens
    React.useEffect(() => {
        if (isOpen) {
            try {
                const raw = localStorage.getItem('wk_coaching_profile');
                if (raw) {
                    const profile = JSON.parse(raw);
                    if (profile.selectedGoals) setSelectedGoals(profile.selectedGoals);
                    if (profile.coachingType) setCoachingType(profile.coachingType);
                    if (profile.timezone) setTimezone(profile.timezone);
                    if (profile.primaryLang) setPrimaryLang(profile.primaryLang);
                    if (profile.secondaryLang) setSecondaryLang(profile.secondaryLang);
                    if (profile.level) setLevel(profile.level);
                    if (profile.studentAge) setStudentAge(profile.studentAge);
                }
            } catch (e) {
                console.error("Error loading coaching profile:", e);
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleGoal = (goal: string) => {
        if (selectedGoals.includes(goal)) {
            setSelectedGoals(selectedGoals.filter(g => g !== goal));
        } else {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };


    const saveProfile = () => {
        // Here we would save to localStorage/Cookie
        const profile = {
            timezone, primaryLang, secondaryLang, level, selectedGoals, coachingType, studentAge,
            chessComLinked: connections?.chessCom || false,
            lichessLinked: connections?.lichess || false
        };
        localStorage.setItem('wk_coaching_profile', JSON.stringify(profile));
        if (onSave) onSave();
        onClose();
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
                            <label className={FONTS.label}>Student Age <span className="text-red-400">*</span></label>
                            <input
                                type="number"
                                value={studentAge} onChange={e => setStudentAge(e.target.value)}
                                placeholder="Enter age"
                                className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                            />
                        </div>
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
                        <div className="space-y-2">
                            <label className={FONTS.label}>Connect Platforms</label>
                            <div className="flex gap-2">
                                <button onClick={() => connections?.chessCom ? disconnectPlatform?.('chessCom') : openConnectModal?.('chessCom')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${connections?.chessCom ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                    <div className={`w-2 h-2 rounded-full ${connections?.chessCom ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                    {connections?.chessCom ? 'Connected' : 'Chess.com'}
                                </button>
                                <button onClick={() => connections?.lichess ? disconnectPlatform?.('lichess') : openConnectModal?.('lichess')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${connections?.lichess ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                    <div className={`w-2 h-2 rounded-full ${connections?.lichess ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                    {connections?.lichess ? 'Connected' : 'Lichess'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Goals */}
                    <div>
                        <label className={FONTS.label}>Training Goals</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {['How the Pieces Move', 'Improve Tactics', 'Opening Repertoire', 'Endgame Mastery', 'Tournament Prep', 'Chess960', 'Psychology', 'Other'].map(goal => (
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

                    {/* Section 3: Coaching */}
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
