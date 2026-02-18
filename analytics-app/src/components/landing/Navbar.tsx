
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { FONTS } from '../../constants/theme';

const Navbar = ({ onRegister, onLogin }: { onRegister: () => void, onLogin: () => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300">
            <div className="absolute inset-0 bg-[#080C14] md:bg-[#080C14]/80 md:backdrop-blur-xl border-b border-white/5 shadow-lg" />
            <div className="w-full px-6 md:px-8 lg:px-12 xl:px-16 h-24 flex items-center justify-between relative z-10">
                <div className="flex-1 flex justify-start">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        {/* Desktop Logo (no background) */}
                        <div className="hidden md:flex items-center justify-center">
                            <img src="/logo.svg" alt="White Knight" width="48" height="48" className="w-10 h-10 lg:w-12 lg:h-12" />
                        </div>

                        {/* Mobile Logo (simple) */}
                        <img src="/logo.svg" alt="White Knight Analytics" width="48" height="48" className="block md:hidden w-10 h-10 text-white" />

                        <span className={`${FONTS.logo} hidden sm:block whitespace-nowrap text-base lg:text-lg text-white`}>White Knight</span>
                    </div>
                </div>

                {/* Desktop Menu - Flex Center (No Absolute) */}
                <div className="hidden lg:flex flex-none justify-center gap-1 xl:gap-2">
                    {[
                        { label: 'Analytics', id: 'analytics' },
                        { label: 'Opponent Prep', id: 'opponent-prep' },
                        { label: 'Coaching', id: 'coaching' },
                        { label: 'Beginners', id: 'beginners' },
                        { label: 'Pricing', id: 'pricing' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`px-2 lg:px-3 xl:px-6 py-2 lg:py-3 text-sm lg:text-base xl:text-lg ${FONTS.body} text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all whitespace-nowrap`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Actions - Flex Right */}
                <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-2 lg:gap-4">
                        <button onClick={onLogin} className={`text-sm lg:text-base xl:text-lg font-semibold text-slate-300 hover:text-white whitespace-nowrap px-2 lg:px-4 xl:px-6 py-2 ${FONTS.body}`}>Log in</button>

                        {/* Mobile: Small "Free Report" button */}
                        <button onClick={onRegister} className="flex md:hidden px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg hover:bg-indigo-500 transition-colors">
                            Free Report
                        </button>

                        {/* Desktop: Large "Free Report" button */}
                        <button onClick={onRegister} className="hidden md:flex group relative px-4 lg:px-5 xl:px-8 py-2.5 lg:py-3.5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5 border border-white/10 btn-premium">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all" />
                            <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
                            <span className={`relative text-white text-sm lg:text-base xl:text-lg font-bold flex items-center gap-2 whitespace-nowrap ${FONTS.body}`}>
                                Get a Free Report
                            </span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-300 hover:text-white">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-24 left-0 w-full bg-[#080C14] border-b border-white/10 shadow-2xl p-6 flex flex-col gap-4 animate-fade-in-down lg:hidden">
                    {[
                        { label: 'Analytics', id: 'analytics' },
                        { label: 'Opponent Prep', id: 'opponent-prep' },
                        { label: 'Coaching', id: 'coaching' },
                        { label: 'Beginners', id: 'beginners' },
                        { label: 'Pricing', id: 'pricing' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full text-left px-4 py-3 text-lg ${FONTS.body} text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5 last:border-0`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
