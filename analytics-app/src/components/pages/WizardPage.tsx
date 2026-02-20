
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../onboarding/OnboardingWizard';
import ConnectModals from '../shared/ConnectModals';
import MobileGate from '../shared/MobileGate';

const WizardPage = () => {
    const navigate = useNavigate();

    // State for connections
    const [connections, setConnections] = useState({ chessCom: false, lichess: false, masterDb: false });
    // Modal State
    const [activeModal, setActiveModal] = useState<'chessCom' | 'lichess' | 'masterDb' | null>(null);
    const [usernameInput, setUsernameInput] = useState('');
    const [isDemoMode, setDemoMode] = useState(false);

    const toggleConnection = (key: string) => {
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

    const handleClose = () => {
        // When closing wizard, go to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#080C14]">
            <MobileGate />
            {/* We render the Wizard as if it's always open since this IS the wizard page */}
            <OnboardingWizard
                isOpen={true}
                onClose={handleClose} // Clicking 'skip' or 'close' goes to dashboard
                connections={connections}
                toggleConnection={(key) => toggleConnection(key)}
                setDemoMode={setDemoMode}
                isDemoMode={isDemoMode}
                setActiveModal={setActiveModal}
            />

            {/* Modals for connecting accounts */}
            <ConnectModals
                activeModal={activeModal}
                onClose={() => setActiveModal(null)}
                onConnect={handleConnect}
                usernameInput={usernameInput}
                setUsernameInput={setUsernameInput}
            />
        </div>
    );
};

export default WizardPage;
