import { FONTS } from '../../constants/theme';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { TikTokIcon } from '../ui/Icons';

const SocialButton = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/5 backdrop-blur-md"><Icon size={24} /></a>
);

const Footer = () => (
    <footer className="relative bg-[#0F1623] pt-12 pb-8 md:pt-24 md:pb-16 border-t border-white/10 overflow-x-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center relative z-10">
                {/* Left Side: Stay Connected & Apps */}
                <div>
                    <h2 className={`${FONTS.h1} text-white mb-6`}>Stay Connected</h2>
                    <p className={`text-xl text-slate-400 mb-10 max-w-lg ${FONTS.body}`}>Follow product updates, new features, and coaching announcements.</p>

                    <div className="mb-12">
                        <p className={`text-sm font-bold text-slate-500 mb-6 ${FONTS.label}`}>Follow us</p>
                        <div className="flex gap-4 md:gap-6">
                            <SocialButton href="https://www.instagram.com/white_knight_chess/" icon={Instagram} label="Follow us on Instagram" />
                            <SocialButton href="https://www.youtube.com/@ChessAcademyWhiteKnight" icon={Youtube} label="Subscribe to our YouTube channel" />
                            <SocialButton href="https://www.facebook.com/chessonlineacademy" icon={Facebook} label="Follow us on Facebook" />
                            <SocialButton href="https://www.tiktok.com/@white.knight.onli" icon={TikTokIcon} label="Follow us on TikTok" />
                        </div>
                    </div>

                    <div>
                        <p className={`text-sm font-bold text-slate-500 mb-6 ${FONTS.label}`}>Download our app in</p>

                        <div className="relative inline-block mt-2">
                            {/* Buttons Container - Faded & Disabled */}
                            <div className="flex flex-row justify-center sm:justify-start gap-4 opacity-40 pointer-events-none filter grayscale-[0.8]">
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

                            {/* "Coming Soon" Badge - Centered over buttons */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="px-5 py-2.5 bg-[#0F1623]/90 backdrop-blur-md rounded-full border border-violet-500/30 flex items-center gap-3 shadow-xl z-20">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse relative z-10" />
                                        <div className="absolute inset-0 bg-amber-500/50 rounded-full animate-ping" />
                                    </div>
                                    <span className="text-white font-bold text-xs tracking-wide">Mobile app coming soon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements (Visuals) */}
                <div className="relative hidden lg:block h-[500px] xl:h-[600px] w-full overflow-visible phone-area">
                    <div className="phone-glow absolute right-[-40px] xl:right-[10px] top-0 w-[260px] xl:w-[320px] h-[520px] xl:h-[640px] bg-indigo-500/20 rounded-[3rem] rotate-12 blur-3xl" />

                    {/* CSS Phone Mockup */}
                    <div className="phone-mockup absolute right-[-40px] xl:right-[10px] top-0 w-[280px] xl:w-[320px] h-[560px] xl:h-[640px] bg-[#0F1623] rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 z-20">
                        {/* Status Bar */}
                        <div className="h-8 flex justify-between items-center px-6 mt-2">
                            <div className="w-12 h-4 bg-slate-800/50 rounded-full" />
                            <div className="flex gap-1.5">
                                <div className="w-4 h-4 rounded-full bg-slate-800/50" />
                                <div className="w-4 h-4 rounded-full bg-slate-800/50" />
                            </div>
                        </div>

                        {/* App Header */}
                        <div className="px-6 py-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-4 shadow-lg shadow-violet-500/30" />
                            <div className="w-32 h-6 bg-slate-800/50 rounded-lg mb-2" />
                            <div className="w-48 h-4 bg-slate-800/30 rounded-lg" />
                        </div>

                        {/* Chart Area */}
                        <div className="px-6 mt-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
                                <div className="flex justify-between items-end h-32 gap-2">
                                    {[40, 70, 45, 90, 65, 85].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-violet-600 to-indigo-400 rounded-t-lg opacity-80" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>

                            {/* Stats Rows */}
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/5 flex items-center px-4 gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800/50 shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="w-24 h-3 bg-slate-800/50 rounded" />
                                            <div className="w-16 h-2 bg-slate-800/30 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Nav */}
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-[#0F1623]/95 backdrop-blur border-t border-white/5 flex justify-around items-center px-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center ${i === 1 ? 'text-violet-400 bg-violet-500/10' : 'text-slate-600'}`}>
                                    <div className={`w-6 h-6 rounded-lg ${i === 1 ? 'bg-violet-400' : 'bg-slate-700'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
                <div className="space-y-4">
                    <a href="https://whiteknight.academy/" className="flex items-center gap-3 justify-center md:justify-start hover:opacity-80 transition-opacity">
                        {/* Desktop Logo (simple) */}
                        <div className="hidden md:flex w-12 h-12 items-center justify-center text-white">
                            <img src="/logo.svg" alt="White Knight Analytics" width="40" height="40" className="w-10 h-10" />
                        </div>

                        {/* Mobile Logo (simple) */}
                        <img src="/logo.svg" alt="White Knight Analytics" width="40" height="40" className="block md:hidden w-10 h-10 md:w-12 md:h-12" />

                        <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            White Knight Academy
                        </span>
                    </a>
                    <p className="text-slate-400 text-sm md:text-base text-center md:text-left">
                        Master chess through pattern recognition, not memorization.
                    </p>
                    <p className="text-sm text-slate-500 text-center md:text-left">© {new Date().getFullYear()} White Knight Academy. All rights reserved. <span className="opacity-20 text-xs ml-2">v1.7.0</span></p>
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
