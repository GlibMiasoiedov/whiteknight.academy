import React, { useRef } from 'react';
import {
    BookOpen, Calendar, User, Video, MessageSquare, Mail, FileText, HeartPulse, Users, ListChecks, HelpCircle, ArrowUpRight, Lock, Target, RefreshCw, Upload
} from 'lucide-react';
import { ChessComLogo, LichessLogo, MasterDBLogo } from '../ui/Logos';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { FONTS } from '../../constants/theme';

interface CenterColumnProps {
    connections: { chessCom: boolean; lichess: boolean; masterDb: boolean };
    toggleConnection: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    theme: { color: string };
    activeTab: string;
    onUpgradeClick: () => void;
    isDemoMode: boolean;
    setDemoMode: (mode: boolean) => void;
    openManualInputs: (canSkip?: boolean) => void;
    onNavigate: (tab: string) => void;
    openModal: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    onJoinCoaching: () => void;
    isMatchSettingsSet: boolean;
}

const CenterColumn: React.FC<CenterColumnProps> = ({ connections, toggleConnection, theme, activeTab, onUpgradeClick, isDemoMode, setDemoMode, openManualInputs, onNavigate, openModal, onJoinCoaching, isMatchSettingsSet }) => {
    // Determine if we show State B (Connected/Demo/Matched)
    const isConnected = Object.values(connections).some(Boolean);
    const showStateB = isConnected || isDemoMode || isMatchSettingsSet;
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className={FONTS.h1 + " mb-1"}>{showStateB ? "Welcome, John" : "Get matched with a real coach"}</h1>
                    <p className={FONTS.body}>
                        {showStateB ? "We don't replace coaches with software — we empower coaches with data." : "Connect your games to unlock personalized insights and coaching groups."}
                    </p>
                </div>
                {!showStateB && (
                    <div className="flex gap-4">
                        <button onClick={() => setDemoMode(true)} className="text-sm text-slate-500 hover:text-white transition-colors">Use demo data</button>
                        <Button themeColor={theme.color} onClick={scrollToConnect}>Connect Data</Button>
                    </div>
                )}
                {showStateB && (
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isDemoMode ? "text-white" : "text-slate-600"}`}>Demo Data</span>
                        <button
                            onClick={() => setDemoMode(!isDemoMode)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${isDemoMode ? `bg-[${theme.color}]` : 'bg-slate-700'}`}
                            style={isDemoMode ? { backgroundColor: theme.color } : {}}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDemoMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
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
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={FONTS.h2}>Overview</h3>
                                        <span className="text-xs text-slate-500">These insights update after each sync.</span>
                                    </div>

                                    {/* Row 1: Key Metrics (Free) */}
                                    <div className="grid grid-cols-4 gap-6 mb-6">
                                        <Card>
                                            <div className={FONTS.label + " mb-2 flex items-center gap-1"}>Rating Snapshot <span title="Current Rapid Rating"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                            <div className={FONTS.kpi} style={{ color: theme.color }}>1450</div>
                                            <div className="text-xs text-emerald-500 mt-2 flex items-center font-bold"><ArrowUpRight size={12} className="mr-1" /> +12 this week</div>
                                        </Card>
                                        <Card>
                                            <div className={FONTS.label + " mb-3 flex items-center gap-1"}>Weakness <span title="Biggest area for improvement"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                            <div className="text-lg font-bold text-white mb-2 leading-tight">Time Mgmt</div>
                                            <Badge type="high" label="Critical" />
                                        </Card>
                                        <Card>
                                            <div className="flex justify-between mb-3"><div className={FONTS.label}>Winrate</div><div className="text-white font-bold">52%</div></div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] text-slate-500"><span>White</span><span>54%</span></div><ProgressBar current={54} max={100} color="#E2E8F0" />
                                                <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>Black</span><span>48%</span></div><ProgressBar current={48} max={100} color="#64748B" />
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className={FONTS.label + " mb-2 flex items-center gap-1"}>Consistency <span title="Performance stability over last 20 games"><HelpCircle size={10} className="text-slate-600" /></span></div>
                                            <div className="text-2xl font-bold text-white">Medium</div>
                                            <div className="text-xs text-slate-500 mt-2">Stable performance</div>
                                        </Card>
                                    </div>

                                    {/* Row 2: Advanced Metrics (Locked) */}
                                    <div className="grid grid-cols-4 gap-6 mb-8 opacity-60 relative group cursor-pointer" onClick={onUpgradeClick}>
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent group-hover:bg-black/20 transition-colors rounded-xl">
                                            <Badge type="locked" label="Upgrade to unlock advanced metrics" className="text-xs shadow-xl" />
                                        </div>
                                        <Card>
                                            <div className={FONTS.label + " mb-2 flex items-center gap-1"}>Blunder Rate <Lock size={10} className="text-amber-500" /></div>
                                            <div className="text-2xl font-bold text-slate-400 blur-[2px] Select-none">2.4%</div>
                                        </Card>
                                        <Card>
                                            <div className={FONTS.label + " mb-2 flex items-center gap-1"}>Time Trouble <Lock size={10} className="text-amber-500" /></div>
                                            <div className="text-2xl font-bold text-slate-400 blur-[2px] Select-none">18%</div>
                                        </Card>
                                        <Card>
                                            <div className={FONTS.label + " mb-2 flex items-center gap-1"}>Advantage Conv. <Lock size={10} className="text-amber-500" /></div>
                                            <div className="text-2xl font-bold text-slate-400 blur-[2px] Select-none">Low</div>
                                        </Card>
                                        <Card>
                                            <div className={FONTS.label + " mb-2 flex items-center gap-1"}>Opening Acc. <Lock size={10} className="text-amber-500" /></div>
                                            <div className="text-2xl font-bold text-slate-400 blur-[2px] Select-none">94%</div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // STATE A: BLURRED PREVIEW
                            <div className="space-y-12">
                                {/* 1. DATA SOURCES GRID (Moved to Top) */}
                                <div className="animate-in fade-in slide-in-from-bottom-4" id="chess-connect">
                                    <h3 className={FONTS.h2}>Connect Data Sources</h3>
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

                                        {/* Master DB */}
                                        <Card className="hover:border-amber-500/30 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-white border border-white/10"><MasterDBLogo size={20} variant="glyph" /></div>
                                                <Badge type={connections.masterDb ? "connected" : "neutral"} label={connections.masterDb ? "Connected" : "Connect"} />
                                            </div>
                                            <h3 className="text-white font-bold mb-1">Masters DB</h3>
                                            <p className="text-xs text-slate-400 mb-4">Access 10M+ tournament games.</p>
                                            {!connections.masterDb ? (
                                                <Button fullWidth variant="secondary" onClick={() => openModal('masterDb')}>Enable Access</Button>
                                            ) : (
                                                <Button fullWidth variant="secondary" size="sm" onClick={() => toggleConnection('masterDb')}>Disconnect</Button>
                                            )}
                                        </Card>

                                        {/* Manual Inputs */}
                                        <Card className="hover:border-white/20 col-span-1 cursor-pointer" onClick={() => openManualInputs(true)}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-300 border border-white/10"><ListChecks size={20} /></div>
                                                <Badge type="neutral" label={showStateB ? "Matching" : "Not set"} />
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="text-white font-bold mb-1">Match with a Coach</h3>
                                                    <p className="text-xs text-slate-400">Goals, level, preferences.</p>
                                                </div>
                                                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openManualInputs(true); }}>Edit</Button>
                                            </div>
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
                                        <div className="flex items-center justify-between mb-4"><h3 className={FONTS.h2}>Analysis Preview</h3></div>
                                        <div className="grid grid-cols-4 gap-6 mb-6">
                                            <Card><div className={FONTS.label}>Rating</div><div className={FONTS.kpi}>1450</div></Card>
                                            <Card><div className={FONTS.label}>Weakness</div><div className="text-lg font-bold text-white">Time Mgmt</div></Card>
                                            <Card><div className={FONTS.label}>Winrate</div><div className="text-white font-bold">52%</div></Card>
                                            <Card><div className={FONTS.label}>Consistency</div><div className="text-2xl font-bold text-white">Medium</div></Card>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-[#080C14] via-[#080C14]/80 to-transparent">
                                        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 border border-white/10">
                                            <Lock size={32} className="text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Unlock your Top 3 Issues + Coaching Plan</h2>
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
                                            <h3 className="text-lg font-bold text-white">Next step: find a coach matched to your level</h3>
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
                                        <h3 className={FONTS.h2 + " flex items-center gap-2"}><Target size={20} className="text-violet-500" /> Action Plan</h3>
                                        <span className="text-xs text-slate-500 italic max-w-md text-right">Our analytics identify weaknesses; to improve efficiently, work with a live coach. Automated drills are optional.</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { t: "Review Sicilian Games", d: "Winrate 35% as White. 12 games analyzed.", a: "Find Coach", nav: 'coaching' },
                                            { t: "Endgame Deep-Dive", d: "Missed passed pawn opportunities in 4 games.", a: "View Coaches", nav: 'coaching' },
                                            { t: "Time Management Workshop", d: "Avg 10s left after move 30. Panic detected.", a: "Join Class", nav: 'upgrade' }
                                        ].map((item, i) => (
                                            <Card key={i} className="flex flex-col justify-between hover:border-violet-500/30 group">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2"><div className="font-bold text-white group-hover:text-violet-400 transition-colors">{item.t}</div></div>
                                                    <div className="text-sm text-slate-400 mb-6 leading-relaxed">{item.d}</div>
                                                </div>
                                                <Button variant="secondary" fullWidth className="group-hover:bg-violet-500/10 group-hover:text-violet-300 group-hover:border-violet-500/20" onClick={() => item.a === 'Join Class' ? onJoinCoaching() : item.nav === 'upgrade' ? onUpgradeClick() : onNavigate(item.nav)}>{item.a}</Button>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {/* Join Group Teaser */}
                        <div className="mb-8">
                            <h3 className={FONTS.h2 + " mb-4"}>Upcoming Group Classes</h3>
                            <div className="grid grid-cols-3 gap-6">
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
                                        <Button size="sm" variant="secondary" fullWidth onClick={g.s === 'Waitlist' ? onUpgradeClick : onJoinCoaching}>{g.s === 'Waitlist' ? 'Join Waitlist' : 'Join Class'}</Button>
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
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className={FONTS.h1}>{showStateB ? "Deep Dive Analysis" : "Report Locked"}</h1>
                    <p className={FONTS.body}>{showStateB ? "Generated Today • Based on last 50 games" : "Connect your chess account on the Home screen to generate your analysis."}</p>
                </div>
                {showStateB && (
                    <div className="flex gap-2">
                        <Button variant="secondary" icon={Upload}>Export PDF</Button>
                        <Button themeColor={theme.color} icon={RefreshCw}>Refresh</Button>
                    </div>
                )}
            </div>

            {showStateB ? (
                <div className="grid grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-[#0F1623] to-[#0B1220]">
                        <div className={FONTS.label + " mb-4"}>Accuracy</div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24">
                                <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1E293B" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={theme.color} strokeWidth="3" strokeDasharray="78, 100" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-xl">78%</div>
                            </div>
                            <div>
                                <div className="text-emerald-400 text-sm font-bold flex items-center mb-1"><ArrowUpRight size={14} className="mr-1" /> +4.2%</div>
                                <div className="text-xs text-slate-500">vs last week</div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className={FONTS.label + " mb-4"}>Game Phases</div>
                        <div className="space-y-4">
                            {[{ l: "Opening", v: 92, c: "#10B981" }, { l: "Middlegame", v: 65, c: "#F59E0B" }, { l: "Endgame", v: 45, c: "#EF4444" }].map((p, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs text-slate-300 mb-1"><span>{p.l}</span><span>{p.v}%</span></div>
                                    <ProgressBar current={p.v} max={100} color={p.c} />
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <div className={FONTS.label + " mb-4"}>Key Mistakes</div>
                        <ul className="space-y-3">
                            {[{ t: "Blunders", c: 4, color: "text-red-400" }, { t: "Missed Wins", c: 2, color: "text-amber-400" }, { t: "Inaccuracies", c: 12, color: "text-blue-400" }].map((err, i) => (
                                <li key={i} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
                                    <span className="text-sm text-slate-300">{err.t}</span><span className={`font-bold ${err.color}`}>{err.c}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20">
                        <Lock size={32} className="text-emerald-500" />
                    </div>
                    <h2 className={FONTS.h2 + " mb-2"}>Analysis Unavailable</h2>
                    <p className={FONTS.body + " max-w-md mb-8"}>Please connect your chess accounts on the Home screen to unlock your detailed performance report.</p>
                </div>
            )}
        </div>
    );

    // Integrations Tab
    const renderIntegrationsTab = (connections: any, toggleConnection: any, theme: any) => (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h1 className={FONTS.h1}>Apps & Integrations</h1>
                    <p className={FONTS.body}>Connect your favorite tools to enhance your experience.</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
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
                    <h1 className={FONTS.h1}>Coaching Hub</h1>
                    <p className={FONTS.body}>{showStateB ? "Find your perfect coach or join a group class." : "Connect data to get personalized coach recommendations."}</p>
                </div>
                <Button themeColor={theme.color} icon={Users} onClick={() => {
                    const hasData = isConnected || isDemoMode;
                    if (hasData) {
                        if (confirm("Is this your account? We'll use your game data to match you.")) {
                            openManualInputs(true);
                        }
                    } else {
                        openManualInputs(false);
                    }
                }}>Find a Coach</Button>
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
                            <h3 className={FONTS.h2 + " mb-4"}>Upcoming Sessions</h3>
                            <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                                <Calendar size={32} className="text-slate-500 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm mb-4">No upcoming sessions scheduled.</p>
                                <Button variant="secondary" size="sm">Browse Schedule</Button>
                            </div>
                        </Card>
                        <div>
                            <h3 className={FONTS.h2 + " mb-4"}>Recommended Coaches</h3>
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
                        <h3 className={FONTS.h2 + " mb-4"}>Popular Group Classes</h3>
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
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-6 border border-amber-500/20">
                        <Users size={32} className="text-amber-500" />
                    </div>
                    <h2 className={FONTS.h2 + " mb-2"}>Find Your Coach</h2>
                    <p className={FONTS.body + " max-w-md mb-8"}>Connect your accounts so we can match you with the perfect coach based on your playstyle and weaknesses.</p>
                </div>
            )}
        </div>
    );

    // Return other tabs
    const renderOtherTabs = () => {
        switch (activeTab) {
            case 'report': return renderReportTab(showStateB, theme);
            case 'integrations': return renderIntegrationsTab(connections, toggleConnection, theme);
            case 'coaching': return renderCoachingTab();
            default: return null;
        }
    }

    return (
        <div className="ml-[260px] mr-[340px] min-h-screen p-8 bg-[#080C14]">
            <Header />
            {renderTabContent()}
        </div>
    );
};

export default CenterColumn;
