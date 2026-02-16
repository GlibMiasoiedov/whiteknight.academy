import React from 'react';
import { Settings } from 'lucide-react';

interface DevToolbarProps {
    setConnections: (conns: { chessCom: boolean; lichess: boolean; masterDb: boolean }) => void;
    setDemoMode: (mode: boolean) => void;
    setShowWizard: (show: boolean) => void;
}

const DevToolbar: React.FC<DevToolbarProps> = ({ setConnections, setDemoMode, setShowWizard }) => {
    // Only show in dev/preview environments (optional safeguard)
    // if (process.env.NODE_ENV === 'production') return null; 

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const state = e.target.value;
        switch (state) {
            case 'wizard':
                setShowWizard(true);
                setConnections({ chessCom: false, lichess: false, masterDb: false });
                setDemoMode(false);
                break;
            case 'empty':
                setShowWizard(false);
                setConnections({ chessCom: false, lichess: false, masterDb: false });
                setDemoMode(false);
                break;
            case 'connected':
                setShowWizard(false);
                setConnections({ chessCom: true, lichess: false, masterDb: false });
                setDemoMode(false);
                break;
            case 'pro':
                setShowWizard(false);
                setConnections({ chessCom: true, lichess: true, masterDb: true });
                setDemoMode(true);
                break;
        }
    };

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-black/80 text-white px-4 py-1 rounded-b-lg border border-white/10 flex items-center gap-2 text-xs backdrop-blur-md">
            <Settings size={12} className="text-violet-400" />
            <span className="font-bold text-slate-400">DEV MODE:</span>
            <select className="bg-white/90 rounded text-black font-mono cursor-pointer px-2 py-0.5 text-[10px] font-bold" onChange={handleStateChange}>
                <option value="empty">State A (Empty)</option>
                <option value="wizard">First Run (Wizard)</option>
                <option value="connected">State B (Connected)</option>
                <option value="pro">Pro User (Demo)</option>
            </select>
        </div>
    );
};

export default DevToolbar;
