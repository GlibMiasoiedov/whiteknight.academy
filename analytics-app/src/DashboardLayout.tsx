
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import CenterColumn from './components/layout/CenterColumn';
import ProModal from './components/modals/ProModal';
import ManualInputsModal from './components/modals/ManualInputsModal';
import { THEMES } from './constants/theme';

import OnboardingWizard from './components/onboarding/OnboardingWizard';
import DevToolbar from './components/dev/DevToolbar';
import ConnectModals from './components/shared/ConnectModals';

import { useSearchParams } from 'react-router-dom';

const DashboardLayout = () => {
    // Router Params (e.g. ?wizard=true)
    const [searchParams, setSearchParams] = useSearchParams();
    const showWizardFromUrl = searchParams.get('wizard') === 'true';

    const [activeTab, setActiveTab] = useState('home');
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
        alert("You have joined the class! (Demo)");
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
            <div className="fixed bottom-1 right-1 text-[10px] text-slate-700 z-[9999]">v2.8 - 2026-02-15T22:27:00.000Z</div>
            <DevToolbar
                setConnections={setConnections}
                setDemoMode={setDemoMode}
                setShowWizard={setShowWizard}
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
            />

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
                    toggleConnection={(key: 'chessCom' | 'lichess' | 'masterDb') => toggleConnection(key)}
                    theme={currentTheme}
                    activeTab={activeTab}
                    onUpgradeClick={() => setProModalOpen(true)}
                    isDemoMode={isDemoMode}
                    setDemoMode={setDemoMode}
                    openManualInputs={(canSkip = false) => setManualInputsConfig({ isOpen: true, canSkip })}
                    onNavigate={setActiveTab}
                    openModal={setActiveModal}
                    onJoinCoaching={handleJoinCoaching}
                    isMatchSettingsSet={isMatchSettingsSet}
                />
            </main>

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

                // New Props
                isMatchSettingsSet={isMatchSettingsSet}
                hasJoinedCoaching={hasJoinedCoaching}
                onJoinCoaching={handleJoinCoaching}
            />
        </div>
    );
};
export default DashboardLayout;
