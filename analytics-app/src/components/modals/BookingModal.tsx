import React from 'react';
import { X, Check } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleCheckout = (plan: 'subscription' | 'single') => {
        // In a real app, we'd pass the selected plan to the checkout page
        // via state or URL params. For now, just navigate.
        console.log('Selected plan:', plan);
        navigate('/checkout');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#0F1623] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Choose Your Coaching Plan</h2>
                        <p className="text-slate-400">Select the option that best fits your goals.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Monthly Subscription */}
                        <Card className="relative border-violet-500/30 bg-violet-500/5 flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/10" padding="p-8">
                            <div className="absolute top-0 right-0 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">Standard Plan</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">€99.00</span>
                                    <span className="text-sm text-slate-400">/ month</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-violet-400" /></div>
                                    <span>4 Group Lessons per month</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-violet-400" /></div>
                                    <span>Weekly Homework & Analysis</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-violet-400" /></div>
                                    <span>Access to Lesson Recordings</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-violet-400" /></div>
                                    <div>
                                        <span className="text-white font-bold">Bonus:</span> Training Plan
                                    </div>
                                </li>
                            </ul>

                            <Button themeColor="#8B5CF6" fullWidth size="lg" onClick={() => handleCheckout('subscription')}>Start Monthly Plan</Button>
                        </Card>

                        {/* One-Time Class */}
                        <Card className="relative border-white/10 hover:border-white/20 bg-white/5 flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02]" padding="p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">Single Session</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">€29.00</span>
                                    <span className="text-sm text-slate-400">/ class</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-slate-400" /></div>
                                    <span>1 Group Lesson Access</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-slate-400" /></div>
                                    <span>Live Q&A with Coach</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-slate-400" /></div>
                                    <span>Lesson Recording</span>
                                </li>
                            </ul>

                            <Button variant="secondary" fullWidth size="lg" onClick={() => handleCheckout('single')}>Book Single Class</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
