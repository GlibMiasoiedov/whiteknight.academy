import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, FileText, Zap, Users, BookOpen, Trophy,
    Link as LinkIcon, User, Settings, CreditCard, LogOut,
    ChevronDown, Plus, Check, Clock, X, Upload, Activity,
    Lock, RefreshCw, Target, Grid, Calendar, Shield, ExternalLink,
    TrendingUp, AlertTriangle, CheckCircle, PieChart, ArrowUpRight,
    Brain, Sparkles, Command, Crown, Swords, HeartPulse, Sliders,
    ToggleLeft, ToggleRight, HelpCircle, Video, MessageSquare, Mail
} from 'lucide-react';

// --- THEME CONFIGURATION ---

const THEMES = {
    home: { color: '#8B5CF6', label: 'Violet', bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-500/20' },
    report: { color: '#10B981', label: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    coaching: { color: '#F59E0B', label: 'Amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20' },
    training: { color: '#06B6D4', label: 'Cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    integrations: { color: '#EC4899', label: 'Pink', bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500/20' },
};

const FONTS = {
    h1: 'text-2xl font-bold tracking-tight text-white',
    h2: 'text-lg font-semibold tracking-tight text-white',
    label: 'text-[11px] font-bold text-slate-400 uppercase tracking-wider',
    body: 'text-sm font-medium text-slate-400 leading-relaxed',
    kpi: 'text-3xl font-extrabold tracking-tight text-white',
    logo: 'font-serif text-xl font-bold tracking-tight text-white',
};

// --- UI COMPONENTS ---

const Badge = ({ type = 'medium', label }) => {
    const styles = {
        high: 'bg-red-500/10 text-red-400 border-red-500/20',
        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        neutral: 'bg-slate-800 text-slate-400 border-slate-700',
        plan: 'bg-violet-500/10 text-violet-300 border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.15)]',
        pro: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
        locked: 'bg-slate-800 text-slate-500 border-slate-700',
        connected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${styles[type] || styles.neutral} flex items-center gap-1`}>
            {type === 'locked' && <Lock size={8} />}
            {type === 'connected' && <Check size={8} />}
            {label}
        </span>
    );
};

const Button = ({ variant = 'primary', children, onClick, fullWidth, icon: Icon, themeColor, className = '', disabled = false }) => {
    const baseStyle = "h-10 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";

    let style = {};
    let variantClass = "";

    if (variant === 'primary') {
        const color = themeColor || '#8B5CF6';
        style = { backgroundColor: color };
        variantClass = `text-white shadow-[0_0_20px_-5px_${color}80] hover:brightness-110 border border-white/10`;
    } else if (variant === 'secondary') {
        variantClass = "border border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm";
    } else if (variant === 'ghost') {
        variantClass = "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent";
    } else if (variant === 'gradient') {
        variantClass = "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110";
    }

    return (
        <button
            onClick={onClick}
            style={!disabled ? style : {}}
            disabled={disabled}
            className={`${baseStyle} ${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {Icon && <Icon size={16} className="relative z-10 flex-shrink-0" />}
            <span className="relative z-10">{children}</span>
            {variant === 'primary' && !disabled && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />}
        </button>
    );
};

const Card = ({ children, className = '', padding = 'p-6', onClick, active }) => (
    <div
        onClick={onClick}
        className={`
      relative rounded-xl border bg-[#0F1623] transition-all duration-300 group
      ${active ? 'border-white/20 ring-1 ring-white/10' : 'border-white/5 hover:border-white/10'}
      ${padding} ${className} ${onClick ? 'cursor-pointer hover:shadow-xl hover:bg-[#131C2D]' : ''}
    `}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        {children}
    </div>
);

const ProgressBar = ({ current, max, color }) => (
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]"
            style={{ width: `${Math.min((current / max) * 100, 100)}%`, backgroundColor: color, color: color }}
        />
    </div>
);

// --- RATING CHART SVG ---
const RatingChart = ({ color }) => (
    <div className="w-full h-16 relative overflow-hidden opacity-80">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M0,30 Q10,25 20,28 T40,20 T60,22 T80,10 T100,15" fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M0,30 Q10,25 20,28 T40,20 T60,22 T80,10 T100,15 V40 H0 Z" fill="url(#chartGradient)" />
        </svg>
    </div>
);

// --- MODALS ---

const ProModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-[900px] bg-[#0F1623] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 blur-[100px] pointer-events-none" />
                <div className="relative z-10 grid grid-cols-5 h-full">
                    <div className="col-span-2 bg-[#080C14] p-8 flex flex-col justify-between border-r border-white/5">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Crown size={24} className="text-amber-400" />
                                <span className="text-xl font-bold text-white">Chess Analytics <span className="text-amber-400">PRO</span></span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Master Chess Faster with AI.</h2>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-white">€15</span>
                                <span className="text-slate-500">/ month</span>
                            </div>
                        </div>
                        <div className="space-y-3 mt-8">
                            <Button variant="gradient" fullWidth onClick={onClose} icon={Sparkles}>Upgrade Now</Button>
                            <button onClick={onClose} className="w-full text-xs text-slate-500 hover:text-white transition-colors">Maybe later</button>
                        </div>
                    </div>
                    <div className="col-span-3 p-8 bg-[#0F1623]">
                        <h3 className="text-lg font-bold text-white mb-6">Plan Comparison</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                                <span>Feature</span><span className="text-center">Free</span><span className="text-center text-amber-400">Pro</span>
                            </div>
                            {[
                                { name: 'Unlimited Analysis', free: false, pro: true },
                                { name: 'AI Coach', free: false, pro: true },
                                { name: 'Opening Lab', free: false, pro: true },
                                { name: 'Training Plans', free: 'Basic', pro: 'Personalized' },
                            ].map((f, i) => (
                                <div key={i} className="grid grid-cols-3 items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-sm text-slate-300 font-medium">{f.name}</span>
                                    <div className="flex justify-center">{f.free === false ? <X size={16} className="text-slate-600" /> : <span className="text-xs text-slate-400">{f.free}</span>}</div>
                                    <div className="flex justify-center">{f.pro === true ? <CheckCircle size={16} className="text-amber-400" /> : <span className="text-xs text-amber-400 font-bold">{f.pro}</span>}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManualInputsModal = ({ isOpen, onClose, theme }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-[800px] h-[700px] bg-[#0F1623] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#080C14]">
                    <div>
                        <h2 className="text-xl font-bold text-white">Goals & Preferences</h2>
                        <p className="text-xs text-slate-400">Used for personalization and coach matching.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className={FONTS.label}>Primary Goal</label>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                {['Improve Tactics', 'Openings', 'Endgames', 'Tournament Prep'].map(g => (
                                    <div key={g} className="border border-white/10 rounded-lg p-3 text-sm text-slate-300 hover:bg-white/5 cursor-pointer text-center">{g}</div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={FONTS.label}>Timezone <span className="text-red-400">*</span></label>
                            <select className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500">
                                <option>Europe/Kyiv (GMT+2)</option>
                                <option>US/Pacific</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={FONTS.label}>Current Level</label>
                            <select className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500">
                                <option>Intermediate (1200-1600)</option>
                                <option>Beginner</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={FONTS.label}>Coaching Preference <span className="text-red-400">*</span></label>
                            <div className="flex gap-4 mt-1">
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="radio" name="coach" className="accent-violet-500" /> Group (Max 4)</label>
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="radio" name="coach" className="accent-violet-500" /> Individual</label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={FONTS.label}>Budget Preference</label>
                            <input type="range" className="w-full accent-violet-500" />
                            <div className="flex justify-between text-xs text-slate-500"><span>$10</span><span>$80+</span></div>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className={FONTS.label}>Weekly Availability</label>
                            <div className="bg-[#080C14] border border-white/10 rounded-lg p-4 flex items-center justify-center text-slate-500 text-sm border-dashed h-24 cursor-pointer hover:bg-white/5 transition-colors">
                                <Plus size={16} className="mr-2" /> Add time slot
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-white/5 bg-[#080C14] flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Skip for now</Button>
                    <Button themeColor={theme.color} onClick={onClose}>Save preferences</Button>
                </div>
            </div>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

const Sidebar = ({ activeTab, setActiveTab, theme, userMenuOpen, setUserMenuOpen, onUpgradeClick }) => {
    const navItems = [
        { id: 'home', icon: LayoutDashboard, label: 'Home (Data Hub)' },
        { id: 'report', icon: FileText, label: 'Report' },
        { id: 'training', icon: Trophy, label: 'Training' },
        { id: 'coaching', icon: Users, label: 'Coaching' },
        { id: 'integrations', icon: Grid, label: 'Apps / Integrations' },
    ];

    const aiTools = [
        { id: 'ai-coach', icon: Brain, label: 'AI Coach' },
        { id: 'openings', icon: BookOpen, label: 'Opening Lab' },
    ];

    return (
        <div className="fixed top-0 left-0 h-screen w-[260px] border-r border-white/5 flex flex-col justify-between z-30 bg-[#080C14]">
            <div>
                <div className="h-20 flex items-center px-6 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Command size={18} className="text-white" />
                    </div>
                    <span className={FONTS.logo}>Chess Analytics</span>
                </div>

                <nav className="px-3 space-y-1 mt-6">
                    <div className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Platform</div>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group
                ${activeTab === item.id ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
                        >
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: theme.color, color: theme.color }} />
                            )}
                            <item.icon size={18} className="mr-3 transition-colors" style={{ color: activeTab === item.id ? theme.color : 'currentColor' }} />
                            {item.label}
                        </button>
                    ))}

                    <div className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6 mb-2 flex justify-between items-center">
                        <span>AI Features</span>
                        <Badge type="pro" label="PRO" />
                    </div>
                    {aiTools.map((item) => (
                        <button key={item.id} onClick={onUpgradeClick} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all group">
                            <div className="flex items-center">
                                <item.icon size={18} className="mr-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                                {item.label}
                            </div>
                            <Lock size={12} className="text-slate-700 group-hover:text-slate-500" />
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-white/5 relative">
                <div onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border border-transparent hover:bg-white/5 hover:border-white/5 transition-all duration-200">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-inner border border-white/10">JD</div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">John Doe</div>
                        <div className="text-xs text-slate-400">Free Plan</div>
                    </div>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </div>
                {userMenuOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#0F1623] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
                        <div className="p-1.5 space-y-0.5">
                            {[{ l: 'Settings', i: Settings }, { l: 'Billing', i: CreditCard }, { l: 'Privacy', i: Shield }].map((m, idx) => (
                                <button key={idx} className="w-full flex items-center px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    <m.i size={14} className="mr-3 text-slate-500" /> {m.l}
                                </button>
                            ))}
                            <div className="h-px bg-white/5 my-1" />
                            <button className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><LogOut size={14} className="mr-3" /> Log Out</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const RightPanel = ({ connections, toggleConnection, openManualInputs, theme, onUpgradeClick, isDemoMode }) => {
    const isConnected = Object.values(connections).some(Boolean) || isDemoMode;

    return (
        <div className="fixed top-0 right-0 h-screen w-[340px] border-l border-white/5 overflow-y-auto bg-[#080C14] pb-10">
            <div className="p-6 pb-4 border-b border-white/5">
                <Card className="bg-gradient-to-b from-[#1E1B4B] to-[#0F1623] border-violet-500/20 group hover:border-violet-500/40">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Zap size={64} className="text-violet-500 rotate-12" /></div>
                    <div className="flex justify-between mb-3 relative z-10"><span className="text-xs font-bold text-violet-300 uppercase tracking-widest">My Plan</span><Badge type="plan" label="Free" /></div>
                    <h3 className="text-lg font-bold text-white mb-1 relative z-10">Unlock Full Report</h3>
                    <p className="text-xs text-violet-200/70 mb-5 leading-relaxed relative z-10">Unlimited analysis, AI coach, and access to private study groups.</p>
                    <Button fullWidth themeColor={theme.color} className="relative z-10" onClick={onUpgradeClick}>Upgrade to Pro</Button>
                </Card>
            </div>

            <div className="p-6 border-b border-white/5">
                <h3 className={FONTS.label + " mb-4 flex items-center gap-2"}><Activity size={14} style={{ color: theme.color }} /> Quick Actions</h3>
                <div className="space-y-3">
                    <Button variant="secondary" fullWidth disabled={!isConnected} icon={RefreshCw}>Resync Data</Button>
                    <Button variant="secondary" fullWidth icon={Upload}>Upload PGN</Button>
                    <Button variant="secondary" fullWidth onClick={openManualInputs} style={{ color: theme.color, borderColor: `${theme.color}30` }}>
                        <Target size={14} className="mr-2 flex-shrink-0" /> Goals & Settings
                    </Button>
                </div>
                {!isConnected && <div className="text-xs text-slate-500 mt-2 text-center">Connect a source to enable resync.</div>}
            </div>

            <div className="p-6">
                <h3 className={FONTS.label + " mb-4"}>Recommended Groups</h3>
                <div className="space-y-3">
                    {[{ t: "Rook Endgames", s: 2, l: "EN", time: "Tue 19:00" }, { t: "Sicilian Defense", s: 3, l: "UA", time: "Starts in 2h" }].map((g, i) => (
                        <div key={i} className="bg-[#0F1623] rounded-xl p-4 border border-white/5 hover:border-white/20 cursor-pointer hover:shadow-lg transition-all group">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-white text-sm group-hover:text-violet-400 transition-colors">{g.t}</span>
                                <span className="text-[10px] bg-white/5 px-1.5 rounded text-slate-400">{g.l}</span>
                            </div>
                            <div className="text-xs text-slate-500 mb-3">{g.time}</div>
                            <div className="flex justify-between items-end">
                                <div className="text-xs text-slate-500 flex-1 mr-4">
                                    <div className="flex justify-between mb-1"><span>Seats</span><span className="text-white">{g.s}/4</span></div>
                                    <ProgressBar current={g.s} max={4} color={theme.color} />
                                </div>
                                <button className="text-xs font-bold hover:underline" style={{ color: theme.color }}>{isConnected ? "Join" : "Waitlist"}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- CENTER CONTENT ---

const CenterColumn = ({ connections, toggleConnection, theme, activeTab, onUpgradeClick, isDemoMode, setDemoMode, openManualInputs }) => {
    // Determine if we show State B (Connected/Demo) or State A (Not Connected)
    const isConnected = Object.values(connections).some(Boolean);
    const showStateB = isConnected || isDemoMode;

    // --- HEADER & ACTIVATION ---
    const Header = () => (
        <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className={FONTS.h1 + " mb-1"}>Welcome, John</h1>
                    <p className={FONTS.body}>
                        {showStateB ? "Your stats updated 5m ago. Last analysis: Today." : "Connect your chess accounts to generate your performance report."}
                    </p>
                </div>
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
            </div>

            {/* Activation Stepper (Always Visible) */}
            <Card className="mb-8 border-violet-500/20 bg-gradient-to-r from-[#0F1623] to-[#121826]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Setup Checklist</h3>
                    <span className="text-xs text-slate-500">1/5 Completed</span>
                </div>
                <div className="flex gap-2 mb-6">
                    {[
                        { l: "Connect Chess.com", s: connections.chessCom ? "done" : "current" },
                        { l: "Connect Lichess", s: connections.lichess ? "done" : "pending" },
                        { l: "Upload PGN", s: "pending" },
                        { l: "Set Goals", s: "pending" },
                        { l: "Generate Report", s: showStateB ? "done" : "pending" }
                    ].map((step, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${step.s === 'done' ? 'bg-emerald-500' : step.s === 'current' ? 'bg-violet-500' : 'bg-slate-700'}`} />
                    ))}
                </div>
                <div className="flex gap-3">
                    {!connections.chessCom && <Button size="sm" themeColor={theme.color} onClick={() => toggleConnection('chessCom')}>Connect Chess.com</Button>}
                    {!connections.lichess && <Button size="sm" variant="secondary" onClick={() => toggleConnection('lichess')}>Connect Lichess</Button>}
                    <Button size="sm" variant="secondary" onClick={openManualInputs}>Set goals</Button>
                </div>
            </Card>
        </div>
    );

    // --- TAB CONTENT RENDERING ---
    const renderTabContent = () => {
        switch (activeTab) {
            case 'report':
                return (
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
                            // REPORT STATE B (DEMO/CONNECTED)
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
                            // REPORT STATE A (LOCKED)
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

            case 'training':
                return (
                    <div className="space-y-8 animate-in fade-in">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h1 className={FONTS.h1}>Training Center</h1>
                                <p className={FONTS.body}>{showStateB ? "Sharpen your skills with puzzles, endgames, and lessons." : "Connect data to get your personalized training plan."}</p>
                            </div>
                            {showStateB && <Badge type="plan" label="Personalized" />}
                        </div>

                        {showStateB ? (
                            // TRAINING STATE B (DEMO/CONNECTED)
                            <>
                                <div className="grid grid-cols-4 gap-4">
                                    {[{ l: 'Puzzle Rating', v: '1850', c: 'text-cyan-400' }, { l: 'Streak', v: '5 Days', c: 'text-amber-400' }, { l: 'Lessons', v: '12/40', c: 'text-white' }, { l: 'Accuracy', v: '92%', c: 'text-emerald-400' }].map((s, i) => (
                                        <Card key={i} padding="p-4">
                                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.l}</div>
                                            <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
                                        </Card>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <Card>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Target size={18} className="text-cyan-400" /> Daily Plan</h3>
                                            <span className="text-xs text-slate-500">2/5 Complete</span>
                                        </div>
                                        <div className="space-y-3">
                                            {[{ t: "Warmup Tactics", s: "Complete", i: CheckCircle, c: "text-emerald-500" }, { t: "Rook Endgames", s: "In Progress", i: Activity, c: "text-amber-500" }, { t: "Play 2 Rapid Games", s: "Locked", i: Lock, c: "text-slate-600" }].map((t, i) => (
                                                <div key={i} onClick={t.s === "Locked" ? onUpgradeClick : undefined} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <t.i size={18} className={t.c} />
                                                        <span className={`text-sm font-medium ${t.s === "Locked" ? "text-slate-500" : "text-white"}`}>{t.t}</span>
                                                    </div>
                                                    {t.s === "Locked" ? <Badge type="locked" label="PRO" /> : <ChevronDown size={14} className="-rotate-90 text-slate-600 group-hover:text-white" />}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[{ t: "Opening Lab", d: "Master your repertoire", i: BookOpen, locked: true }, { t: "Vision", d: "Improve board awareness", i: Activity, locked: false }].map((area, i) => (
                                            <Card key={i} onClick={area.locked ? onUpgradeClick : undefined} className="flex items-center gap-4 hover:border-cyan-500/50 cursor-pointer relative overflow-hidden">
                                                <div className={`p-3 rounded-xl ${area.locked ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                                    <area.i size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{area.t}</div>
                                                    <div className="text-xs text-slate-400">{area.d}</div>
                                                </div>
                                                {area.locked && <div className="ml-auto"><Badge type="locked" label="PRO" /></div>}
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            // TRAINING STATE A (LOCKED)
                            <div className="flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mb-6 border border-cyan-500/20">
                                    <Trophy size={32} className="text-cyan-500" />
                                </div>
                                <h2 className={FONTS.h2 + " mb-2"}>Training Plan Locked</h2>
                                <p className={FONTS.body + " max-w-md mb-8"}>We need your game data to create a personalized training plan. Please connect your accounts on the Home screen.</p>
                            </div>
                        )}
                    </div>
                );

            case 'coaching':
                return (
                    <div className="space-y-8 animate-in fade-in">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h1 className={FONTS.h1}>Coaching Hub</h1>
                                <p className={FONTS.body}>{showStateB ? "Find your perfect coach or join a group class." : "Connect data to get personalized coach recommendations."}</p>
                            </div>
                            <Button themeColor={theme.color} icon={Users}>Find a Coach</Button>
                        </div>

                        {showStateB ? (
                            // COACHING STATE B (DEMO/CONNECTED)
                            <div className="grid grid-cols-3 gap-6">
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
                            // COACHING STATE A (LOCKED)
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

            case 'integrations':
                return (
                    <div className="space-y-8 animate-in fade-in">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h1 className={FONTS.h1}>Apps & Integrations</h1>
                                <p className={FONTS.body}>Connect your favorite tools to enhance your experience.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { n: 'Chess.com', i: LinkIcon, d: 'Import games and stats.', s: connections.chessCom ? 'connected' : 'neutral', l: connections.chessCom ? 'Connected' : 'Connect' },
                                { n: 'Lichess', i: LinkIcon, d: 'Import games and stats.', s: connections.lichess ? 'connected' : 'neutral', l: connections.lichess ? 'Connected' : 'Connect' },
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
                                    <Button variant={app.s === 'connected' ? 'secondary' : 'primary'} themeColor={theme.color} fullWidth onClick={app.n === 'Chess.com' ? () => toggleConnection('chessCom') : app.n === 'Lichess' ? () => toggleConnection('lichess') : undefined}>
                                        {app.s === 'connected' ? 'Manage' : 'Connect'}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'home':
            default:
                return (
                    <>
                        {/* STATE A: NOT CONNECTED */}
                        {!showStateB && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <h3 className={FONTS.h2}>Data Sources</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <Card className="hover:border-violet-500/30 group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-[#312e2b] rounded-lg flex items-center justify-center text-white font-bold text-lg border border-white/10">C</div>
                                            <Badge type="neutral" label="Not connected" />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">Chess.com</h3>
                                        <p className="text-xs text-slate-400 mb-4">Import games, ratings, and stats.</p>
                                        <Button fullWidth themeColor={theme.color} onClick={() => toggleConnection('chessCom')}>Connect</Button>
                                    </Card>

                                    <Card className="hover:border-white/20">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg border border-white/10">L</div>
                                            <Badge type="neutral" label="Not connected" />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">Lichess</h3>
                                        <p className="text-xs text-slate-400 mb-4">Secure OAuth sync.</p>
                                        <Button fullWidth variant="secondary" onClick={() => toggleConnection('lichess')}>Connect</Button>
                                    </Card>

                                    <Card className="hover:border-white/20">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-300 border border-white/10"><FileText size={20} /></div>
                                        </div>
                                        <h3 className="text-white font-bold mb-1">Upload PGN</h3>
                                        <p className="text-xs text-slate-400 mb-4">Drop file or paste text.</p>
                                        <Button fullWidth variant="secondary">Upload</Button>
                                    </Card>

                                    <Card className="opacity-60 border-dashed border-white/10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 border border-white/10"><HeartPulse size={20} /></div>
                                            <Badge type="locked" label="Coming Soon" />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">Health & Stress</h3>
                                        <p className="text-xs text-slate-400 mb-4">HR/HRV sync (Beta).</p>
                                        <Button fullWidth variant="ghost" disabled>Join Waitlist</Button>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* STATE B: CONNECTED / DEMO */}
                        {showStateB && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                {/* Value Preview Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={FONTS.h2}>Overview</h3>
                                        <span className="text-xs text-slate-500">These insights update after each sync.</span>
                                    </div>

                                    {/* Row 1: Top Issues (4 cards) */}
                                    <div className="grid grid-cols-4 gap-6 mb-8">
                                        <Card>
                                            <div className={FONTS.label + " mb-2"}>Rating Snapshot</div>
                                            <div className={FONTS.kpi} style={{ color: theme.color }}>1450</div>
                                            <div className="text-xs text-emerald-500 mt-2 flex items-center font-bold"><ArrowUpRight size={12} className="mr-1" /> +12 this week</div>
                                        </Card>
                                        <Card>
                                            <div className={FONTS.label + " mb-3"}>Weakness</div>
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
                                            <div className={FONTS.label + " mb-2"}>Consistency</div>
                                            <div className="text-2xl font-bold text-white">Medium</div>
                                            <div className="text-xs text-slate-500 mt-2">Stable performance</div>
                                        </Card>
                                    </div>

                                    {/* Row 2: Today's Plan */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={FONTS.h2 + " flex items-center gap-2"}><Target size={20} className="text-violet-500" /> Today's Plan</h3>
                                            <span className="text-xs text-slate-500">15 minutes today. Consistency beats intensity.</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6">
                                            {[
                                                { t: "Weak vs Sicilian", d: "Winrate 35% as White.", a: "Review Games" },
                                                { t: "Endgame Blunders", d: "Missed passed pawn opportunities.", a: "Solve Puzzles" },
                                                { t: "Time Trouble", d: "Avg 10s left after move 30.", a: "Play 15+10" }
                                            ].map((item, i) => (
                                                <Card key={i} className="flex flex-col justify-between hover:border-violet-500/30 group">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2"><div className="font-bold text-white group-hover:text-violet-400 transition-colors">{item.t}</div></div>
                                                        <div className="text-sm text-slate-400 mb-6 leading-relaxed">{item.d}</div>
                                                    </div>
                                                    <Button variant="secondary" fullWidth className="group-hover:bg-violet-500/10 group-hover:text-violet-300 group-hover:border-violet-500/20">{item.a}</Button>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Games Preview */}
                                <div>
                                    <h3 className={FONTS.h2 + " mb-4"}>Recent Games {isDemoMode && "(Demo)"}</h3>
                                    <Card padding="p-0">
                                        {[
                                            { o: "Opponent A (1420)", r: "Won", t: "Blitz 5+0", d: "Today" },
                                            { o: "Opponent B (1480)", r: "Lost", t: "Rapid 10+0", d: "Yesterday" },
                                            { o: "Opponent C (1390)", r: "Draw", t: "Blitz 3+2", d: "Yesterday" }
                                        ].map((g, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2 h-2 rounded-full ${g.r === 'Won' ? 'bg-emerald-500' : g.r === 'Lost' ? 'bg-red-500' : 'bg-slate-500'}`} />
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{g.o}</div>
                                                        <div className="text-xs text-slate-500">{g.t} • {g.d}</div>
                                                    </div>
                                                </div>
                                                <div className={`text-sm font-bold ${g.r === 'Won' ? 'text-emerald-400' : g.r === 'Lost' ? 'text-red-400' : 'text-slate-400'}`}>{g.r}</div>
                                            </div>
                                        ))}
                                        <div className="p-2">
                                            <Button variant="ghost" fullWidth onClick={onUpgradeClick}>Open Full Report</Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="ml-[260px] mr-[340px] min-h-screen p-8 bg-[#080C14]">
            <Header />
            {renderTabContent()}
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [proModalOpen, setProModalOpen] = useState(false);
    const [manualInputsOpen, setManualInputsOpen] = useState(false);
    const [connections, setConnections] = useState({ chessCom: false, lichess: false });
    const [isDemoMode, setDemoMode] = useState(false); // New Demo State

    const currentTheme = THEMES[activeTab] || THEMES.home;
    const toggleConnection = (key) => setConnections(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="flex min-h-screen font-sans bg-[#080C14] text-white selection:bg-violet-500/30 selection:text-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>

            <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />
            <ManualInputsModal isOpen={manualInputsOpen} onClose={() => setManualInputsOpen(false)} theme={currentTheme} />

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                theme={currentTheme}
                userMenuOpen={userMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
                onUpgradeClick={() => setProModalOpen(true)}
            />

            <main className="flex-1 w-full relative">
                <CenterColumn
                    connections={connections}
                    toggleConnection={toggleConnection}
                    theme={currentTheme}
                    activeTab={activeTab}
                    onUpgradeClick={() => setProModalOpen(true)}
                    isDemoMode={isDemoMode}
                    setDemoMode={setDemoMode}
                    openManualInputs={() => setManualInputsOpen(true)}
                />
            </main>

            <RightPanel
                connections={connections}
                toggleConnection={toggleConnection}
                openManualInputs={() => setManualInputsOpen(true)}
                viewState={connections.chessCom ? 'B' : 'A'}
                theme={currentTheme}
                onUpgradeClick={() => setProModalOpen(true)}
                isDemoMode={isDemoMode}
            />
        </div>
    );
};

export default App;