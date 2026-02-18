import React from 'react';
import { Settings } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

interface DevToolbarProps {
    setConnections: (conns: { chessCom: boolean; lichess: boolean; masterDb: boolean }) => void;
    setDemoMode: (mode: boolean) => void;
    setShowWizard: (show: boolean) => void;
    isDemoMode: boolean;
    connections: { chessCom: boolean; lichess: boolean; masterDb: boolean };
    setPgnUploaded: (uploaded: boolean) => void;
}

const DevToolbar: React.FC<DevToolbarProps> = ({ setConnections, setDemoMode, setShowWizard, isDemoMode, connections, setPgnUploaded }) => {
    const navigate = useNavigate();

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const state = e.target.value;
        switch (state) {
            case 'wizard':
                navigate('/wizard');
                break;
            case 'free':
                setShowWizard(false);
                setDemoMode(false);
                break;
            case 'pro':
                setShowWizard(false);
                setDemoMode(true);
                break;
        }
    };

    const isDataConnected = connections.chessCom || connections.lichess;

    const toggleDemoData = () => {
        if (isDataConnected) {
            // Disconnect all
            setConnections({ chessCom: false, lichess: false, masterDb: false });
            setPgnUploaded(false);
        } else {
            // Connect all available (except masterDb which is in dev)
            setConnections({ chessCom: true, lichess: true, masterDb: false });
            setPgnUploaded(true);
        }
    };

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-black/80 text-white px-4 py-1 rounded-b-lg border border-white/10 flex items-center gap-3 text-xs backdrop-blur-md">
            <Settings size={12} className="text-violet-400" />
            <span className="font-bold text-slate-400">DEV MODE:</span>
            <select className="bg-white/90 rounded text-black font-mono cursor-pointer px-2 py-0.5 text-[10px] font-bold" onChange={handleStateChange} value={isDemoMode ? 'pro' : 'free'}>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="wizard">Wizard</option>
            </select>

            <div className="h-3 w-px bg-white/20" />

            <span className="text-slate-400">Demo Data</span>
            <button
                onClick={toggleDemoData}
                className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDataConnected ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isDataConnected ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
        </div>
    );
};

export default DevToolbar;
