import React, { useRef } from 'react';
import {
    Zap, Target, Upload, Link as LinkIcon, CheckCircle, Lock, ExternalLink
} from 'lucide-react';
import { ChessComLogo, LichessLogo, MasterDBLogo } from '../ui/Logos';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { FONTS } from '../../constants/theme';

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
}

const RightPanel: React.FC<RightPanelProps> = ({ connections, openManualInputs, theme, onUpgradeClick, isDemoMode, setDemoMode, onNavigate, toggleConnection, openModal, isMatchSettingsSet, hasJoinedCoaching, onJoinCoaching }) => {
    const isConnected = Object.values(connections).some(Boolean);
    const fileInputRef = useRef<HTMLInputElement>(null);



    // Checklist Logic
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
            l: <div className="flex items-center gap-2"><MasterDBLogo size={14} variant="glyph" /> Masters DB</div>,
            s: connections.masterDb ? 'connected' : 'connect',
            a: () => connections.masterDb ? toggleConnection('masterDb') : openModal('masterDb')
        },
        {
            l: "Upload PGN",
            s: 'connect', // Changed from optional to connect
            a: () => fileInputRef.current?.click()
        },
        {
            l: "Health & Stress",
            s: 'in-dev', // New status
            a: () => { } // No action
        }
    ];

    const nextSteps = [
        {
            l: "Match Settings",
            s: isMatchSettingsSet ? 'done' : 'connect',
            a: openManualInputs
        },
        {
            l: "Generate Report",
            s: isDemoMode ? 'done' : 'connect',
            a: () => setDemoMode(true) // Should be implicit? Keeping action for now
        },
        {
            l: "Join a Group / Find Coach",
            s: hasJoinedCoaching ? 'done' : 'connect',
            a: () => onNavigate('coaching')
        }
    ];

    const completedSteps = [...connectorSteps, ...nextSteps].filter(s => s.s === 'done' || s.s === 'connected').length;
    const totalSteps = connectorSteps.length + nextSteps.length;

    const renderStep = (step: any, i: number) => (
        <div key={i} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${step.s === 'connect' && step.l !== 'Generate Report' ? 'hover:bg-white/5 cursor-pointer' : ''}`} onClick={step.s === 'connect' && step.l !== 'Generate Report' ? step.a : undefined}>
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

            {/* Logic for Match Settings Edit Button */}
            {step.l === "Match Settings" && step.s === 'done' && (
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
        <aside className="w-[340px] bg-[#080C14] border-l border-white/5 flex flex-col fixed right-0 top-0 h-screen overflow-y-auto no-scrollbar z-20">
            {/* My Plan / Upgrade Card */}
            <div className="p-6 pb-2">
                <Card className="bg-gradient-to-b from-[#1E1B4B] to-[#0F1623] border-violet-500/20 group hover:border-violet-500/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Zap size={64} className="text-violet-500 rotate-12" /></div>
                    <div className="flex justify-between mb-3 relative z-10"><span className="text-xs font-bold text-violet-300 uppercase tracking-widest">My Plan</span><Badge type="plan" label="Free" /></div>
                    <h3 className="text-lg font-bold text-white mb-1 relative z-10">Get Matched & Trained</h3>
                    <p className="text-xs text-violet-200/70 mb-5 leading-relaxed relative z-10">Unlock detailed reports, 4 live group classes/mo, and personalized coach matching.</p>
                    <Button fullWidth themeColor={theme.color} className="relative z-10" onClick={onUpgradeClick}>Upgrade to Pro</Button>
                </Card>
            </div>

            {/* Quick Actions (Condensed) */}
            <div className="px-6 py-4 border-b border-white/5">
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => openModal('chessCom')} title="Connect Sources">
                        <LinkIcon size={14} className="mr-1" /> Connect
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => fileInputRef.current?.click()} title="Upload PGN">
                        <Upload size={14} className="mr-1" /> PGN
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pgn" onChange={(e) => { if (e.target.files?.length) alert('PGN Upload stub'); }} />
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => openManualInputs(true)} style={{ color: theme.color, borderColor: `${theme.color}30` }} title="Match Settings">
                        <Target size={14} className="mr-1 flex-shrink-0" /> Settings
                    </Button>
                </div>
            </div>

            {/* Setup Checklist */}
            <div className="p-6 border-b border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={FONTS.label + " flex items-center gap-2"}><CheckCircle size={14} className={completedSteps > 0 ? "text-emerald-500" : "text-slate-500"} /> Setup Checklist</h3>
                    <span className="text-xs text-slate-500">{completedSteps}/{totalSteps}</span>
                </div>
                <div className="space-y-2">
                    {connectorSteps.map(renderStep)}
                    <div className="border-t border-white/5 my-2"></div>
                    {nextSteps.map(renderStep)}
                </div>
            </div>

            {/* Recommended Groups */}
            <div className="p-6 flex-1">
                <h3 className={FONTS.label + " mb-4"}>Recommended Groups</h3>
                <div className="space-y-3">
                    {[{ t: "Rook Endgames", s: 2, l: "EN", time: "Tue 19:00" }, { t: "Sicilian Defense", s: 3, l: "UA", time: "Starts in 2h" }].map((g, i) => (
                        <div key={i} className="bg-[#0F1623] rounded-xl p-4 border border-white/5 hover:border-white/20 cursor-pointer hover:shadow-lg transition-all group">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-white text-sm group-hover:text-violet-400 transition-colors">{g.t}</span>
                                <span className="text-[10px] bg-white/5 px-1.5 rounded text-slate-400">{g.l}</span>
                            </div>
                            <div className="text-xs text-slate-500 mb-3">{g.time}</div>
                            <div className="flex justify-between items-end gap-4">
                                <div className="text-xs text-slate-500 flex-1">
                                    <div className="flex justify-between mb-1"><span>Seats</span><span className="text-white">{g.s}/4</span></div>
                                    <ProgressBar current={g.s} max={4} color={theme.color} />
                                </div>
                                <Button size="sm" variant={isConnected ? "primary" : "secondary"} themeColor={theme.color} onClick={isConnected ? onJoinCoaching : onUpgradeClick}>{isConnected ? "Join" : "Waitlist"}</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 mt-auto">
                <div className="text-[10px] text-slate-600 flex flex-col gap-2">
                    <p>© 2026 White Knight Academy — White Knight Analytics</p>
                    <div className="flex gap-4">
                        <a href="https://whiteknight.academy/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors flex items-center gap-1">Privacy Policy <ExternalLink size={8} /></a>
                        <a href="https://whiteknight.academy/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors flex items-center gap-1">Terms <ExternalLink size={8} /></a>
                    </div>
                </div>
            </div>
        </aside>
    );
};
export default RightPanel;
