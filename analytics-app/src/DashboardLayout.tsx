
import { useState, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import CenterColumn from './components/layout/CenterColumn';
import ProModal from './components/modals/ProModal';
import ManualInputsModal from './components/modals/ManualInputsModal';
import { THEMES } from './constants/theme';

import OnboardingWizard from './components/onboarding/OnboardingWizard';
import DevToolbar from './components/dev/DevToolbar';
import ConnectModals from './components/shared/ConnectModals';
import MobileGate from './components/shared/MobileGate';

import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { PanelRightOpen } from 'lucide-react';

import StandardPlanPage from './components/coaching/StandardPlanPage';

const DashboardLayout = () => {
    // Router Params (e.g. ?wizard=true)
    const [searchParams, setSearchParams] = useSearchParams();
    const showWizardFromUrl = searchParams.get('wizard') === 'true';

    // URL-based routing
    const location = useLocation();
    const navigate = useNavigate();

    // Derive activeTab from URL path: /dashboard/report → 'report', /dashboard → 'home'
    const pathAfterDashboard = location.pathname.replace(/^\/dashboard\/?/, '');
    const pathSegment = pathAfterDashboard.split('/')[0];
    const TAB_MAP: Record<string, string> = { '': 'home', 'report': 'report', 'coaching': 'coaching', 'apps': 'integrations', 'ai-coach': 'ai-coach', 'opening-lab': 'openings' };
    const activeTab = TAB_MAP[pathSegment] || 'home';

    // Detect coaching sub-routes
    const isEnrollPage = pathAfterDashboard === 'coaching/enroll';

    const setActiveTab = useCallback((tab: string) => {
        const REVERSE_MAP: Record<string, string> = { 'home': '', 'report': 'report', 'coaching': 'coaching', 'integrations': 'apps', 'ai-coach': 'ai-coach', 'openings': 'opening-lab' };
        const path = REVERSE_MAP[tab] || '';
        navigate(`/dashboard${path ? `/${path}` : ''}`);
    }, [navigate]);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [proModalOpen, setProModalOpen] = useState(false);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);



    const [manualInputsConfig, setManualInputsConfig] = useState<{ isOpen: boolean; canSkip: boolean }>({ isOpen: false, canSkip: false });
    const [connections, setConnections] = useState({ chessCom: false, lichess: false, masterDb: false });
    // Modal State
    const [activeModal, setActiveModal] = useState<'chessCom' | 'lichess' | 'masterDb' | null>(null);
    const [usernameInput, setUsernameInput] = useState('');
    const [pgnUploaded, setPgnUploaded] = useState(false);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
    // Report context — shared between CenterColumn (source) and RightPanel (display)
    const [reportActiveSlice, setReportActiveSlice] = useState<string | null>(null);
    const [reportWidgetHint, setReportWidgetHint] = useState<string | null>(null);
    const [reportWidgetData, setReportWidgetData] = useState<any>(null);

    const [isDemoMode, setDemoMode] = useState(false);

    // Initialize Wizard state based on LocalStorage OR URL Param
    const [showWizard, setShowWizard] = useState(() => {
        if (showWizardFromUrl) return true;
        return !localStorage.getItem('wk_analytics_wizard_seen');
    });

    // Checklist State
    const [isMatchSettingsSet, setMatchSettingsSet] = useState(false);
    const [hasJoinedCoaching, setHasJoinedCoaching] = useState(false);
    const currentTheme = THEMES[activeTab as keyof typeof THEMES] || THEMES.home;
    const toggleConnection = (key: string) => {
        // Cast to keyof typeof connections to satisfy TS
        setConnections(prev => ({ ...prev, [key]: !prev[key as keyof typeof connections] }));
    };

    const handleConnect = (key: 'chessCom' | 'lichess' | 'masterDb') => {
        // Simulate API check
        setTimeout(() => {
            toggleConnection(key);
            setActiveModal(null);
            setUsernameInput('');
        }, 800);
    };


    const handleSaveMatchSettings = () => {
        setMatchSettingsSet(true);
        setManualInputsConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleJoinCoaching = () => {
        setHasJoinedCoaching(true);
        // Open the coaching preferences / match settings modal
        setManualInputsConfig({ isOpen: true, canSkip: true });
    };

    const handleOpenBooking = () => {
        navigate('/dashboard/coaching/enroll');
    };

    const closeWizard = () => {
        setShowWizard(false);
        localStorage.setItem('wk_analytics_wizard_seen', 'true');

        // Clear URL param if it exists
        if (showWizardFromUrl) {
            setSearchParams({}, { replace: true });
        }
    };

    return (
        <div className="flex min-h-screen font-sans bg-[#080C14] text-white selection:bg-violet-500/30 selection:text-white relative">
            <MobileGate />
            <div className="fixed bottom-1 right-1 text-[10px] text-slate-700 z-[9999]">v2.9.9 - 2026-02-21</div>
            <DevToolbar
                setConnections={setConnections}
                setDemoMode={setDemoMode}
                setShowWizard={setShowWizard}
                isDemoMode={isDemoMode}
                connections={connections}
                setPgnUploaded={setPgnUploaded}
            />
            <OnboardingWizard
                isOpen={showWizard}
                onClose={closeWizard}
                connections={connections}
                toggleConnection={(key) => toggleConnection(key)}
                setDemoMode={setDemoMode}
                isDemoMode={isDemoMode}
                setActiveModal={setActiveModal}
            />
            <ConnectModals
                activeModal={activeModal}
                onClose={() => setActiveModal(null)}
                onConnect={handleConnect}
                usernameInput={usernameInput}
                setUsernameInput={setUsernameInput}
            />
            <ProModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} />


            <ManualInputsModal
                isOpen={manualInputsConfig.isOpen}
                canSkip={manualInputsConfig.canSkip}
                onClose={() => setManualInputsConfig(prev => ({ ...prev, isOpen: false }))}
                onSave={handleSaveMatchSettings}
                theme={currentTheme}
                connections={connections}
                openConnectModal={(platform) => setActiveModal(platform)}
                disconnectPlatform={toggleConnection}
            />

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                theme={currentTheme}
                userMenuOpen={userMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
                onUpgradeClick={() => setProModalOpen(true)}
                isDemoMode={isDemoMode}
                isOpen={isLeftSidebarOpen}
                onClose={() => setIsLeftSidebarOpen(false)}
            />

            {/* Left Edge Toggle Bar for Mobile/Tablet/Desktop < 2xl (Visible globally) */}
            <button
                onClick={() => setIsLeftSidebarOpen(true)}
                className={`menu-edge-btn 2xl:hidden z-[60] fixed top-1/2 -translate-y-1/2 left-0 backdrop-blur-md rounded-r-2xl flex flex-col items-center justify-center text-white group overflow-hidden ${isLeftSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-full' : ''}`}
                style={{ '--theme-color': currentTheme.color } as React.CSSProperties}
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300" style={{ backgroundColor: currentTheme.color }} />
                <span className="transform -rotate-90 tracking-[0.2em] text-[8px] sm:text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors duration-300 whitespace-nowrap relative z-10">
                    MENU
                </span>
                {/* Colored line indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-10 bg-white/20 rounded-r-full group-hover:h-8 sm:group-hover:h-12 transition-all duration-300 shadow-[0_0_10px_currentColor] z-10" style={{ backgroundColor: currentTheme.color, color: currentTheme.color }} />
            </button>

            <main className="flex-1 w-full relative">
                {isEnrollPage ? (
                    <div className="pl-0 2xl:pl-[290px] w-full transition-all duration-300">
                        <StandardPlanPage
                            onBack={() => navigate('/dashboard/coaching')}
                            openManualInputs={() => setManualInputsConfig({ isOpen: true, canSkip: false })}
                            connections={connections}
                            openModal={setActiveModal}
                            disconnectPlatform={toggleConnection}
                        />
                    </div>
                ) : (
                    <CenterColumn
                        connections={connections}
                        toggleConnection={(key: 'chessCom' | 'lichess' | 'masterDb') => toggleConnection(key)}
                        theme={currentTheme}
                        activeTab={activeTab}
                        onUpgradeClick={() => setProModalOpen(true)}
                        isDemoMode={isDemoMode}
                        openManualInputs={(canSkip = false) => setManualInputsConfig({ isOpen: true, canSkip })}
                        onNavigate={setActiveTab}
                        openModal={setActiveModal}
                        onJoinCoaching={handleJoinCoaching}
                        isMatchSettingsSet={isMatchSettingsSet}
                        onOpenBooking={handleOpenBooking}
                        onReportActiveSliceChange={setReportActiveSlice}
                        onReportWidgetHint={(hint, data) => {
                            setReportWidgetHint(hint);
                            setReportWidgetData(data || null);
                            setReportActiveSlice(null);
                        }}
                    />
                )}
            </main>

            {!isEnrollPage && (
                <>
                    {/* Floating Toggle Button for Mobile/Tablet Drawer */}
                    <button
                        onClick={() => setIsRightPanelOpen(true)}
                        className="lg:hidden fixed top-6 right-6 z-40 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                    >
                        <PanelRightOpen size={20} className="text-violet-300" />
                    </button>

                    <RightPanel
                        connections={connections}
                        openManualInputs={(canSkip = false) => setManualInputsConfig({ isOpen: true, canSkip })}
                        theme={currentTheme}
                        activeTab={activeTab}
                        onUpgradeClick={() => setProModalOpen(true)}
                        isDemoMode={isDemoMode}
                        setDemoMode={setDemoMode}
                        onNavigate={setActiveTab}
                        toggleConnection={toggleConnection}
                        openModal={setActiveModal}
                        isMatchSettingsSet={isMatchSettingsSet}
                        hasJoinedCoaching={hasJoinedCoaching}
                        onJoinCoaching={handleJoinCoaching}
                        pgnUploaded={pgnUploaded}
                        setPgnUploaded={setPgnUploaded}
                        isOpen={isRightPanelOpen}
                        onClose={() => setIsRightPanelOpen(false)}
                        reportActiveSlice={reportActiveSlice}
                        reportWidgetHint={reportWidgetHint}
                        reportWidgetData={reportWidgetData}
                        onClearInsight={() => {
                            setReportActiveSlice(null);
                            setReportWidgetHint(null);
                            setReportWidgetData(null);
                        }}
                    />
                </>
            )}
        </div>
    );
};
export default DashboardLayout;
