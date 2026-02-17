import { FONTS } from '../../constants/theme';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { TikTokIcon } from '../ui/Icons';

const SocialButton = ({ href, icon: Icon }: { href: string, icon: any }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/5 backdrop-blur-md"><Icon size={24} /></a>
);

const Footer = () => (
    <footer className="relative bg-[#0F1623] pt-16 md:pt-24 pb-12 border-t border-white/10 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-20 mb-16 md:mb-20 items-center">
                {/* Left Side: Stay Connected & Apps */}
                <div>
                    <h2 className={`${FONTS.h1} text-white mb-6`}>Stay Connected</h2>
                    <p className={`text-xl text-slate-400 mb-10 max-w-lg ${FONTS.body}`}>Follow product updates, new features, and coaching announcements.</p>

                    <div className="mb-12">
                        <p className={`text-sm font-bold text-slate-500 mb-6 ${FONTS.label}`}>Follow us</p>
                        <div className="flex gap-4 md:gap-6">
                            <SocialButton href="https://www.instagram.com/white_knight_chess/" icon={Instagram} />
                            <SocialButton href="https://www.youtube.com/@ChessAcademyWhiteKnight" icon={Youtube} />
                            <SocialButton href="https://www.facebook.com/chessonlineacademy" icon={Facebook} />
                            <SocialButton href="https://www.tiktok.com/@white.knight.onli" icon={TikTokIcon} />
                        </div>
                    </div>

                    <div>
                        <p className={`text-sm font-bold text-slate-500 mb-6 ${FONTS.label}`}>Download our app in</p>

                        <div className="relative inline-block">
                            {/* Overlay */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                <div className="px-2 py-1 bg-slate-900/80 rounded-full border border-white/10 flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                                    <div className="w-2.5 h-2.5 text-amber-500">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    </div>
                                    <span className="text-white font-bold text-[9px] tracking-wide whitespace-nowrap">Mobile app coming soon</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 opacity-50 pointer-events-none filter grayscale-[0.8]">
                                <button className="px-5 py-3 rounded-xl bg-[#1E293B] border border-white/5 flex items-center gap-3 min-w-[160px]">
                                    <svg viewBox="0 0 384 512" fill="currentColor" className="w-8 h-8 text-white">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-54.5-127.1-53.8-147.1zM209.7 112c26-31.8 44.6-54.2 40-96-33.1 3-68.5 21.6-90 49.3-25 32.3-43.9 66.8-37.4 92.4 34.6 2.3 64.9-19.2 87.4-45.7z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] text-slate-400 leading-none mb-1 font-medium">Download on the</div>
                                        <div className="text-sm font-bold text-white leading-none">App Store</div>
                                    </div>
                                </button>
                                <button className="px-5 py-3 rounded-xl bg-[#1E293B] border border-white/5 flex items-center gap-3 min-w-[160px]">
                                    <svg viewBox="0 0 512 512" fill="currentColor" className="w-7 h-7 text-white">
                                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] text-slate-400 leading-none mb-1 font-medium">Get it on</div>
                                        <div className="text-sm font-bold text-white leading-none">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Phone Graphic (Hidden on mobile) */}
                <div className="relative hidden lg:block h-[500px]">
                    <div className="absolute right-10 top-0 w-[280px] h-[560px] bg-[#0F1623] rounded-[40px] border-[8px] border-slate-800 shadow-2xl rotate-[-6deg] overflow-hidden transform translate-y-8 hover:rotate-0 hover:translate-y-0 transition-all duration-700 ease-out shadow-violet-900/50">
                        <div className="w-full h-full bg-[#0B1220] relative overflow-hidden">
                            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-violet-900/20 to-transparent" />
                            <div className="p-6 pt-12 space-y-6">
                                <div className="flex justify-between items-end"><div className="h-8 w-16 bg-white/10 rounded-lg" /><div className="h-6 w-6 bg-emerald-500/20 rounded-full" /></div>
                                <div className="h-40 w-full bg-white/5 rounded-2xl border border-white/10 p-4 relative overflow-hidden"><div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-violet-500/20 to-transparent" /><div className="flex items-end gap-2 h-full pb-2 px-2">{[40, 70, 50, 90, 60, 80].map((h, i) => (<div key={i} className="flex-1 bg-violet-500/40 rounded-t" style={{ height: `${h}%` }} />))}</div></div>
                                <div className="space-y-3"><div className="h-14 w-full bg-white/5 rounded-xl border border-white/5 flex items-center px-4"><div className="h-8 w-8 rounded-full bg-indigo-500/50 mr-3" /><div className="h-2.5 w-20 bg-white/20 rounded" /></div><div className="h-14 w-full bg-white/5 rounded-xl border border-white/5 flex items-center px-4"><div className="h-8 w-8 rounded-full bg-pink-500/50 mr-3" /><div className="h-2.5 w-28 bg-white/20 rounded" /></div></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
                <div className="space-y-4">
                    <a href="https://whiteknight.academy/" className="flex items-center gap-3 justify-center md:justify-start hover:opacity-80 transition-opacity">
                        {/* Desktop Logo (simple) */}
                        <div className="hidden md:flex w-12 h-12 items-center justify-center text-white">
                            <img src="/logo.svg" alt="White Knight Academy" className="w-10 h-10" />
                        </div>

                        {/* Mobile Logo (simple) */}
                        <img src="/logo.svg" alt="White Knight Academy" className="block md:hidden w-10 h-10 md:w-12 md:h-12" />

                        <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            White Knight Academy
                        </span>
                    </a>
                    <p className="text-slate-400 text-sm md:text-base text-center md:text-left">
                        Master chess through pattern recognition, not memorization.
                    </p>
                    <p className="text-sm text-slate-500 text-center md:text-left">© {new Date().getFullYear()} White Knight Academy. All rights reserved. <span className="opacity-20 text-xs ml-2">v1.6.29</span></p>
                </div>
                <div className="flex gap-8 text-sm text-slate-400">
                    <a href="https://whiteknight.academy/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="https://whiteknight.academy/terms-of-service/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="https://whiteknight.academy/cookie-preferences/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Cookie Preferences</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
