import React, { useRef } from 'react';
import {
    BookOpen, Calendar, User, Video, MessageSquare, Mail, FileText, HeartPulse, Users, ListChecks, HelpCircle, ArrowUpRight, Lock, Target, Brain
} from 'lucide-react';
import { ChessComLogo, LichessLogo, MasterDBLogo } from '../ui/Logos';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { DASHBOARD_FONTS } from '../../constants/theme';
import ReportDashboard from '../report/ReportDashboard';

interface CenterColumnProps {
    connections: { chessCom: boolean; lichess: boolean; masterDb: boolean };
    toggleConnection: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    theme: { color: string };
    activeTab: string;
    onUpgradeClick: () => void;
    isDemoMode: boolean;
    openManualInputs: (canSkip?: boolean) => void;
    onNavigate: (tab: string) => void;
    openModal: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    onJoinCoaching: () => void;
    isMatchSettingsSet: boolean;
    onOpenBooking: () => void;
    onReportActiveSliceChange?: (sliceId: string | null) => void;
    onReportWidgetHint?: (hintKey: string | null, data?: any) => void;
}

export interface UserProfile {
    level: string;
    studentAge: string;
    coachingType: string;
    primaryLang: string;
    timezone: string;
    selectedGoals?: string[];
}

const CenterColumn: React.FC<CenterColumnProps> = ({ connections, toggleConnection, theme, activeTab, onUpgradeClick, isDemoMode, openManualInputs, onNavigate, openModal, onJoinCoaching, isMatchSettingsSet, onOpenBooking, onReportActiveSliceChange, onReportWidgetHint }) => {
    // Determine if we show State B (Connected/Matched — has actual data)
    const isConnected = Object.values(connections).some(Boolean);
    const showStateB = isConnected || isMatchSettingsSet;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile data for Coach Matching block
    const [profile, setProfile] = React.useState<UserProfile | null>(null);

    React.useEffect(() => {
        const loadProfile = () => {
            const saved = localStorage.getItem('coachingProfile');
            if (saved) {
                try {
                    setProfile(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse coachingProfile', e);
                }
            } else {
                setProfile(null);
            }
        };

        // Load initially
        loadProfile();

        // Listen for changes from other tabs/modals (if they update localStorage)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'coachingProfile') {
                loadProfile();
            }
        };
        window.addEventListener('storage', handleStorage);

        // Also poll lightly or rely on isMatchSettingsSet trigger if storage event doesn't fire across same window
        // But since we are likely opening a modal and closing it, we should re-check when isMatchSettingsSet changes
    }, []);

    React.useEffect(() => {
        if (isMatchSettingsSet) {
            const saved = localStorage.getItem('coachingProfile');
            if (saved) {
                try { setProfile(JSON.parse(saved)); } catch (e) { }
            }
        } else {
            setProfile(null);
        }
    }, [isMatchSettingsSet]);

    const scrollToConnect = () => {
        if (activeTab !== 'home') {
            onNavigate('home');
            // Allow clear react render cycle before scrolling could be implemented, 
            // but valid UX is just taking them to the dashboard where the connect panel is huge.
        } else {
            const el = document.getElementById('chess-connect');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --- HEADER ---
    const Header = () => (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1 min-w-0">
                    <h1 className={DASHBOARD_FONTS.h1 + " mb-1"}>{showStateB ? "Welcome, John" : "Get matched with a real coach"}</h1>
                    <p className={DASHBOARD_FONTS.body}>
                        {showStateB ? "We don't replace coaches with software — we empower coaches with data." : "Connect your games to unlock personalized insights and coaching groups."}
                    </p>
                </div>
                {!showStateB && (
                    <div className="flex gap-4">
                        <Button themeColor={theme.color} onClick={scrollToConnect}>Connect Data</Button>
                    </div>
                )}
            </div>
        </div>
    );

    // --- TAB CONTENT RENDERING ---
    const renderTabContent = () => {
        switch (activeTab) {
            case 'report':
            case 'training': // Hidden in sidebar
            case 'coaching':
            case 'integrations':
            case 'ai-coach':
            case 'openings':
                return renderOtherTabs();

            case 'home':
            default:
                return (
                    <>
                        {/* ANALYTICS OVERVIEW */}
                        {showStateB ? (
                            // STATE B: REAL DATA / DEMO
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 mb-12">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className={DASHBOARD_FONTS.h2}>Overview</h3>
                                        <span className="text-[10px] xl:text-xs text-slate-500">These insights update after each sync.</span>
                                    </div>

                                    {/* Row 1: Key Metrics (Free) */}
                                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-4 xl:mb-6">
                                        <Card>
                                            <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Rating Snapshot <span title="Current Rapid Rating"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                            <div className={DASHBOARD_FONTS.kpi} style={{ color: theme.color }}>1450</div>
                                            <div className="text-[10px] xl:text-xs text-emerald-500 mt-2 flex items-center font-bold"><ArrowUpRight size={12} className="mr-1" /> +12 this week</div>
                                        </Card>
                                        <Card>
                                            <div className={DASHBOARD_FONTS.label + " mb-3 flex items-center gap-1"}>Weakness <span title="Biggest area for improvement"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                            <div className="text-base xl:text-lg font-bold text-white mb-2 leading-tight">Time Mgmt</div>
                                            <Badge type="high" label="Critical" />
                                        </Card>
                                        <Card>
                                            <div className="flex justify-between mb-3"><div className={DASHBOARD_FONTS.label}>Winrate</div><div className="text-white font-bold">52%</div></div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] text-slate-500"><span>White</span><span>54%</span></div><ProgressBar current={54} max={100} color="#E2E8F0" />
                                                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>Black</span><span>48%</span></div><ProgressBar current={48} max={100} color="#64748B" />
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Consistency <span title="Performance stability over last 20 games"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                            <div className="text-xl xl:text-2xl font-bold text-white">Medium</div>
                                            <div className="text-xs text-slate-500 mt-2">Stable performance</div>
                                        </Card>
                                    </div>

                                    {/* Row 2: Advanced Metrics (Locked for Free, Unlocked for Pro) */}
                                    {isDemoMode ? (
                                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-6 xl:mb-8">
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Blunder Rate <span title="Percentage of moves that are blunders"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                                <div className="text-xl xl:text-2xl font-bold text-red-400">2.4%</div>
                                                <div className="text-xs text-slate-500 mt-2">↓ 0.3% vs last month</div>
                                            </Card>
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Time Trouble <span title="% of games where you had less than 30s remaining"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                                <div className="text-xl xl:text-2xl font-bold text-amber-400">18%</div>
                                                <div className="text-xs text-slate-500 mt-2">Mostly in Rapid games</div>
                                            </Card>
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Advantage Conv. <span title="How often you convert a winning position"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                                <div className="text-xl xl:text-2xl font-bold text-orange-400">Low</div>
                                                <div className="text-xs text-slate-500 mt-2">43% conversion rate</div>
                                            </Card>
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Opening Acc. <span title="Accuracy of your opening moves compared to book moves"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                                <div className="text-xl xl:text-2xl font-bold text-emerald-400">94%</div>
                                                <div className="text-xs text-slate-500 mt-2">Above average</div>
                                            </Card>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-6 xl:mb-8 opacity-60 relative group cursor-pointer" onClick={onUpgradeClick}>
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent group-hover:bg-black/20 transition-colors rounded-xl">
                                                <Badge type="locked" label="Upgrade to unlock advanced metrics" className="text-xs shadow-xl" />
                                            </div>
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Blunder Rate <Lock size={10} className="text-amber-500" /></div>
                                                <div className="text-xl xl:text-2xl font-bold text-slate-400 blur-[2px] Select-none">2.4%</div>
                                            </Card>
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Time Trouble <Lock size={10} className="text-amber-500" /></div>
                                                <div className="text-xl xl:text-2xl font-bold text-slate-400 blur-[2px] Select-none">18%</div>
                                            </Card>
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Advantage Conv. <Lock size={10} className="text-amber-500" /></div>
                                                <div className="text-xl xl:text-2xl font-bold text-slate-400 blur-[2px] Select-none">Low</div>
                                            </Card>
                                            <Card>
                                                <div className={DASHBOARD_FONTS.label + " mb-2 flex items-center gap-1"}>Opening Acc. <Lock size={10} className="text-amber-500" /></div>
                                                <div className="text-xl xl:text-2xl font-bold text-slate-400 blur-[2px] Select-none">94%</div>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // STATE A: BLURRED PREVIEW
                            <div className="space-y-12">
                                {/* 1. DATA SOURCES GRID (Moved to Top) */}
                                <div className="animate-in fade-in slide-in-from-bottom-4" id="chess-connect">
                                    <h3 className={DASHBOARD_FONTS.h2}>Connect Data Sources</h3>
                                    <div className="grid grid-cols-2 gap-6 mt-4">
                                        {/* Chess.com */}
                                        <Card className="hover:border-violet-500/30 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-[#7FA650] rounded-lg flex items-center justify-center text-white border border-white/10"><ChessComLogo size={20} variant="glyph" /></div>
                                                <Badge type={connections.chessCom ? "connected" : "neutral"} label={connections.chessCom ? "Connected" : "Not connected"} />
                                            </div>
                                            <h3 className="text-white font-bold mb-1">Chess.com</h3>
                                            <p className="text-xs text-slate-400 mb-4">{connections.chessCom ? "Syncing daily." : "Import games, ratings, and stats (Read-only)."}</p>
                                            {!connections.chessCom ? (
                                                <Button fullWidth themeColor={theme.color} onClick={() => openModal('chessCom')}>Connect</Button>
                                            ) : (
                                                <Button fullWidth variant="secondary" size="sm" onClick={() => toggleConnection('chessCom')}>Disconnect</Button>
                                            )}
                                        </Card>

                                        {/* Lichess */}
                                        <Card className="hover:border-white/20">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center border border-white/10"><LichessLogo size={20} variant="glyph" /></div>
                                                <Badge type={connections.lichess ? "connected" : "neutral"} label={connections.lichess ? "Connected" : "Not connected"} />
                                            </div>
                                            <h3 className="text-white font-bold mb-1">Lichess</h3>
                                            <p className="text-xs text-slate-400 mb-4">{connections.lichess ? "Syncing daily." : "Secure OAuth sync."}</p>
                                            {!connections.lichess ? (
                                                <Button fullWidth variant="secondary" onClick={() => openModal('lichess')}>Connect</Button>
                                            ) : (
                                                <Button fullWidth variant="secondary" size="sm" onClick={() => toggleConnection('lichess')}>Disconnect</Button>
                                            )}
                                        </Card>

                                        {/* PGN Upload */}
                                        <Card className="hover:border-white/20 col-span-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-300 border border-white/10"><FileText size={20} /></div>
                                            </div>
                                            <h3 className="text-white font-bold mb-1">Upload PGN</h3>
                                            <div className="flex gap-2">
                                                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                                                    if (e.target.files?.length) alert(`Selected ${e.target.files[0].name}. Upload integration coming soon.`);
                                                }} accept=".pgn" />
                                                <input type="text" placeholder="Paste PGN text..." className="w-full bg-[#080C14] border border-white/10 rounded px-2 py-1 text-xs text-white" />
                                                <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>Upload</Button>
                                            </div>
                                        </Card>

                                        {/* Master DB — In Development */}
                                        <Card className="opacity-60 border-dashed border-white/10 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-white border border-white/10"><MasterDBLogo size={20} variant="glyph" /></div>
                                                <Badge type="neutral" label="In Development" />
                                            </div>
                                            <h3 className="text-white font-bold mb-1">Masters DB</h3>
                                            <p className="text-xs text-slate-400 mb-4">Access 10M+ tournament games.</p>
                                            <Button fullWidth variant="secondary" disabled className="opacity-50 cursor-not-allowed">Coming Soon</Button>
                                        </Card>

                                        {/* Manual Inputs */}
                                        <Card className="hover:border-white/20 col-span-1 cursor-pointer" onClick={() => openManualInputs(true)}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-300 border border-white/10"><ListChecks size={20} /></div>
                                                <Badge type="neutral" label={showStateB ? "Matching" : "Not set"} />
                                            </div>
                                            <div className="flex justify-between items-end mb-3">
                                                <div>
                                                    <h3 className="text-white font-bold mb-1">Coach Matching & Goals</h3>
                                                    <p className="text-xs text-slate-400">Help us personalize your plan.</p>
                                                </div>
                                                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openManualInputs(true); }}>Edit</Button>
                                            </div>

                                            {/* Profile Info (if any) */}
                                            {showStateB && profile && (
                                                <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <div className="text-[9px] font-bold px-2 py-1 rounded border bg-white/5 border-white/10 text-slate-300">{profile.level?.split(' (')[0] || '—'}</div>
                                                        {profile.studentAge && <div className="text-[9px] font-bold px-2 py-1 rounded border bg-white/5 border-white/10 text-slate-300">Age: {profile.studentAge}</div>}
                                                        {profile.coachingType && <div className={`text-[9px] font-bold px-2 py-1 rounded border ${profile.coachingType === 'individual' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>{profile.coachingType === 'group' ? 'Group' : '1:1'}</div>}
                                                        {profile.primaryLang && <div className="text-[9px] font-bold px-2 py-1 rounded border bg-white/5 border-white/10 text-slate-300">{profile.primaryLang}</div>}
                                                    </div>

                                                    {(connections?.chessCom || connections?.lichess) && (
                                                        <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/5 mt-1">
                                                            <span className="text-[10px] text-slate-500 font-medium w-full mb-0.5">Connected</span>
                                                            {connections?.chessCom && (
                                                                <button onClick={(e) => { e.stopPropagation(); toggleConnection('chessCom'); }} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Chess.com
                                                                </button>
                                                            )}
                                                            {connections?.lichess && (
                                                                <button onClick={(e) => { e.stopPropagation(); toggleConnection('lichess'); }} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Lichess
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {profile.selectedGoals && profile.selectedGoals.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/5 mt-1">
                                                            <span className="text-[10px] text-slate-500 font-medium w-full mb-0.5">Goals</span>
                                                            {profile.selectedGoals.map(goal => (
                                                                <span key={goal} className="text-[9px] bg-white/5 text-slate-300 border border-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                                    {goal}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Card>

                                        {/* Health (Locked) */}
                                        <Card className="opacity-60 border-dashed border-white/10 col-span-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 border border-white/10"><HeartPulse size={20} /></div>
                                                    <div>
                                                        <h3 className="text-white font-bold mb-1">Health & Stress (Coming Soon)</h3>
                                                        <Badge type="locked" label="Premium" className="mt-1" />
                                                    </div>
                                                </div>
                                                <Lock size={16} className="text-slate-600" />
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* 2. ANALYSIS PREVIEW CTA (Moved Bottom) */}
                                <div className="mb-12 relative overflow-hidden rounded-xl border border-white/5 bg-[#0F1623]/50">
                                    <div className="p-8 blur-sm pointer-events-none opacity-50 select-none grayscale-[0.5]">
                                        <div className="flex items-center justify-between mb-4"><h3 className={DASHBOARD_FONTS.h2}>Analysis Preview</h3></div>
                                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mb-6">
                                            <Card><div className={DASHBOARD_FONTS.label}>Rating</div><div className={DASHBOARD_FONTS.kpi}>1450</div></Card>
                                            <Card><div className={DASHBOARD_FONTS.label}>Weakness</div><div className="text-base xl:text-lg font-bold text-white">Time Mgmt</div></Card>
                                            <Card><div className={DASHBOARD_FONTS.label}>Winrate</div><div className="text-white font-bold">52%</div></Card>
                                            <Card><div className={DASHBOARD_FONTS.label}>Consistency</div><div className="text-xl xl:text-2xl font-bold text-white">Medium</div></Card>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-[#080C14] via-[#080C14]/80 to-transparent">
                                        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 border border-white/10">
                                            <Lock size={32} className="text-white" />
                                        </div>
                                        <h2 className="text-xl xl:text-2xl font-bold text-white mb-2">Unlock your Top 3 Issues + Coaching Plan</h2>
                                        <p className="text-slate-400 mb-8 text-center max-w-md">Connect your accounts above to see where you're losing games and get matched with the right coach.</p>
                                    </div>
                                </div>
                            </div >
                        )}



                        {/* NEXT STEP BANNER */}
                        <div className="mb-12">
                            <Card className="bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border-violet-500/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/20">
                                            <Users size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-base xl:text-lg font-bold text-white">Next step: find a coach matched to your level</h3>
                                            <p className="text-slate-300 text-sm">Based on your goals {connections.chessCom || connections.lichess ? "and game data" : ""}.</p>
                                        </div>
                                    </div>
                                    <Button themeColor={theme.color} icon={Users} onClick={() => onNavigate('coaching')}>Find Coach</Button>
                                </div>
                            </Card>
                        </div>

                        {/* COACH-ORIENTED ACTION PLAN (Only if Connected/Demo) */}
                        {
                            showStateB && (
                                <div className="mb-12 animate-in fade-in">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={DASHBOARD_FONTS.h2 + " flex items-center gap-2"}><Target size={18} className="text-violet-500" /> Action Plan</h3>
                                        <span className="text-[10px] xl:text-xs text-slate-500 italic max-w-md text-right">Our analytics identify weaknesses; to improve efficiently, work with a live coach.</span>
                                    </div>
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
                                        {[
                                            { t: "Review Sicilian Games", d: "Winrate 35% as White. 12 games analyzed.", a: "Find Coach", nav: 'coaching' },
                                            { t: "Endgame Deep-Dive", d: "Missed passed pawn opportunities in 4 games.", a: "View Coaches", nav: 'coaching' },
                                            { t: "Time Management Workshop", d: "Avg 10s left after move 30. Panic detected.", a: "Join Class", nav: 'coaching' }
                                        ].map((item, i) => (
                                            <Card key={i} className="flex flex-col justify-between hover:border-violet-500/30 group">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2"><div className="font-bold text-white group-hover:text-violet-400 transition-colors">{item.t}</div></div>
                                                    <div className="text-sm text-slate-400 mb-6 leading-relaxed">{item.d}</div>
                                                </div>
                                                <Button variant="secondary" fullWidth className="group-hover:bg-violet-500/10 group-hover:text-violet-300 group-hover:border-violet-500/20" onClick={() => item.a === 'Join Class' ? onJoinCoaching() : onNavigate(item.nav)}>{item.a}</Button>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {/* Join Group Teaser */}
                        <div className="mb-8">
                            <h3 className={DASHBOARD_FONTS.h2 + " mb-3 xl:mb-4"}>Upcoming Group Classes</h3>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
                                {[
                                    { t: "Rook Endgames", s: "2/4 seats", l: "EN", time: "Starts in 2h" },
                                    { t: "Time Trouble Clinic", s: "Waitlist", l: "EN", time: "Starts in 1h" }
                                ].map((g, i) => (
                                    <Card key={i} className="flex flex-col justify-between hover:border-amber-500/30 group cursor-pointer" padding="p-4">
                                        <div className="flex justify-between mb-2">
                                            <Badge type="neutral" label={g.l} />
                                            <span className="text-xs text-amber-500 font-bold">{g.time}</span>
                                        </div>
                                        <div className="font-bold text-white mb-1 group-hover:text-amber-400">{g.t}</div>
                                        <div className="text-xs text-slate-500 mb-4">{g.s} available</div>
                                        <Button size="sm" variant="secondary" fullWidth onClick={g.s === 'Waitlist' ? onUpgradeClick : onOpenBooking}>{g.s === 'Waitlist' ? 'Join Waitlist' : 'Join Class'}</Button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                );
        }
    };

    // Extracted render methods
    const renderReportTab = (showStateB: boolean, theme: any) => (
        <ReportDashboard
            showStateB={showStateB}
            theme={theme}
            onUpgradeClick={onUpgradeClick}
            onActiveSliceChange={onReportActiveSliceChange}
            onWidgetHint={(hint, data) => onReportWidgetHint?.(hint, data)}
        />
    );

    // Integrations Tab
    const renderIntegrationsTab = (connections: any, toggleConnection: any, theme: any) => (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className={DASHBOARD_FONTS.h1}>Apps & Integrations</h1>
                    <p className={DASHBOARD_FONTS.body}>Connect your favorite tools to enhance your experience.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
                {[
                    { n: 'Chess.com', i: (props: any) => <ChessComLogo {...props} variant="glyph" />, d: 'Import games and stats.', s: connections.chessCom ? 'connected' : 'neutral', l: connections.chessCom ? 'Connected' : 'Connect' },
                    { n: 'Lichess', i: (props: any) => <LichessLogo {...props} variant="glyph" />, d: 'Import games and stats.', s: connections.lichess ? 'connected' : 'neutral', l: connections.lichess ? 'Connected' : 'Connect' },
                    { n: 'Zoom', i: Video, d: 'For live coaching sessions.', s: 'neutral', l: 'Connect' },
                    { n: 'Discord', i: MessageSquare, d: 'Join the community server.', s: 'neutral', l: 'Connect' },
                    { n: 'Google Calendar', i: Calendar, d: 'Sync coaching sessions.', s: 'neutral', l: 'Connect' },
                    { n: 'Gmail', i: Mail, d: 'Receive reports via email.', s: 'connected', l: 'Connected' },
                ].map((app, i) => (
                    <Card key={i} className="flex flex-col justify-between hover:border-pink-500/30 group">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-300 border border-white/10 group-hover:text-pink-400 group-hover:border-pink-500/20 transition-colors">
                                    <app.i size={20} />
                                </div>
                                <Badge type={app.s} label={app.l} />
                            </div>
                            <h3 className="text-white font-bold mb-1">{app.n}</h3>
                            <p className="text-xs text-slate-400 mb-6">{app.d}</p>
                        </div>
                        <Button variant={app.s === 'connected' ? 'secondary' : 'primary'} themeColor={theme.color} fullWidth onClick={app.n === 'Chess.com' ? () => (connections.chessCom ? toggleConnection('chessCom') : openModal('chessCom')) : app.n === 'Lichess' ? () => (connections.lichess ? toggleConnection('lichess') : openModal('lichess')) : undefined}>
                            {app.s === 'connected' ? 'Disconnect' : 'Connect'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );

    // Coaching Tab Logic
    const renderCoachingTab = () => (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className={DASHBOARD_FONTS.h1}>Coaching Hub</h1>
                    <p className={DASHBOARD_FONTS.body}>{showStateB ? "Find your perfect coach or join a group class." : "Review and complete your matching profile to get coach recommendations."}</p>
                </div>
                <Button themeColor={theme.color} icon={Users} onClick={() => window.location.href = '/dashboard/coaching/enroll'}>Find a Coach</Button>
            </div>

            {/* MY JOURNEY (Placeholder) */}
            {showStateB && (
                <Card className="border-dashed border-white/10 bg-white/5">
                    <div className="flex items-center gap-4 text-slate-500">
                        <BookOpen size={24} />
                        <div>
                            <div className="font-bold text-slate-300">My Journey (Coming Soon)</div>
                            <div className="text-xs">Track your sessions, homework, and progress notes here.</div>
                        </div>
                    </div>
                </Card>
            )}

            {showStateB ? (
                // COACHING STATE B
                <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="col-span-2 space-y-6">
                        <Card>
                            <h3 className={DASHBOARD_FONTS.h2 + " mb-3 xl:mb-4"}>Upcoming Sessions</h3>
                            <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                                <Calendar size={32} className="text-slate-500 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm mb-4">No upcoming sessions scheduled.</p>
                                <Button variant="secondary" size="sm" onClick={onOpenBooking}>Browse Schedule</Button>
                            </div>
                        </Card>
                        <div>
                            <h3 className={DASHBOARD_FONTS.h2 + " mb-3 xl:mb-4"}>Recommended Coaches</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[{ n: "IM Alex Smith", r: "2400", p: "$50/hr", i: User }, { n: "FM Sarah Jones", r: "2300", p: "$40/hr", i: User }].map((c, i) => (
                                    <Card key={i} padding="p-4" className="flex items-center gap-4 hover:border-amber-500/30 cursor-pointer">
                                        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 border border-amber-500/20"><c.i size={24} /></div>
                                        <div>
                                            <div className="text-white font-bold">{c.n}</div>
                                            <div className="text-xs text-slate-400">Rating: {c.r} • {c.p}</div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className={DASHBOARD_FONTS.h2 + " mb-3 xl:mb-4"}>Popular Group Classes</h3>
                        <div className="space-y-3">
                            {[{ t: "Rook Endgames", s: 2, time: "Today, 19:00" }, { t: "Sicilian Defense", s: 3, time: "Tommorow, 10:00" }].map((g, i) => (
                                <Card key={i} padding="p-4" className="hover:border-amber-500/30 cursor-pointer group">
                                    <div className="flex justify-between mb-1"><span className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">{g.t}</span><Badge type="neutral" label="EN" /></div>
                                    <div className="text-xs text-slate-500 mb-3">{g.time}</div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-xs text-slate-500 flex-1 mr-4"><div className="flex justify-between mb-1"><span>Seats</span><span className="text-white">{g.s}/4</span></div><ProgressBar current={g.s} max={4} color={theme.color} /></div>
                                        <span className="text-xs font-bold text-amber-400">Join</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // COACHING STATE A
                <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                        <Users size={32} className="text-amber-500" />
                    </div>
                    <h2 className={DASHBOARD_FONTS.h2 + " mb-2"}>Find Your Coach</h2>
                    <p className={DASHBOARD_FONTS.body + " mb-8 max-w-lg"}>Connect your accounts so we can match you with the perfect coach based on your playstyle and weaknesses.</p>

                    {profile && (
                        <div className="w-full bg-[#0B101B] border border-white/10 rounded-2xl p-6 shadow-xl text-left mt-4 border-t-4 border-t-amber-500 relative overflow-hidden">
                            {/* Decorative background blur */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h3 className="font-bold text-white uppercase tracking-wide text-sm flex items-center gap-2">
                                    <Target size={16} className="text-amber-500" /> Coach Matching & Goals
                                </h3>
                                <Button size="xs" variant="secondary" onClick={() => openManualInputs?.()}>Edit</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 relative z-10">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Skill Level:</span>
                                        <span className="text-white font-medium">{profile.level?.split(' (')[0] || '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Format:</span>
                                        <span className={`font-medium ${profile.coachingType === 'individual' ? 'text-violet-400' : 'text-amber-400'}`}>
                                            {profile.coachingType === 'individual' ? '1:1 Coaching' : 'Group Class'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Language:</span>
                                        <span className="text-white font-medium">{profile.primaryLang || '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Timezone:</span>
                                        <span className="text-white font-medium truncate max-w-[120px]" title={profile.timezone}>{profile.timezone?.split('/')[1]?.replace('_', ' ') || profile.timezone}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-xs text-slate-400 mb-2">Connected Platforms:</div>
                                    <div className="flex gap-2">
                                        {connections.chessCom ? (
                                            <div className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1.5 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Chess.com
                                            </div>
                                        ) : (
                                            <button onClick={() => openModal('chessCom')} className="text-[10px] bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 px-2 py-1 rounded transition-colors">
                                                Connect Chess.com
                                            </button>
                                        )}
                                        {connections.lichess ? (
                                            <div className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1.5 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Lichess
                                            </div>
                                        ) : (
                                            <button onClick={() => openModal('lichess')} className="text-[10px] bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 px-2 py-1 rounded transition-colors">
                                                Connect Lichess
                                            </button>
                                        )}
                                    </div>

                                    {profile.selectedGoals && profile.selectedGoals.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-white/5">
                                            <div className="text-xs text-slate-400 mb-2">Primary Goals:</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {profile.selectedGoals.map(goal => (
                                                    <span key={goal} className="text-[9px] bg-white/10 text-slate-300 font-medium px-1.5 py-0.5 rounded border border-white/5">
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA to actually go enroll */}
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                                <Button themeColor="#F59E0B" onClick={() => window.location.href = '/dashboard/coaching/enroll'} icon={Target}>
                                    View Suggested Coaches
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // AI Coach Tab
    const renderAICoachTab = () => (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className={DASHBOARD_FONTS.h1}>AI Coach</h1>
                    <p className={DASHBOARD_FONTS.body}>Your personal AI-powered chess coach, available 24/7.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6">
                <Card className="xl:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"><Brain size={20} className="text-white" /></div>
                        <div>
                            <h3 className="text-white font-bold">Ask Your Coach</h3>
                            <p className="text-xs text-slate-400">Get instant analysis and advice on any position or game.</p>
                        </div>
                    </div>
                    <div className="bg-[#080C14] rounded-xl p-4 border border-white/5 min-h-[200px] mb-4">
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0"><Brain size={14} className="text-amber-400" /></div>
                                <div className="bg-white/5 rounded-xl rounded-tl-none p-3 text-sm text-slate-300">
                                    Hi John! I've analyzed your last 50 games. Your biggest weakness is time management in the middlegame — you spend 40% of your clock in the first 15 moves. Want me to create a time management drill?
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <div className="bg-violet-500/20 rounded-xl rounded-tr-none p-3 text-sm text-slate-200">
                                    Yes, and also show me my worst openings as Black.
                                </div>
                                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">JD</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0"><Brain size={14} className="text-amber-400" /></div>
                                <div className="bg-white/5 rounded-xl rounded-tl-none p-3 text-sm text-slate-300">
                                    Your weakest opening as Black is the Sicilian Najdorf — 28% winrate over 12 games. I recommend switching to the Sicilian Taimanov which suits your positional style better. I can show you the key lines.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Ask your AI coach anything..." className="flex-1 bg-[#080C14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
                        <Button themeColor={theme.color}>Send</Button>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-white font-bold mb-3">Recent Insights</h3>
                    <div className="space-y-3">
                        {[{ t: 'Endgame weakness detected', d: 'Rook endgames: 35% accuracy', c: 'text-red-400' }, { t: 'Opening improvement', d: 'Italian Game: +8% winrate this month', c: 'text-emerald-400' }, { t: 'Time management', d: 'Avg 2.3min on moves 20-30', c: 'text-amber-400' }].map((insight, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className={`text-sm font-bold ${insight.c}`}>{insight.t}</div>
                                <div className="text-xs text-slate-400 mt-1">{insight.d}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-white font-bold mb-3">Suggested Drills</h3>
                    <div className="space-y-3">
                        {[{ t: 'Time Management Training', d: '15 min • Middlegame focus', p: 85 }, { t: 'Rook Endgame Basics', d: '20 min • Lucena & Philidor', p: 60 }, { t: 'Tactical Pattern Recognition', d: '10 min • Forks & Pins', p: 40 }].map((drill, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-white">{drill.t}</span>
                                    <span className="text-[10px] text-slate-500">{drill.p}% relevance</span>
                                </div>
                                <div className="text-xs text-slate-400">{drill.d}</div>
                                <ProgressBar current={drill.p} max={100} color={theme.color} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    // Opening Lab Tab
    const renderOpeningLabTab = () => (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className={DASHBOARD_FONTS.h1}>Opening Lab</h1>
                    <p className={DASHBOARD_FONTS.body}>Explore, analyze and build your opening repertoire.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
                <Card className="xl:col-span-2">
                    <h3 className="text-white font-bold mb-4">Your Repertoire Performance</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Italian Game', color: '#10B981', games: 18, winrate: 67, moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4' },
                            { name: 'Sicilian Najdorf', color: '#EF4444', games: 12, winrate: 28, moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6' },
                            { name: "Queen's Gambit Declined", color: '#F59E0B', games: 15, winrate: 53, moves: '1.d4 d5 2.c4 e6' },
                            { name: 'Caro-Kann Defense', color: '#8B5CF6', games: 8, winrate: 62, moves: '1.e4 c6' },
                            { name: 'Ruy Lopez', color: '#3B82F6', games: 22, winrate: 59, moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5' },
                        ].map((opening, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer transition-all">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: opening.color }} />
                                        <div>
                                            <div className="text-sm font-bold text-white">{opening.name}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">{opening.moves}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold" style={{ color: opening.winrate >= 50 ? '#10B981' : '#EF4444' }}>{opening.winrate}%</div>
                                        <div className="text-[10px] text-slate-500">{opening.games} games</div>
                                    </div>
                                </div>
                                <ProgressBar current={opening.winrate} max={100} color={opening.color} />
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-4 xl:space-y-6">
                    <Card>
                        <h3 className="text-white font-bold mb-3">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="text-xs text-slate-400">Total Openings</span><span className="text-sm font-bold text-white">12</span></div>
                            <div className="flex justify-between"><span className="text-xs text-slate-400">Best Opening</span><span className="text-sm font-bold text-emerald-400">Italian Game (67%)</span></div>
                            <div className="flex justify-between"><span className="text-xs text-slate-400">Worst Opening</span><span className="text-sm font-bold text-red-400">Sicilian Najdorf (28%)</span></div>
                            <div className="flex justify-between"><span className="text-xs text-slate-400">Avg Depth</span><span className="text-sm font-bold text-white">8.3 moves</span></div>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-white font-bold mb-3">Recommendations</h3>
                        <div className="space-y-2">
                            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300">⚠ Drop Sicilian Najdorf — try Taimanov instead</div>
                            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300">✓ Italian Game is your strongest — deepen to move 12+</div>
                            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">💡 Add a London System to your White repertoire</div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

    // Return other tabs
    const renderOtherTabs = () => {
        switch (activeTab) {
            case 'report': return renderReportTab(showStateB, theme);
            case 'integrations': return renderIntegrationsTab(connections, toggleConnection, theme);
            case 'coaching': return renderCoachingTab();
            case 'ai-coach': return renderAICoachTab();
            case 'openings': return renderOpeningLabTab();
            default: return null;
        }
    }

    return (
        <div className="flex-1 w-full min-h-screen pt-16 lg:pt-8 pb-12 px-4 lg:px-8 pl-4 lg:pl-8 2xl:pl-[300px] pr-4 lg:pr-[350px] transition-all duration-300 overflow-x-hidden">
            {/* Conditional Rendering of Connect Banner VS Welcome Header */}
            {activeTab === 'home' && !showStateB ? (
                <div id="chess-connect" className="mb-8">
                    <Header />
                </div>
            ) : (
                activeTab === 'home' && <Header />
            )}
            {renderTabContent()}
        </div>
    );
};

export default CenterColumn;
