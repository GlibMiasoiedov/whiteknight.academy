import useIsMobile from '../../hooks/useIsMobile';
import LandingPageMobile from './LandingPageMobile';
import LandingPageDesktop from './LandingPageDesktop';

const LandingPage = () => {
    const isMobile = useIsMobile();

    // While determining (SSR/hydration mismatch avoidance), we can render Desktop by default or a loader.
    // For SPA, it updates immediately.

    if (isMobile) {
        return <LandingPageMobile />;
    }

    return <LandingPageDesktop />;
};

export default LandingPage;
