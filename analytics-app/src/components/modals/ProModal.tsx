import React from 'react';
import { Crown, Sparkles, X, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface ProModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-[900px] bg-[#0F1623] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
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
export default ProModal;
