import React from 'react';
import { ExternalLink, X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ChessComLogo, LichessLogo, MasterDBLogo } from '../ui/Logos';

interface ConnectModalsProps {
    activeModal: 'chessCom' | 'lichess' | 'masterDb' | null;
    onClose: () => void;
    onConnect: (key: 'chessCom' | 'lichess' | 'masterDb') => void;
    usernameInput: string;
    setUsernameInput: (val: string) => void;
}

const ConnectModals: React.FC<ConnectModalsProps> = ({ activeModal, onClose, onConnect, usernameInput, setUsernameInput }) => {
    if (!activeModal) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <Card className="w-80 p-6 shadow-2xl bg-[#0F1420] border-white/20" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        {activeModal === 'chessCom' && <><ChessComLogo className="text-[#7FA650]" size={20} /> Connect Chess.com</>}
                        {activeModal === 'lichess' && <><LichessLogo className="text-white" size={20} /> Connect Lichess</>}
                        {activeModal === 'masterDb' && <><MasterDBLogo className="text-amber-500" size={20} /> Masters Database</>}
                    </h3>
                    <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-white" /></button>
                </div>

                {activeModal === 'chessCom' && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-violet-500 outline-none"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />
                        <Button fullWidth onClick={() => onConnect('chessCom')}>Fetch Games</Button>
                    </div>
                )}

                {activeModal === 'lichess' && (
                    <div className="space-y-4">
                        <Button fullWidth variant="secondary" icon={ExternalLink}>Authorize with Lichess</Button>
                        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0F1420] px-2 text-slate-500">Or token</span></div></div>
                        <input type="text" placeholder="Personal API Token" className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-violet-500 outline-none" />
                        <Button fullWidth onClick={() => onConnect('lichess')}>Connect via Token</Button>
                    </div>
                )}

                {activeModal === 'masterDb' && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400">Access 10 million games from top tournament play.</p>
                        <Button fullWidth themeColor="#F59E0B" onClick={() => onConnect('masterDb')}>Enable Access</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ConnectModals;
