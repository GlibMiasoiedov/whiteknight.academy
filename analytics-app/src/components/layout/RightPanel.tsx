import React, { useRef } from 'react';
import { CheckCircle, Lock, Zap } from 'lucide-react';
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
}

const RightPanel: React.FC<RightPanelProps> = ({ connections, openManualInputs, theme, onUpgradeClick, isDemoMode, onNavigate, toggleConnection, openModal, isMatchSettingsSet, hasJoinedCoaching, onJoinCoaching, pgnUploaded, setPgnUploaded }) => {
    const isConnected = Object.values(connections).some(Boolean);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        <aside className="w-[280px] xl:w-[340px] bg-[#080C14] border-l border-white/5 flex flex-col fixed right-0 top-0 h-screen overflow-y-auto no-scrollbar z-20">
            {/* My Plan / Upgrade Card — hidden for Pro users */}
            {!isDemoMode && (
                <div className="p-4 xl:p-6 pb-2">
                    <Card className="bg-gradient-to-b from-[#1E1B4B] to-[#0F1623] border-violet-500/20 group hover:border-violet-500/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Zap size={64} className="text-violet-500 rotate-12" /></div>
                        <div className="flex justify-between mb-2 xl:mb-3 relative z-10"><span className="text-[10px] xl:text-xs font-bold text-violet-300 uppercase tracking-widest">My Plan</span><Badge type="plan" label="Free" /></div>
                        <h3 className="text-base xl:text-lg font-bold text-white mb-1 relative z-10">Get Matched & Trained</h3>
                        <p className="text-[10px] xl:text-xs text-violet-200/70 mb-4 xl:mb-5 leading-relaxed relative z-10">Unlock detailed reports, 4 live group classes/mo, and personalized coach matching.</p>
                        <Button fullWidth themeColor={theme.color} className="relative z-10" onClick={onUpgradeClick}>Upgrade to Pro</Button>
                    </Card>
                </div>
            )}



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

            {/* Hidden file input for PGN upload */}
            <input type="file" ref={fileInputRef} className="hidden" accept=".pgn" onChange={() => setPgnUploaded(true)} />
        </aside>
    );
};
export default RightPanel;
