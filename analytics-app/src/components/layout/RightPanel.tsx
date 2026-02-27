import React, { useRef, useState } from 'react';
import { CheckCircle, Lock, Zap, Lightbulb, Search, BrainCircuit, X, BookOpen, Target, Crown, Trophy, Clock, Shield, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ChessComLogo, LichessLogo, MasterDBLogo } from '../ui/Logos';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { DASHBOARD_FONTS } from '../../constants/theme';

interface RightPanelProps {
    connections: { chessCom: boolean; lichess: boolean; masterDb: boolean };
    openManualInputs: (canSkip?: boolean) => void;
    theme: { color: string };
    activeTab: 'report' | 'openings' | string;
    onUpgradeClick: () => void;
    isDemoMode: boolean;
    setDemoMode: (mode: boolean) => void;
    onNavigate: (tab: string) => void;
    toggleConnection: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    openModal: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    isMatchSettingsSet: boolean;
    hasJoinedCoaching: boolean;
    onJoinCoaching: () => void;
    pgnUploaded: boolean;
    setPgnUploaded: (uploaded: boolean) => void;
    isOpen?: boolean;
    onClose?: () => void;
    /** Active radar slice id from StatRoseChart (e.g. 'endgame', 'tactics') */
    reportActiveSlice?: string | null;
    /** Active widget hint key (e.g. 'opponents', 'openings', 'activity', 'timecontrols') */
    reportWidgetHint?: string | null;
    /** Dynamic data for the active widget hint */
    reportWidgetData?: any;
    /** The active tab inside the Report Dashboard (overview, openings, etc) */
    reportActiveTab?: string;
    /** Callback to clear active insights */
    onClearInsight?: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ connections, openManualInputs, theme, activeTab, onUpgradeClick, isDemoMode, onNavigate, toggleConnection, openModal, isMatchSettingsSet, hasJoinedCoaching, onJoinCoaching, pgnUploaded, setPgnUploaded, isOpen = true, onClose, reportActiveSlice, reportWidgetHint, reportWidgetData, reportActiveTab, onClearInsight }) => {
    const isConnected = Object.values(connections).some(Boolean);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [reportContextTab, setReportContextTab] = useState<'insights' | 'ai' | 'filters'>('insights');

    // Data source connections
    const connectorSteps = [
        {
            l: <div className="flex items-center gap-2"><ChessComLogo size={14} variant="glyph" /> Chess.com</div>,
            s: connections.chessCom ? 'connected' : 'connect',
            a: () => connections.chessCom ? toggleConnection('chessCom') : openModal('chessCom')
        },
        {
            l: <div className="flex items-center gap-2"><LichessLogo size={14} variant="glyph" /> Lichess</div>,
            s: connections.lichess ? 'connected' : 'connect',
            a: () => connections.lichess ? toggleConnection('lichess') : openModal('lichess')
        },
        {
            l: "Upload PGN",
            s: pgnUploaded ? 'connected' : 'connect',
            a: () => pgnUploaded ? setPgnUploaded(false) : fileInputRef.current?.click()
        },
    ];

    // Action steps
    const nextSteps = [
        {
            l: "Coaching Preferences",
            s: isMatchSettingsSet ? 'done' : 'connect',
            a: openManualInputs
        },
        {
            l: "Generate Report",
            s: isConnected ? 'done' : 'connect',
            a: () => isConnected ? onNavigate('report') : undefined
        },
        {
            l: "Join a Group / Find Coach",
            s: hasJoinedCoaching ? 'done' : 'connect',
            a: () => onNavigate('coaching')
        }
    ];

    // In-development items (shown at bottom, separated)
    const inDevSteps = [
        {
            l: <div className="flex items-center gap-2"><MasterDBLogo size={14} variant="glyph" /> Masters DB</div>,
            s: 'in-dev',
            a: () => { }
        },
        {
            l: "Health & Stress",
            s: 'in-dev',
            a: () => { }
        }
    ];

    const allWorkingSteps = [...connectorSteps, ...nextSteps];
    const completedSteps = allWorkingSteps.filter(s => s.s === 'done' || s.s === 'connected').length;
    const totalSteps = allWorkingSteps.length;

    const renderStep = (step: any, i: number) => (
        <div key={i} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${step.s === 'connect' && step.l !== 'Generate Report' ? 'hover:bg-white/5 cursor-pointer' : step.l === 'Generate Report' && step.s === 'done' ? 'hover:bg-white/5 cursor-pointer' : ''}`}
            onClick={step.l === 'Generate Report' && step.s === 'done' ? () => onNavigate('report') : step.s === 'connect' && step.l !== 'Generate Report' ? step.a : undefined}
        >
            <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border ${step.s === 'done' || step.s === 'connected' ? 'bg-emerald-500 border-emerald-500 text-white' : step.s === 'in-dev' ? 'border-dashed border-slate-600 text-slate-500' : 'border-slate-700 text-slate-500'}`}>
                    {step.s === 'done' || step.s === 'connected' ? <CheckCircle size={10} /> : step.s === 'locked' ? <Lock size={10} /> : null}
                </div>
                <span className={`text-xs ${step.s === 'done' || step.s === 'connected' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {step.l}
                </span>
            </div>

            {/* Actions/Status */}
            {(step.s === 'connect' || step.s === 'connected') && step.l !== "Generate Report" && (
                <button
                    onClick={(e) => { e.stopPropagation(); step.a(); }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${step.s === 'connected' ? 'text-slate-500 bg-white/5 border-white/5 hover:bg-white/10 hover:text-white' : 'text-white bg-violet-600 border-violet-600 hover:bg-violet-700'}`}
                >
                    {step.s === 'connected' ? 'Disconnect' : step.s === 'done' ? 'Edit' : 'Connect'}
                </button>
            )}

            {/* Generate Report: when done, show clickable link to report */}
            {step.l === "Generate Report" && step.s === 'done' && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate('report'); }}
                    className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 px-2 py-0.5 rounded transition-colors"
                >
                    View
                </button>
            )}

            {/* Logic for Coaching Preferences Edit Button */}
            {step.l === "Coaching Preferences" && step.s === 'done' && (
                <button
                    onClick={(e) => { e.stopPropagation(); step.a(); }}
                    className="text-[10px] font-bold text-slate-500 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white px-2 py-0.5 rounded transition-colors"
                >
                    Edit
                </button>
            )}

            {step.s === 'in-dev' && <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">In Dev</span>}
        </div>
    );

    return (
        <>
            {/* Backdrop for screens < xl */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`w-[280px] lg:w-[340px] bg-[#080C14] border-l border-white/5 flex flex-col fixed right-0 top-0 h-screen overflow-y-auto premium-scrollbar z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                {/* Mobile Close Button */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg z-50 transition-colors">
                        <X size={16} />
                    </button>
                )}

                {/* My Plan / Upgrade Card — hidden for Pro users */}
                {!isDemoMode && (
                    <div className="p-4 xl:p-6 pb-2">
                        <Card className="bg-gradient-to-b from-[#1E1B4B] to-[#0F1623] border-violet-500/20 group hover:border-violet-500/40 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)]">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Zap size={64} className="text-violet-500 rotate-12" /></div>
                            <div className="flex justify-between mb-2 xl:mb-3 relative z-10"><span className="text-[10px] xl:text-xs font-bold text-violet-300 uppercase tracking-widest">My Plan</span><Badge type="plan" label="Free" className="hover-glow-violet-strong" /></div>
                            <h3 className="text-base xl:text-lg font-bold text-white mb-1 relative z-10 group-hover:text-violet-300 transition-colors">Get Matched & Trained</h3>
                            <p className="text-[10px] xl:text-xs text-violet-200/70 mb-4 xl:mb-5 leading-relaxed relative z-10">Unlock detailed reports, 4 live group classes/mo, and personalized coach matching.</p>
                            <Button fullWidth themeColor={theme.color} className="relative z-10 transition-transform duration-300 group-hover:scale-[1.02] hover-glow-violet-strong" onClick={onUpgradeClick}>Upgrade to Pro</Button>
                        </Card>
                    </div>
                )}

                {(activeTab === 'report' || activeTab === 'openings') && isConnected ? (
                    // --- REPORT CONTEXT PANEL ---
                    <div className="flex flex-col h-full animate-in fade-in">
                        {/* Sub-tabs for Right Panel */}
                        <div className="flex border-b border-white/5 px-4 xl:px-6 pt-4 shrink-0">
                            {[
                                { id: 'insights', label: 'Insights', icon: Lightbulb },
                                { id: 'ai', label: 'AI Coach', icon: BrainCircuit }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setReportContextTab(tab.id as any)}
                                    className={`flex-1 pb-3 text-xs xl:text-sm font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${reportContextTab === tab.id
                                        ? 'border-violet-500 text-white'
                                        : 'border-transparent text-slate-400 hover:text-slate-200'
                                        }`}
                                    style={{ borderColor: reportContextTab === tab.id ? theme.color : undefined }}
                                >
                                    <tab.icon size={14} /> <span className="hidden xl:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-4 xl:p-6 flex-1">
                            {reportContextTab === 'insights' && (() => {
                                // Dynamic: radar slice selected
                                const SLICE_INSIGHTS: Record<string, { title: string; desc: string; color: string; Icon: any; bgLight: string; borderHover: string; buttonColor: string; action: string }> = {
                                    opening: { Icon: BookOpen, title: 'Opening Phase', desc: 'Solid preparation — you follow book moves well. Focus on aggressive continuations to convert your preparation into an advantage.', color: 'text-violet-400', bgLight: 'bg-violet-500/10', borderHover: 'hover:border-violet-500/30', buttonColor: 'violet', action: 'Study Italian Game Plans' },
                                    tactics: { Icon: Target, title: 'Tactics', desc: 'Missing 2-move tactical sequences under pressure. Daily puzzles targeting pins and forks will noticeably improve this score.', color: 'text-blue-400', bgLight: 'bg-blue-500/10', borderHover: 'hover:border-blue-500/30', buttonColor: 'blue', action: 'Tactics Training' },
                                    endgame: { Icon: Crown, title: 'Endgame', desc: 'Your biggest weakness. Poor rook endgame technique is costing you +1 material advantage repeatedly.', color: 'text-emerald-400', bgLight: 'bg-emerald-500/10', borderHover: 'hover:border-emerald-500/30', buttonColor: 'emerald', action: 'Join Rook Endgames Group' },
                                    advantage: { Icon: Trophy, title: 'Advantage Conversion', desc: 'Good at converting, but occasional blunders in +5 positions. Simplifying the position is key.', color: 'text-rose-400', bgLight: 'bg-rose-500/10', borderHover: 'hover:border-rose-500/30', buttonColor: 'rose', action: 'Review Winning Games' },
                                    time: { Icon: Clock, title: 'Time Management', desc: 'Averaging less than 30s for the last 15 moves. Speed up your opening play to preserve clock time.', color: 'text-amber-400', bgLight: 'bg-amber-500/10', borderHover: 'hover:border-amber-500/30', buttonColor: 'amber', action: 'Time Mgmt Workshop' },
                                    resourcefulness: { Icon: Shield, title: 'Resourcefulness', desc: 'Excellent defense — you save 30% of theoretically losing positions. Keep playing tricky lines.', color: 'text-cyan-400', bgLight: 'bg-cyan-500/10', borderHover: 'hover:border-cyan-500/30', buttonColor: 'cyan', action: 'Keep It Up!' },
                                };

                                // Dynamic: widget hint
                                const WIDGET_HINTS: Record<string, { title: string; desc: string; action: string; trainingTitle: string; wTitle: string; wDesc: string; sTitle: string; sDesc: string; }> = {
                                    radar: { title: 'About: Performance Radar', desc: 'A holistic overview of your chess skills derived from your recent games. The farther out a slice reaches, the closer you are to mastery in that specific area.', action: 'Focus training on your lowest score.', trainingTitle: 'General Game Review', wTitle: 'Consistency', wDesc: 'Performance drops significantly after 3 games.', sTitle: 'Opening Accuracy', sDesc: 'You play the first 10 moves perfectly.' },
                                    rating: { title: 'About: Rating Dynamics', desc: 'This chart displays your official rating progression over time. Identify periods of rapid growth and study the matches played during those peaks.', action: 'Review games from your best months.', trainingTitle: 'Psychology & Tilt Control', wTitle: 'Tilt Management', wDesc: 'Rating drops are followed by rapid consecutive losses.', sTitle: 'Peak Performance', sDesc: 'High win streaks during weekends.' },
                                    opponents: { title: 'About: Top Opponents', desc: 'These are the players you faced most often. A negative rating delta means you lost rating points against them overall — a sign they may exploit your weaknesses.', action: 'Study your losses versus these players.', trainingTitle: 'Defending Against Attacks', wTitle: 'Handling Aggression', wDesc: 'You struggle against lower-rated aggressive players.', sTitle: 'Positional Play', sDesc: 'You consistently outplay solid, positional opponents.' },
                                    openings: { title: 'About: Most Played Openings', desc: 'ECO codes classify openings by move order. Low winrate openings (< 50%) are strong candidates to drop from your repertoire.', action: 'Visit Opening Lab for repertoire help.', trainingTitle: 'Opening Repertoire Lab', wTitle: 'Unprepared Lines', wDesc: 'Winrate drops significantly in complex variations.', sTitle: 'Mainline Knowledge', sDesc: 'Excellent results in your primary repertoire.' },
                                    openings_white: { title: 'About: White Repertoire', desc: 'These are your most frequented openings as White. Consistent winrates here indicate solid preparation. If you see high loss rates, consider switching your first move.', action: 'Refine your main White weapon.', trainingTitle: 'White Initiative Coaching', wTitle: 'Losing the Advantage', wDesc: 'Allowing Black to equalize too early in the opening.', sTitle: 'First-Move Pressure', sDesc: 'Consistently securing space advantage from move 1.' },
                                    openings_black: { title: 'About: Black Repertoire', desc: 'These are your favorite defenses as Black. Black repertoires are often reactive; study the lines where your winrate drops significantly.', action: 'Strengthen your Black defenses.', trainingTitle: 'Defensive Repertoire Lab', wTitle: 'Passive Positions', wDesc: 'Struggling to create counterplay in cramped positions.', sTitle: 'Solid Defense', sDesc: 'Very hard to break down in your main systems.' },
                                    activity: { title: 'About: Activity Heatmap', desc: 'Brightness indicates game volume. Color indicates performance (Emerald = Good, Rose = Poor). Use the stacked bars and "By Hour" view to discover your peak performance windows.', action: 'Play more games during your peak hours.', trainingTitle: 'Routine & Discipline Coaching', wTitle: 'Fatigue Blunders', wDesc: 'High blunder rate observed during long sessions.', sTitle: 'Peak Focus', sDesc: 'Excellent tactical vision during optimal hours.' },
                                    timecontrols: { title: 'About: Time Controls', desc: 'Elo Estimate is our proprietary calculation based on your performance. It may differ from your official rating.', action: 'Focus on your primary time control first.', trainingTitle: 'Time Management Workshop', wTitle: 'Clock Pressure', wDesc: 'Severe accuracy drop when under 30 seconds.', sTitle: 'Steady Pacing', sDesc: 'Excellent move time consistency in Rapid.' },
                                    opening_success_rate: { title: 'About: Opening Success Rate', desc: 'This widget compares your win rates across openings by ECO code, split by side. Openings below 45% winrate are strong candidates for replacement or dedicated study.', action: 'Focus on your weakest opening first.', trainingTitle: 'Opening Repertoire Lab', wTitle: 'Low-Winrate Lines', wDesc: 'Openings with sub-45% success rate draining your rating.', sTitle: 'Dominant Weapons', sDesc: 'Consistent 60%+ winrate in your main repertoire.' },
                                };


                                if (reportActiveSlice && SLICE_INSIGHTS[reportActiveSlice]) {
                                    const s = SLICE_INSIGHTS[reportActiveSlice];
                                    const Icon = s.Icon;
                                    return (
                                        <div className="space-y-4 animate-in fade-in pb-4">
                                            <div className="bg-[#080C14] border border-amber-500/10 rounded-xl p-5 relative overflow-hidden group shadow-[0_5px_20px_-5px_rgba(245,158,11,0.05)] hover-glow-amber-strong shrink-0 cursor-default transition-all duration-300 hover:border-amber-500/30">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[100px] pointer-events-none" />
                                                <div className="relative z-10 flex gap-3">
                                                    <Icon size={20} className={`mt-0.5 shrink-0 ${s.color}`} />
                                                    <div className="w-full">
                                                        <div className={`text-[12px] xl:text-[13px] font-bold uppercase tracking-wider mb-2 text-slate-400`}>
                                                            {s.title}
                                                        </div>
                                                        <div className="text-xs font-medium text-slate-200 leading-relaxed mb-6 group-hover:text-white transition-colors">
                                                            {s.desc}
                                                        </div>

                                                        <div className="pt-4 border-t border-white/5 mt-2">
                                                            <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-wider mb-2">Recommended Action</div>
                                                            <div className="text-sm font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">{s.action}</div>
                                                            <Button size="sm" themeColor="amber" fullWidth onClick={() => onNavigate('coaching')} className="font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 hover-glow-amber-strong text-[#080C14]">
                                                                Find a Coach
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {onClearInsight && (
                                                <Button size="sm" variant="secondary" fullWidth onClick={onClearInsight} className="mt-4 text-xs font-medium border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white hover-glow-white-strong transition-all duration-300">
                                                    Back to General Insights
                                                </Button>
                                            )}
                                        </div>
                                    );
                                }

                                if (reportWidgetHint && WIDGET_HINTS[reportWidgetHint]) {
                                    const h = WIDGET_HINTS[reportWidgetHint];
                                    let dynamicDesc = h.desc;
                                    let dynamicAction = h.action;

                                    if (reportWidgetHint === 'activity' && reportWidgetData) {
                                        const { bestHour, bestWR, worstHour, worstWR } = reportWidgetData;
                                        if (bestHour !== null) {
                                            const formatHour = (hr: number) => {
                                                if (hr === 0) return '12 AM';
                                                if (hr === 12) return '12 PM';
                                                return hr < 12 ? `${hr} AM` : `${hr - 12} PM`;
                                            };
                                            dynamicDesc = `Your absolute peak performance window is ${formatHour(bestHour)} - ${formatHour(bestHour + 1)} with a rigorous ${bestWR}% win rate. `;
                                            if (worstHour !== null && worstHour !== bestHour) {
                                                dynamicDesc += `Conversely, you struggle heavily around ${formatHour(worstHour)} - ${formatHour(worstHour + 1)} (only ${worstWR}% win rate).`;
                                            }
                                            dynamicAction = `Prioritize playing ranked games near ${formatHour(bestHour)} and take a break around ${formatHour(worstHour)}.`;
                                        }
                                    }

                                    return (
                                        <div className="space-y-4 animate-in fade-in pb-4">
                                            {/* Box 1: About */}
                                            <div className="bg-[#080C14] border border-violet-500/30 rounded-xl p-5 relative overflow-hidden group shadow-[0_5px_20px_-5px_rgba(139,92,246,0.15)] hover-glow-violet-strong shrink-0 cursor-default">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-bl-[100px] pointer-events-none" />
                                                <div className="flex gap-3 relative z-10">
                                                    <Lightbulb size={20} className="mt-0.5 shrink-0 text-violet-400" />
                                                    <div>
                                                        <div className="text-[13px] font-bold text-violet-400 mb-1.5">{h.title}</div>
                                                        <div className="text-xs font-medium text-slate-200 leading-relaxed">{dynamicDesc}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Box 2: Strengths & Weaknesses */}
                                            <div className="bg-[#080C14] border border-white/5 rounded-xl p-5 relative overflow-hidden shrink-0 cursor-default shadow-lg">
                                                <div className="space-y-3">
                                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg group/sub cursor-default hover-glow-red-strong">
                                                        <div className="text-[10px] font-bold text-red-500/80 uppercase tracking-wider mb-1">Top Weakness</div>
                                                        <div className="text-sm font-bold text-white mb-1 group-hover/sub:text-red-300 transition-colors">{h.wTitle}</div>
                                                        <div className="text-xs text-slate-400 group-hover/sub:text-slate-300 transition-colors">{h.wDesc}</div>
                                                    </div>
                                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg group/sub cursor-default hover-glow-emerald-strong">
                                                        <div className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-wider mb-1">Top Strength</div>
                                                        <div className="text-sm font-bold text-white mb-1 group-hover/sub:text-emerald-300 transition-colors">{h.sTitle}</div>
                                                        <div className="text-xs text-slate-400 group-hover/sub:text-slate-300 transition-colors">{h.sDesc}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Box 3: Recommended Training */}
                                            <div className="bg-[#080C14] border border-amber-500/20 rounded-xl p-5 relative overflow-hidden group shadow-lg shrink-0 cursor-default transition-all duration-300 hover:border-amber-500/40 hover-glow-amber-strong">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] pointer-events-none" />
                                                <div className="relative z-10">
                                                    <h3 className={DASHBOARD_FONTS.label + " mb-3 text-amber-500"}>Recommended Training</h3>
                                                    <div className="text-[13px] font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">{h.trainingTitle}</div>
                                                    <div className="text-xs font-medium text-slate-400 leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">{dynamicAction}</div>
                                                    <Button size="sm" themeColor="amber" fullWidth onClick={() => onNavigate('coaching')} className="font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 hover-glow-amber-strong text-[#080C14]">Find a Coach</Button>
                                                </div>
                                            </div>

                                            {onClearInsight && (
                                                <Button size="sm" variant="secondary" fullWidth onClick={onClearInsight} className="mt-4 text-xs font-medium border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white hover-glow-white-strong transition-all duration-300">
                                                    Back to General Insights
                                                </Button>
                                            )}
                                        </div>
                                    );
                                }

                                // Default: static insights based on active tab
                                if (activeTab === 'openings' || reportActiveTab === 'openings') {
                                    return (
                                        <div className="space-y-6">
                                            <div className="flex flex-col h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border border-white/5 rounded-xl p-5 relative overflow-hidden group shadow-lg">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.03),transparent_60%)] pointer-events-none" />

                                                <div className="flex items-center gap-2 mb-5 relative z-10">
                                                    <AlertCircle size={18} className="text-red-400" />
                                                    <h3 className="text-sm font-bold text-white tracking-tight">Common Early Mistakes</h3>
                                                </div>

                                                <div className="space-y-3 relative z-10">
                                                    {[
                                                        { title: 'Premature Queen Attacks', severity: 'Critical', badge: 'high', frequency: '18% of games', icon: Zap, desc: 'Bringing the queen out before minor pieces are developed.' },
                                                        { title: 'Missed Development', severity: 'Warning', badge: 'medium', frequency: '24% of games', icon: ShieldAlert, desc: 'Moving the same piece twice in the first 10 moves.' },
                                                        { title: 'King Safety', severity: 'Crucial', badge: 'high', frequency: '12% of games', icon: AlertTriangle, desc: 'Delaying castling past move 12 in open positions.' },
                                                    ].map((mistake, idx) => {
                                                        const Icon = mistake.icon;
                                                        const isCritical = mistake.badge === 'high';
                                                        const glowClass = isCritical ? 'hover-glow-red-strong' : 'hover-glow-amber-strong';
                                                        const borderClass = isCritical ? 'border-red-500/10 hover:border-red-500/30' : 'border-amber-500/10 hover:border-amber-500/30';
                                                        const bgClass = isCritical ? 'bg-red-500/5' : 'bg-amber-500/5';
                                                        const textHoverClass = isCritical ? 'group-hover/item:text-red-300' : 'group-hover/item:text-amber-300';

                                                        return (
                                                            <div key={idx} className={`${bgClass} border ${borderClass} rounded-xl p-4 transition-all duration-300 flex items-start gap-4 group/item cursor-default ${glowClass}`}>
                                                                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 mt-0.5 shadow-inner">
                                                                    <Icon size={14} className={isCritical ? 'text-red-400' : 'text-amber-400'} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between mb-1.5">
                                                                        <h4 className={`font-bold text-white text-xs transition-colors duration-300 ${textHoverClass}`}>{mistake.title}</h4>
                                                                        <Badge type={mistake.badge as any} label={mistake.severity} />
                                                                    </div>
                                                                    <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed group-hover/item:text-slate-300 transition-colors duration-300">{mistake.desc}</p>
                                                                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                                        Occurs in <span className="text-slate-300">{mistake.frequency}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Recommended Training */}
                                            <div className="bg-[#080C14] border border-amber-500/20 rounded-xl p-5 relative overflow-hidden group shadow-lg shrink-0 cursor-default transition-all duration-300 hover:border-amber-500/40 hover-glow-amber-strong">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] pointer-events-none" />
                                                <div className="relative z-10">
                                                    <h3 className={DASHBOARD_FONTS.label + " mb-3 text-amber-500"}>Recommended Training</h3>
                                                    <div className="text-[13px] font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">Opening Repertoire Lab</div>
                                                    <div className="text-xs font-medium text-slate-400 leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">Refine your repertoire and fix early mistakes.</div>
                                                    <Button size="sm" themeColor="amber" fullWidth onClick={() => onNavigate('coaching')} className="font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 hover-glow-amber-strong text-[#080C14]">Find a Coach</Button>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-slate-600 text-center">Click a table row to see specific insights</p>
                                        </div>
                                    );
                                }

                                // Fallback to Dashboard/Overview Tab Default
                                return (
                                    <div className="space-y-6">
                                        <div className="flex flex-col h-full bg-gradient-to-br from-[#0F1623] to-[#0B1220] border border-white/5 rounded-xl p-5 relative overflow-hidden group shadow-lg">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.03),transparent_60%)] pointer-events-none" />

                                            <div className="flex items-center gap-2 mb-5 relative z-10">
                                                <AlertCircle size={18} className="text-red-400" />
                                                <h3 className="text-sm font-bold text-white tracking-tight">Areas to Improve</h3>
                                            </div>

                                            <div className="space-y-3 relative z-10">
                                                {[
                                                    { title: 'Time Mgmt (Endgame)', severity: 'Critical', badge: 'high', frequency: '32% OF GAMES', icon: Clock, desc: 'Low clock leads to 3x more blunders.' },
                                                    { title: 'Missed Tactics', severity: 'Warning', badge: 'medium', frequency: '24% OF GAMES', icon: Target, desc: 'Overlooking 2-move pins (+4 avg eval loss).' },
                                                    { title: 'King Safety', severity: 'Crucial', badge: 'high', frequency: '12% OF GAMES', icon: ShieldAlert, desc: 'Delaying castling past move 12 in open positions.' },
                                                ].map((mistake, idx) => {
                                                    const Icon = mistake.icon;
                                                    const isCritical = mistake.badge === 'high';
                                                    const glowClass = isCritical ? 'hover-glow-red-strong' : 'hover-glow-amber-strong';
                                                    const borderClass = isCritical ? 'border-red-500/10 hover:border-red-500/30' : 'border-amber-500/10 hover:border-amber-500/30';
                                                    const bgClass = isCritical ? 'bg-red-500/5' : 'bg-amber-500/5';
                                                    const textHoverClass = isCritical ? 'group-hover/item:text-red-300' : 'group-hover/item:text-amber-300';

                                                    return (
                                                        <div key={idx} className={`${bgClass} border ${borderClass} rounded-xl p-4 transition-all duration-300 flex items-start gap-4 group/item cursor-default ${glowClass}`}>
                                                            <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 mt-0.5 shadow-inner">
                                                                <Icon size={14} className={isCritical ? 'text-red-400' : 'text-amber-400'} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-start justify-between mb-1.5">
                                                                    <h4 className={`font-bold text-white text-xs transition-colors duration-300 ${textHoverClass}`}>{mistake.title}</h4>
                                                                    <Badge type={mistake.badge as any} label={mistake.severity} />
                                                                </div>
                                                                <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed group-hover/item:text-slate-300 transition-colors duration-300">{mistake.desc}</p>
                                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                                    OCCURS IN <span className="text-slate-300">{mistake.frequency}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Recommended Training */}
                                        <div className="bg-[#080C14] border border-amber-500/20 rounded-xl p-5 relative overflow-hidden group shadow-lg shrink-0 cursor-default transition-all duration-300 hover:border-amber-500/40 hover-glow-amber-strong">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] pointer-events-none" />
                                            <div className="relative z-10">
                                                <h3 className={DASHBOARD_FONTS.label + " mb-3 text-amber-500"}>Recommended Training</h3>
                                                <div className="text-[13px] font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">Group: Time Management</div>
                                                <div className="text-xs font-medium text-slate-400 leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">Fix your biggest leak.</div>
                                                <Button size="sm" themeColor="amber" fullWidth onClick={() => onNavigate('coaching')} className="font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 hover-glow-amber-strong text-[#080C14]">Find a Coach</Button>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-slate-600 text-center">Click a table row to see specific insights</p>
                                    </div>
                                );
                            })()}

                            {reportContextTab === 'ai' && (
                                <div className={`flex flex-col h-full relative ${!isDemoMode ? 'opacity-60 pointer-events-none' : ''}`}>
                                    {!isDemoMode && <Badge type="locked" label="Pro Feature" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-xl bg-black" />}
                                    <div className={`flex-1 bg-white/5 rounded-xl border border-white/10 p-4 mb-4 flex flex-col justify-end gap-3 ${!isDemoMode ? 'blur-[2px]' : ''}`}>
                                        <div className="bg-white/10 rounded-xl rounded-tl-none p-3 text-sm text-slate-300 self-start max-w-[85%]">
                                            Hi! I see you struggle with the clock. Want me to generate a summary of your time usage in the opening?
                                        </div>
                                        <div className="bg-violet-500/20 rounded-xl rounded-tr-none p-3 text-sm text-white self-end max-w-[85%]">
                                            Yes please.
                                        </div>
                                    </div>
                                    <div className={`relative ${!isDemoMode ? 'blur-[2px]' : ''}`}>
                                        <input type="text" placeholder="Ask AI..." disabled={!isDemoMode} className="w-full bg-[#080C14] border border-white/10 rounded px-10 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                                        <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                    </div>
                                </div>
                            )}

                            {reportContextTab === 'filters' && (
                                <div className={`relative ${!isDemoMode ? 'opacity-60 pointer-events-none' : ''}`}>
                                    {!isDemoMode && <Badge type="locked" label="Pro Feature" className="absolute top-1/4 left-1/2 -translate-x-1/2 z-10 shadow-xl bg-black" />}
                                    <div className={`space-y-6 ${!isDemoMode ? 'blur-[2px]' : ''}`}>
                                        <div>
                                            <h3 className={DASHBOARD_FONTS.label + " mb-3"}>Time Control</h3>
                                            <div className="space-y-2">
                                                {['Bullet', 'Blitz', 'Rapid', 'Classical'].map(tc => (
                                                    <label key={tc} className={`flex items-center gap-2 text-sm ${!isDemoMode ? 'text-slate-400' : 'text-slate-300 cursor-pointer hover:text-white'}`}>
                                                        <input type="checkbox" defaultChecked={tc === 'Rapid'} disabled={!isDemoMode} className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500" /> {tc}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className={DASHBOARD_FONTS.label + " mb-3"}>Platform</h3>
                                            <div className="space-y-2">
                                                {['Chess.com', 'Lichess'].map(p => (
                                                    <label key={p} className={`flex items-center gap-2 text-sm ${!isDemoMode ? 'text-slate-400' : 'text-slate-300 cursor-pointer hover:text-white'}`}>
                                                        <input type="checkbox" defaultChecked disabled={!isDemoMode} className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500" /> {p}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // --- DEFAULT SETUP/HOME LAYOUT ---
                    <>
                        {/* Setup Checklist */}
                        <div className="p-4 xl:p-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className={DASHBOARD_FONTS.label}>Setup Checklist</span>
                                <span className="text-[10px] text-slate-600">{completedSteps}/{totalSteps}</span>
                            </div>
                            <ProgressBar current={completedSteps} max={totalSteps} color={theme.color} />
                            <div className="space-y-1">
                                {connectorSteps.map((step, i) => renderStep(step, i))}
                                {nextSteps.map((step, i) => renderStep(step, i + connectorSteps.length))}
                            </div>

                            {/* In Development section — separated visually */}
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <span className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">Coming Soon</span>
                                <div className="space-y-1 mt-2">
                                    {inDevSteps.map((step, i) => renderStep(step, i + allWorkingSteps.length))}
                                </div>
                            </div>
                        </div>

                        {/* Recommended Groups */}
                        <div className="p-4 xl:p-6 pt-0">
                            <div className={DASHBOARD_FONTS.label + " mb-3"}>Recommended Groups</div>
                            <div className="space-y-2 xl:space-y-3">
                                {[
                                    { n: 'Rook Endgames', d: 'Tue 19:00', p: 2, m: 4, l: 'IM' },
                                    { n: 'Sicilian Defense', d: 'Starts in 2h', p: 3, m: 4, l: 'GM' }
                                ].map((g, i) => (
                                    <Card key={i} className="p-3 hover:border-violet-500/30 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2"><span className="font-bold text-sm text-white">{g.n}</span><Badge type="level" label={g.l} /></div>
                                                <div className="text-[10px] text-slate-500 mt-0.5">{g.d}</div>
                                            </div>
                                        </div>
                                        <div className="flex itemcenter justify-between">
                                            <ProgressBar current={g.p} max={g.m} color={theme.color} />
                                            <Button size="sm" variant="secondary" fullWidth={false} onClick={onJoinCoaching}>{g.p >= g.m ? 'Waitlist' : 'Join'}</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Hidden file input for PGN upload */}
                <input type="file" ref={fileInputRef} className="hidden" accept=".pgn" onChange={() => setPgnUploaded(true)} />
            </aside>
        </>
    );
};
export default RightPanel;
