import React, { useState, useRef } from 'react';
import {
    Upload, Users, CheckCircle, HelpCircle, Activity,
    Calendar, Trophy, BookOpen, Target, ArrowLeft, Globe, Edit2,
    Check
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ChessComLogo, LichessLogo, MasterDBLogo } from '../ui/Logos';
import { FONTS, DASHBOARD_FONTS } from '../../constants/theme';
import { TIMEZONES } from '../coaching/TimeZoneUtils';

interface OnboardingWizardProps {
    isOpen: boolean;
    onClose: () => void;
    connections: { chessCom: boolean; lichess: boolean; masterDb: boolean };
    toggleConnection: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    setDemoMode: (mode: boolean) => void;
    isDemoMode: boolean;
    setActiveModal: (key: 'chessCom' | 'lichess' | 'masterDb' | null) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose, connections, toggleConnection, setDemoMode, isDemoMode, setActiveModal }) => {
    if (!isOpen) return null;

    const [step, setStep] = useState(1);
    const [path, setPath] = useState<'connect' | 'new' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Removed local activeModal/usernameInput logic

    // Beginner Step State
    const [ageGroup, setAgeGroup] = useState<'adult' | 'child' | null>('adult');
    const [knowsPieces, setKnowsPieces] = useState<boolean | null>(null);

    // Step 3 Preferences
    const [preferences, setPreferences] = useState<{
        level: string | null;
        goals: string[];
        timezone: string;
        primaryLang: string;
        secondaryLang: string;
        coachingType: 'individual' | 'group';
        studentAge: string;
        allowAnalysis: boolean;
    }>({
        level: null,
        goals: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Warsaw',
        primaryLang: 'English',
        secondaryLang: 'None',
        coachingType: 'group',
        studentAge: '',
        allowAnalysis: true,
    });



    // Imported TIMEZONES from TimeZoneUtils

    const LANGUAGES = ["English", "Ukrainian", "Polish", "Chinese", "Spanish", "French", "German"];

    const toggleGoal = (goal: string) => {
        if (preferences.goals.includes(goal)) {
            setPreferences({ ...preferences, goals: preferences.goals.filter(g => g !== goal) });
        } else {
            setPreferences({ ...preferences, goals: [...preferences.goals, goal] });
        }
    };



    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    const goToStep = (s: number) => setStep(s);
    const skip = () => onClose();

    const switchPath = () => {
        if (path === 'connect') {
            setPath('new');
            setStep(2);
        } else {
            setPath('connect');
            setStep(2);
        }
    };

    // handleConnect is now passed as a prop
    // const handleConnect = (key: 'chessCom' | 'lichess' | 'masterDb') => {
    //     setTimeout(() => {
    //         toggleConnection(key);
    //         setActiveModal(null);
    //         setUsernameInput('');
    //     }, 800);
    // };

    // --- SUMMARY PANEL ---
    const renderSummaryPanel = () => {
        const stepsData = [
            { id: 1, label: "Path Selection", status: path ? 'done' : 'pending', val: path === 'new' ? 'Beginner' : path === 'connect' ? 'Data Import' : '-' },
            { id: 2, label: "Data & Profile", status: (path === 'connect' && Object.values(connections).some(Boolean)) || (path === 'new' && knowsPieces !== null) ? 'done' : 'pending', val: path === 'connect' ? `${Object.values(connections).filter(Boolean).length} Connected` : path === 'new' ? (knowsPieces ? 'Knows Pieces' : 'Learning') : '-' },
            { id: 3, label: "Coaching Preferences", status: preferences.goals.length > 0 ? 'done' : 'pending', val: preferences.level },
            { id: 4, label: "Review", status: step === 4 ? 'done' : 'pending', val: '-' }
        ];

        return (
            <div className="w-[300px] border-l border-white/5 bg-[#0F1420]/50 p-6 flex flex-col gap-6">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Your Progress</h3>
                    <div className="space-y-4">
                        {stepsData.map((s) => (
                            <div key={s.id} className={`relative pl-4 border-l-2 transition-colors ${step === s.id ? 'border-violet-500' : s.status === 'done' ? 'border-emerald-500' : 'border-slate-700'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className={`text-xs font-bold mb-0.5 ${step === s.id ? 'text-white' : 'text-slate-400'}`}>{s.label}</div>
                                        <div className="text-[10px] text-slate-500">{s.val}</div>
                                    </div>
                                    {s.status === 'done' && step !== s.id && (
                                        <button onClick={() => goToStep(s.id)} className="text-slate-600 hover:text-violet-400 transition-colors"><Edit2 size={10} /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy size={14} className="text-violet-400" />
                        <span className="text-xs font-bold text-white">Unlock Full Report</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Complete all steps to get your personalized coaching plan and analysis.</p>
                </div>
            </div>
        );
    };

    // --- STEPS ---
    const renderStep1 = () => (
        <div className="max-w-xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 pt-12">
            <h2 className={FONTS.h1 + " mb-2"}>Welcome to Chess Analytics</h2>
            <p className={FONTS.body + " mb-8"}>Connect your games from Chess.com, Lichess, Masters Database, or upload PGN.</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="hover:border-violet-500/50 cursor-pointer group text-left h-full flex flex-col justify-between" onClick={() => { setPath('connect'); nextStep(); }}>
                    <div>
                        <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform"><Globe size={24} /></div>
                        <h3 className="text-xl font-bold text-white mb-2">Connect my games</h3>
                        <p className="text-sm text-slate-400">Import your history to get a personalized coaching plan.</p>
                    </div>
                    <Button fullWidth themeColor="#8B5CF6" className="mt-6">Continue</Button>
                </Card>
                <Card className="hover:border-emerald-500/50 cursor-pointer group text-left h-full flex flex-col justify-between" onClick={() => { setPath('new'); nextStep(); }}>
                    <div>
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
                        <h3 className="text-xl font-bold text-white mb-2">I'm new to chess</h3>
                        <p className="text-sm text-slate-400">Start from zero. We'll match you into beginner groups.</p>
                    </div>
                    <Button fullWidth variant="secondary" className="mt-6 hover:text-emerald-400 hover:border-emerald-500/30">Start Beginner Path</Button>
                </Card>
            </div>

            <div className="flex justify-center gap-6 text-sm">
                <button onClick={skip} className="text-slate-500 hover:text-slate-300 transition-colors">Skip for now</button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 relative pt-8">
            <div className="text-center mb-8">
                <h2 className={FONTS.h1 + " mb-2"}>{path === 'new' ? "Let's get to know you" : "Connect your chess data"}</h2>
                <p className={FONTS.body}>{path === 'new' ? "Review the basics before joining a group." : "We only read your games and basic stats. You can disconnect anytime."}</p>
            </div>

            {path === 'new' ? (
                // Beginner Path Step 2
                <div className="max-w-lg mx-auto space-y-6">
                    <Card>
                        <h3 className="text-white font-bold mb-4">Quick Check</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs text-slate-400 mb-2">Age Group</label>
                                <div className="flex gap-4 text-sm text-white">
                                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${ageGroup === 'child' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                        <input type="radio" name="age" className="hidden" checked={ageGroup === 'child'} onChange={() => setAgeGroup('child')} />
                                        Teen / Child (Under 18)
                                    </label>
                                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${ageGroup === 'adult' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                        <input type="radio" name="age" className="hidden" checked={ageGroup === 'adult'} onChange={() => setAgeGroup('adult')} />
                                        Adult (18+)
                                    </label>
                                </div>
                                {ageGroup === 'child' && (
                                    <div className="mt-2 text-[10px] text-slate-500 bg-white/5 p-2 rounded flex gap-2 items-start">
                                        <div className="mt-0.5 text-emerald-500">•</div>
                                        Requires parental consent for account creation (EU Regulations).
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Time Zone (Required)</label>
                                <select className="w-full bg-[#080C14] border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none">
                                    <option>CET (Berlin/Paris)</option>
                                    <option>EST (New York)</option>
                                    <option>PST (Los Angeles)</option>
                                    <option>UTC (London)</option>
                                    <option>IST (India)</option>
                                    <option>CST (China)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                <HelpCircle size={20} className="text-emerald-500" />
                                <div>
                                    <div className="text-white font-bold text-sm mb-2">Do you know how pieces move?</div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setKnowsPieces(true)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${knowsPieces === true ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}>Yes</button>
                                        <button onClick={() => setKnowsPieces(false)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${knowsPieces === false ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}>No, teach me</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="flex justify-between items-center mt-8">
                        <button onClick={() => { setPath('connect'); setStep(2); }} className="px-4 py-2 rounded hover:bg-white/5 text-slate-500 hover:text-white text-sm transition-colors">Wait, connect my games instead</button>
                        <Button themeColor="#10B981" onClick={() => window.location.href = '/dashboard/coaching/enroll'}>Find Beginner Groups</Button>
                    </div>
                </div>
            ) : (
                // Connect Data Path Step 2
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Chess.com */}
                        <Card className={`relative text-center p-4 cursor-pointer transition-all ${connections.chessCom ? 'border-emerald-500/50 bg-emerald-500/5' : 'hover:border-white/20'}`} onClick={() => !connections.chessCom && setActiveModal('chessCom')}>
                            <div className="w-12 h-12 bg-[#7FA650] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <ChessComLogo size={24} className="text-white" variant="glyph" />
                            </div>
                            <h3 className="text-white font-bold text-sm mb-1">Chess.com</h3>
                            {connections.chessCom ? (
                                <div className="mt-2">
                                    <div className="text-emerald-400 text-[10px] font-bold flex justify-center items-end gap-1 mb-2"><CheckCircle size={10} /> Connected</div>
                                    <Button size="xs" variant="secondary" fullWidth onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleConnection('chessCom'); }}>Disconnect</Button>
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-400 mt-1">Connect Account</p>
                            )}
                        </Card>

                        {/* Lichess */}
                        <Card className={`relative text-center p-4 cursor-pointer transition-all ${connections.lichess ? 'border-emerald-500/50 bg-emerald-500/5' : 'hover:border-white/20'}`} onClick={() => !connections.lichess && setActiveModal('lichess')}>
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg overflow-hidden text-black">
                                <LichessLogo size={24} variant="glyph" />
                            </div>
                            <h3 className="text-white font-bold text-sm mb-1">Lichess</h3>
                            {connections.lichess ? (
                                <div className="mt-2">
                                    <div className="text-emerald-400 text-[10px] font-bold flex justify-center items-end gap-1 mb-2"><CheckCircle size={10} /> Connected</div>
                                    <Button size="xs" variant="secondary" fullWidth onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleConnection('lichess'); }}>Disconnect</Button>
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-400 mt-1">OAuth Login</p>
                            )}
                        </Card>

                        {/* PGN Upload */}
                        <Card className="text-center p-4 hover:border-white/20 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-300 mx-auto mb-3 border border-white/10 group-hover:scale-110 transition-transform"><Upload size={20} /></div>
                            <h3 className="text-white font-bold text-sm mb-1">Upload PGN</h3>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".pgn" onChange={() => setDemoMode(true)} />
                            <p className="text-[10px] text-slate-400 mt-1">From File</p>
                        </Card>

                        {/* Master DB — In Development */}
                        <Card className="relative text-center p-4 opacity-60 border-dashed border-white/10">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                                <MasterDBLogo size={20} variant="glyph" />
                            </div>
                            <h3 className="text-white font-bold text-sm mb-1">Masters DB</h3>
                            <p className="text-[9px] text-slate-500 mt-1 leading-tight">In Development</p>
                        </Card>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3 text-xs text-blue-200">
                        <Activity size={14} className="mt-0.5 flex-shrink-0" />
                        <ul className="list-disc list-inside space-y-1">
                            <li>Minimum report: ~10 games (basic insights).</li>
                            <li>Recommended: 30+ games (reliable patterns).</li>
                        </ul>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <div className="space-x-4 text-sm flex items-center">
                            <button onClick={() => { setPath('new'); setStep(2); }} className="text-slate-500 hover:text-emerald-400 underline decoration-slate-700 underline-offset-4">I'm new to chess</button>
                            <div className="h-4 w-px bg-white/10"></div>
                            <button onClick={nextStep} className="text-slate-500 hover:text-white transition-colors">Connect later</button>
                        </div>

                        <div title={!Object.values(connections).some(Boolean) ? "Please connect at least one source" : ""}>
                            <Button themeColor="#8B5CF6" onClick={nextStep} disabled={!Object.values(connections).some(Boolean)}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals removed from here - rendered in App.tsx */}
        </div>
    );

    const renderStep3 = () => (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 pt-4">
            <div className="text-center mb-6">
                <h2 className={FONTS.h1 + " mb-2"}>Match with the right coach</h2>
                <p className={FONTS.body}>Help us personalize your training plan.</p>
            </div>

            <Card className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Student Age <span className="text-red-400">*</span></label>
                        <input
                            type="number"
                            value={preferences.studentAge} onChange={e => setPreferences({ ...preferences, studentAge: e.target.value })}
                            placeholder="Enter age"
                            className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Timezone <span className="text-red-400">*</span></label>
                        <select
                            value={preferences.timezone} onChange={e => setPreferences({ ...preferences, timezone: e.target.value })}
                            className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                        >
                            {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Language <span className="text-red-400">*</span></label>
                        <select
                            value={preferences.primaryLang} onChange={e => {
                                const newLang = e.target.value;
                                setPreferences({ ...preferences, primaryLang: newLang, secondaryLang: preferences.secondaryLang === newLang ? 'None' : preferences.secondaryLang });
                            }}
                            className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                        >
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Current Level <span className="text-red-400">*</span></label>
                        <select
                            value={preferences.level || ''} onChange={e => setPreferences({ ...preferences, level: e.target.value })}
                            className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                        >
                            <option value="" disabled>Select Level</option>
                            <option>Beginner (&lt;800)</option>
                            <option>Intermediate (800-1200)</option>
                            <option>Club Player (1200-1600)</option>
                            <option>Advanced (1600-2000)</option>
                            <option>Expert (2000+)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Secondary Language (Optional)</label>
                        <select
                            value={preferences.secondaryLang} onChange={e => setPreferences({ ...preferences, secondaryLang: e.target.value })}
                            className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
                        >
                            <option>None</option>
                            {LANGUAGES.filter(l => l !== preferences.primaryLang).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Platforms</label>
                        <div className="flex gap-2">
                            <button onClick={() => connections?.chessCom ? toggleConnection('chessCom') : setActiveModal('chessCom')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${connections?.chessCom ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                <div className={`w-2 h-2 rounded-full ${connections?.chessCom ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                {connections?.chessCom ? 'Connected' : 'Chess.com'}
                            </button>
                            <button onClick={() => connections?.lichess ? toggleConnection('lichess') : setActiveModal('lichess')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${connections?.lichess ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                <div className={`w-2 h-2 rounded-full ${connections?.lichess ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                {connections?.lichess ? 'Connected' : 'Lichess'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 2: Goals */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Training Goals</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {['How the Pieces Move', 'Improve Tactics', 'Opening Repertoire', 'Endgame Mastery', 'Tournament Prep', 'Chess960', 'Psychology', 'Other'].map(goal => (
                            <div
                                key={goal}
                                onClick={() => toggleGoal(goal)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors flex items-center gap-2 ${preferences.goals.includes(goal) ? 'bg-violet-500/20 border-violet-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                            >
                                {preferences.goals.includes(goal) && <Check size={12} className="text-violet-500" />}
                                {goal}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Coaching Preference */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Coaching Preference</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${preferences.coachingType === 'group' ? 'border-violet-500' : 'border-slate-500'}`}>
                                        {preferences.coachingType === 'group' && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                                    </div>
                                    <input type="radio" className="hidden" checked={preferences.coachingType === 'group'} onChange={() => setPreferences({ ...preferences, coachingType: 'group' })} />
                                    Group (Max 4)
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${preferences.coachingType === 'individual' ? 'border-violet-500' : 'border-slate-500'}`}>
                                        {preferences.coachingType === 'individual' && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                                    </div>
                                    <input type="radio" className="hidden" checked={preferences.coachingType === 'individual'} onChange={() => setPreferences({ ...preferences, coachingType: 'individual' })} />
                                    Individual
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Consent */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" className="mt-1 accent-violet-500 w-4 h-4 rounded border-white/20 bg-white/5" checked={preferences.allowAnalysis} onChange={e => setPreferences({ ...preferences, allowAnalysis: e.target.checked })} />
                        <span className="text-sm text-slate-400 group-hover:text-slate-300">
                            Allow detailed engine analysis of my games <span className="text-red-400">*</span>
                            <span className="block text-xs text-slate-500 mt-0.5">Required to generate reports and training plans.</span>
                        </span>
                    </label>
                </div>
            </Card>

            <div className="flex justify-between items-center mt-6">
                <button onClick={nextStep} className="text-slate-500 hover:text-white text-sm underline decoration-slate-700 underline-offset-4">Fill later</button>
                <div className="flex items-center gap-4">
                    <button onClick={switchPath} className="text-slate-500 hover:text-white text-sm">Switch to {path === 'connect' ? 'Beginner' : 'Connect'} path</button>
                    <div title={!preferences.level ? "Please select your skill level" : ""}>
                        <Button themeColor="#8B5CF6" onClick={() => {
                            // Save profile to localStorage
                            localStorage.setItem('wk_coaching_profile', JSON.stringify({
                                level: preferences.level,
                                studentAge: preferences.studentAge,
                                coachingType: preferences.coachingType,
                                primaryLang: preferences.primaryLang,
                                timezone: preferences.timezone,
                                selectedGoals: preferences.goals
                            }));
                            // Save wizard seen
                            localStorage.setItem('wk_analytics_wizard_seen', 'true');
                            // Trigger storage event manually so other components catch it in the same window
                            window.dispatchEvent(new Event('storage'));
                            nextStep();
                        }} disabled={!preferences.level || !preferences.studentAge || !preferences.allowAnalysis}>Generate Report</Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => {
        const hasData = isDemoMode || Object.values(connections).some(Boolean);
        const hasPreferences = !!preferences.level;

        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 relative pt-10">
                <button onClick={prevStep} className="absolute top-0 left-0 text-slate-500 hover:text-white flex items-center gap-1 text-sm"><ArrowLeft size={16} /> Edit Answers</button>

                <div className="text-center mb-10 mt-6">
                    <h2 className={FONTS.h1 + " mb-2"}>{hasData ? "Your first report is ready" : "Your personalized path awaits"}</h2>
                    {hasData && (
                        <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-fit mx-auto text-xs font-bold border border-emerald-500/20">
                            <CheckCircle size={12} /> Analysis Complete
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-6 mb-10">
                    {/* Top Issue */}
                    {hasData ? (
                        <Card className="border-red-500/30 bg-red-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Activity size={64} className="text-red-500" /></div>
                            <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Top Issue Identified</div>
                            <h3 className="text-2xl font-bold text-white mb-2">{path === 'new' ? "Board Vision" : "Time Management"}</h3>
                            <Badge type="high" label="Critical" />
                            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                                {path === 'new' ? "You miss hanging pieces frequently." : "You spend 40% of time on moves 1-10, leading to panic later."}
                            </p>
                        </Card>
                    ) : (
                        <Card className="border-white/5 bg-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center p-6 border-dashed">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4"><Activity size={24} className="text-slate-500" /></div>
                            <h3 className="text-lg font-bold text-white mb-2">No Analysis Yet</h3>
                            <p className="text-xs text-slate-400 mb-4">Connect your accounts to spot your #1 weakness.</p>
                            <Button size="sm" variant="secondary" onClick={() => { setPath('connect'); goToStep(2); }}>Connect Data</Button>
                        </Card>
                    )}

                    {/* What to do - Always shown as per request */}
                    <Card className="border-amber-500/30 bg-amber-500/5 relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Target size={64} className="text-amber-500" /></div>
                            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Action Plan</div>
                            <h3 className="text-xl font-bold text-white mb-4">Coach-Led Workshop</h3>
                            <div className="bg-black/20 rounded p-3 mb-2">
                                <div className="text-sm font-bold text-white mb-1"><Calendar size={14} className="inline mr-1" /> Sat, 14:00</div>
                                <div className="text-xs text-slate-300">Topic: Beginner Class</div>
                            </div>
                        </div>
                        <Button size="sm" themeColor="#F59E0B" fullWidth variant="secondary" onClick={() => {
                            onClose();
                            window.location.href = '/dashboard/coaching/enroll';
                        }}>Book Session</Button>
                    </Card>

                    {/* Recommended Group */}
                    {hasPreferences ? (
                        <Card className="border-violet-500/30 bg-violet-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Users size={64} className="text-violet-500" /></div>
                            <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">Best Batch</div>
                            <h3 className="text-xl font-bold text-white mb-4">{path === 'new' ? "Beginner Group B" : "Intermediate Group A"}</h3>
                            <ul className="space-y-2 text-xs text-slate-400 mb-4">
                                <li className="flex items-center gap-2"><CheckCircle size={10} className="text-emerald-500" /> {path === 'new' ? "Rules & Pieces 101" : "Similiar Rating (1200-1300)"}</li>
                                <li className="flex items-center gap-2"><CheckCircle size={10} className="text-emerald-500" /> English Speaking</li>
                                <li className="flex items-center gap-2"><CheckCircle size={10} className="text-emerald-500" /> 2 Seats Left</li>
                            </ul>
                            <Button size="sm" themeColor="#8B5CF6" fullWidth onClick={() => {
                                onClose();
                                window.location.href = '/dashboard/coaching/enroll';
                            }}>Join Batch</Button>
                        </Card>
                    ) : (
                        <Card className="border-white/5 bg-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center p-6 border-dashed">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4"><Users size={24} className="text-slate-500" /></div>
                            <h3 className="text-lg font-bold text-white mb-2">Find Your Group</h3>
                            <p className="text-xs text-slate-400 mb-4">Tell us your level and goals to get matched.</p>
                            <Button size="sm" variant="secondary" onClick={() => goToStep(3)}>Set Preferences</Button>
                        </Card>
                    )}
                </div>

                <div className="flex justify-center gap-6">
                    <Button size="lg" themeColor={path === 'new' ? "#10B981" : "#8B5CF6"} onClick={() => {
                        onClose();
                        window.location.href = '/dashboard/coaching/enroll';
                    }} icon={Users}>
                        Find a Group Coach Now
                    </Button>
                    <Button size="lg" variant="secondary" onClick={() => {
                        onClose();
                        window.location.href = '/dashboard';
                    }}>
                        Explore Dashboard
                    </Button>
                </div>
                {!hasData && (
                    <button onClick={() => { setStep(2); setPath('connect'); }} className="block mx-auto mt-6 text-xs text-slate-500 hover:text-white pb-8">Connect more data sources</button>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#080C14] grid grid-cols-[1fr_300px] animate-in fade-in duration-300" >
            {/* LEFT COLUMN: Main Content */}
            < div className="flex flex-col h-full overflow-hidden relative" >
                {/* Header */}
                < div className="p-8 flex justify-between items-center w-full absolute top-0 left-0 bg-[#080C14]/90 backdrop-blur-sm z-10" >
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Chess Analytics" className="w-8 h-8 block" />
                        <span className={DASHBOARD_FONTS.logo}>Chess Analytics</span>
                    </div>

                    {/* Progress Bar (Clickable) */}
                    <div className="flex items-center gap-2" >
                        {
                            [1, 2, 3, 4].map(i => (
                                <button
                                    key={i}
                                    onClick={() => i < step ? goToStep(i) : null}
                                    disabled={i > step}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? (path === 'new' ? 'bg-emerald-500 w-8' : 'bg-violet-500 w-8') : 'bg-white/10 w-4'} ${i < step ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                                />
                            ))
                        }
                    </div >
                </div >

                {/* Content Area */}
                < div className="flex-1 flex flex-col justify-center py-20 px-4" >
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </div >
            </div >

            {/* RIGHT COLUMN: Summary Panel */}
            {renderSummaryPanel()}
        </div >
    );
};

export default OnboardingWizard;
