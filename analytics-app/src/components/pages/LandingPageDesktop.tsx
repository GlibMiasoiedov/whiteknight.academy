import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorBoundary from '../ui/ErrorBoundary';

// Eager load "Above the Fold" content
import Navbar from '../landing/Navbar';
import HeroSection from '../landing/HeroSection';

// Lazy load everything else
const WhySection = lazy(() => import('../landing/WhySection'));
const VisualizationSection = lazy(() => import('../landing/VisualizationSection'));
const BiometricsSection = lazy(() => import('../landing/BiometricsSection'));
const OpponentAnalysisSection = lazy(() => import('../landing/OpponentAnalysisSection'));
const CoachingVsAutoSection = lazy(() => import('../landing/CoachingVsAutoSection'));
const BeginnersSection = lazy(() => import('../landing/BeginnersSection'));
const PricingSection = lazy(() => import('../landing/PricingSection'));
const FAQSection = lazy(() => import('../landing/FAQSection'));
const BecomeCoachSection = lazy(() => import('../landing/BecomeCoachSection'));
const Footer = lazy(() => import('../landing/Footer'));
const RegistrationModal = lazy(() => import('../landing/RegistrationModal'));

const LandingPageDesktop = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial check for URL param
    useEffect(() => {
        if (location.search.includes('register=true')) {
            setAuthMode('register');
            setIsModalOpen(true);
        }
    }, [location.search]);

    const handleLogin = () => {
        setAuthMode('login');
        setIsModalOpen(true);
    };

    const handleRegister = () => {
        setAuthMode('register');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/'); // Clear URL param if present
    };

    return (
        <div className="bg-[#080C14] min-h-screen text-white relative font-sans overflow-x-hidden">
            <style>{`
                  @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                  }
                  .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
                  .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                  @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <ErrorBoundary>
                <Navbar onRegister={handleRegister} onLogin={handleLogin} />
                <HeroSection />
            </ErrorBoundary>

            {/* 1. Why & Visualization (Next most important) */}
            <ErrorBoundary>
                <Suspense fallback={<div className="h-96 w-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                    <WhySection onRegister={handleRegister} />
                    <VisualizationSection />
                    <BiometricsSection onRegister={handleRegister} />
                </Suspense>
            </ErrorBoundary>

            {/* 2. Opponent Analysis */}
            <ErrorBoundary>
                <Suspense fallback={<div className="h-96 w-full flex items-center justify-center opacity-50"><div className="w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                    <OpponentAnalysisSection onRegister={handleRegister} />
                </Suspense>
            </ErrorBoundary>

            {/* 3. Middle Content */}
            <ErrorBoundary>
                <Suspense fallback={<div className="h-40 w-full" />}>
                    <CoachingVsAutoSection onRegister={handleRegister} />
                    <BeginnersSection onRegister={handleRegister} />
                </Suspense>
            </ErrorBoundary>

            {/* 4. Bottom Content */}
            <ErrorBoundary>
                <Suspense fallback={<div className="h-40 w-full" />}>
                    <PricingSection onRegister={handleRegister} />
                    <FAQSection />
                    <BecomeCoachSection />
                    <Footer />
                </Suspense>
            </ErrorBoundary>

            {/* Background elements - Desktop Only */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <Suspense fallback={null}>
                {isModalOpen && (
                    <RegistrationModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        mode={authMode}
                        onSwitchToRegister={() => setAuthMode('register')}
                        onLoginSuccess={() => navigate('/dashboard')} // Mock login success
                    />
                )}
            </Suspense>
        </div>
    );
};

export default LandingPageDesktop;
