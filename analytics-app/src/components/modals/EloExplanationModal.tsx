import React from 'react';
import { X, Calculator, Database, TrendingUp } from 'lucide-react';

interface EloExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EloExplanationModal: React.FC<EloExplanationModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-2xl bg-[#0F1623] border border-violet-500/30 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                {/* Background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="p-8 relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">How is this rating calculated?</h2>
                    <p className="text-slate-400 text-sm mb-8">
                        Our algorithm is powered by the analysis of over 7 million chess games and predictive modeling, removing the guesswork from your true strength.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex flex-shrink-0 items-center justify-center mt-1">
                                <Database size={20} className="text-violet-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">1. Data Aggregation</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    We analyzed datasets from major platforms (Chess.com and Lichess), filtering specifically for players who also hold an official validated FIDE over-the-board rating.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex flex-shrink-0 items-center justify-center mt-1">
                                <TrendingUp size={20} className="text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">2. Predictive Modeling</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    After removing outliers and provisional ratings, we correlated online blitz and rapid ratings with actual FIDE performance. Using this dataset, we built a highly accurate linear regression model (R² = 0.65).
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex flex-shrink-0 items-center justify-center mt-1">
                                <Calculator size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">3. Your Estimate</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Online ratings are typically inflated by 100-300 points compared to official FIDE ratings, especially for amateurs. Our model strips away this "online inflation" to provide a realistic forecast of your tournament strength. 95% of players fall within a ±118 point margin of error.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EloExplanationModal;
