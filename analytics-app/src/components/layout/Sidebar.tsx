import React from 'react';
import {
    LayoutDashboard, FileText, Users, Grid,
    Brain, BookOpen, Command, Lock, Settings, CreditCard, Shield, LogOut, ChevronDown
} from 'lucide-react';
import Badge from '../ui/Badge';
import { DASHBOARD_FONTS } from '../../constants/theme';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    theme: { color: string };
    userMenuOpen: boolean;
    setUserMenuOpen: (open: boolean) => void;
    onUpgradeClick: () => void;
    isDemoMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, userMenuOpen, setUserMenuOpen, onUpgradeClick, isDemoMode }) => {
    const navItems = [
        { id: 'home', icon: LayoutDashboard, label: 'Home (Data Hub)' },
        { id: 'report', icon: FileText, label: 'Report' },
        // { id: 'training', icon: Trophy, label: 'Training' },
        { id: 'coaching', icon: Users, label: 'Coaching' },
        { id: 'integrations', icon: Grid, label: 'Apps / Integrations' },
    ];

    const aiTools = [
        { id: 'ai-coach', icon: Brain, label: 'AI Coach' },
        { id: 'openings', icon: BookOpen, label: 'Opening Lab' },
    ];

    return (
        <div className="fixed top-0 left-0 h-screen w-[220px] xl:w-[260px] border-r border-white/5 flex flex-col justify-between z-30 bg-[#080C14]">
            <div>
                <div className="h-16 xl:h-20 flex items-center px-4 xl:px-6 gap-2 xl:gap-3">
                    <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Command size={16} className="text-white xl:hidden" />
                        <Command size={18} className="text-white hidden xl:block" />
                    </div>
                    <span className={DASHBOARD_FONTS.logo}>White Knight Analytics</span>
                </div>

                <nav className="px-2 xl:px-3 space-y-0.5 xl:space-y-1 mt-4 xl:mt-6">
                    <div className="px-3 xl:px-4 text-[9px] xl:text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Platform</div>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-xs xl:text-sm font-medium transition-all duration-300 relative group
                ${activeTab === item.id ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
                        >
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: theme.color, color: theme.color }} />
                            )}
                            <item.icon size={16} className="mr-2.5 xl:mr-3 transition-colors" style={{ color: activeTab === item.id ? theme.color : 'currentColor' }} />
                            <span className="truncate">{item.label}</span>
                        </button>
                    ))}

                    <div className="px-3 xl:px-4 text-[9px] xl:text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-4 xl:mt-6 mb-2 flex justify-between items-center">
                        <span>AI Features</span>
                        <Badge type="pro" label="PRO" />
                    </div>
                    {aiTools.map((item) => (
                        <button key={item.id} onClick={isDemoMode ? () => setActiveTab(item.id) : onUpgradeClick} className={`w-full flex items-center justify-between px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-xs xl:text-sm font-medium transition-all group relative
                            ${isDemoMode && activeTab === item.id ? 'text-white bg-white/5' : isDemoMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}
                        `}>
                            <div className="flex items-center">
                                <item.icon size={16} className={`mr-2.5 xl:mr-3 transition-colors ${isDemoMode && activeTab === item.id ? '' : isDemoMode ? 'text-amber-400/60 group-hover:text-amber-400' : 'text-slate-600 group-hover:text-amber-400'}`} style={isDemoMode && activeTab === item.id ? { color: theme.color } : {}} />
                                <span className="truncate">{item.label}</span>
                            </div>
                            {!isDemoMode && <Lock size={12} className="text-slate-700 group-hover:text-slate-500" />}
                            {isDemoMode && activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: theme.color, color: theme.color }} />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-3 xl:p-4 border-t border-white/5 relative">
                <div onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 xl:gap-3 p-2 xl:p-2.5 rounded-xl cursor-pointer border border-transparent hover:bg-white/5 hover:border-white/5 transition-all duration-200">
                    <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-[10px] xl:text-xs shadow-inner border border-white/10">JD</div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs xl:text-sm font-bold text-white truncate">John Doe</div>
                        <div className="text-[10px] xl:text-xs text-slate-400">{isDemoMode ? 'Pro Plan' : 'Free Plan'}</div>
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
export default Sidebar;
