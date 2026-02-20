
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



    const [manualInputsConfig, setManualInputsConfig] = useState<{ isOpen: boolean; canSkip: boolean }>({ isOpen: false, canSkip: false });
    const [connections, setConnections] = useState({ chessCom: false, lichess: false, masterDb: false });
    // Modal State
    const [activeModal, setActiveModal] = useState<'chessCom' | 'lichess' | 'masterDb' | null>(null);
    const [usernameInput, setUsernameInput] = useState('');

    const [isDemoMode, setDemoMode] = useState(false);

    // Initialize Wizard state based on LocalStorage OR URL Param
    const [showWizard, setShowWizard] = useState(() => {
        if (showWizardFromUrl) return true;
        return !localStorage.getItem('wk_analytics_wizard_seen');
    });

    // Checklist State
    const [isMatchSettingsSet, setMatchSettingsSet] = useState(false);
    const [hasJoinedCoaching, setHasJoinedCoaching] = useState(false);
    const [pgnUploaded, setPgnUploaded] = useState(false);

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
            <div className="fixed bottom-1 right-1 text-[10px] text-slate-700 z-[9999]">v2.9.3 - 2026-02-19</div>
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
            />

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                theme={currentTheme}
                userMenuOpen={userMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
                onUpgradeClick={() => setProModalOpen(true)}
                isDemoMode={isDemoMode}
            />

            <main className="flex-1 w-full relative">
                {isEnrollPage ? (
                    <div className="pl-[240px] xl:pl-[290px] w-full transition-all duration-300">
                        <StandardPlanPage
                            onBack={() => navigate('/dashboard/coaching')}
                            openManualInputs={() => setManualInputsConfig({ isOpen: true, canSkip: false })}
                            connections={connections}
                            openModal={setActiveModal}
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
                    />
                )}
            </main>

            {!isEnrollPage && (
                <RightPanel
                    connections={connections}
                    openManualInputs={(canSkip = false) => setManualInputsConfig({ isOpen: true, canSkip })}
                    theme={currentTheme}
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
                />
            )}
        </div>
    );
};
export default DashboardLayout;
