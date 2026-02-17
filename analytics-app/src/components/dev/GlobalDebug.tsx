import { useState, useEffect } from 'react';

const GlobalDebug = () => {
    const [errors, setErrors] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            setErrors(prev => [...prev, `Error: ${event.message}`]);
            setIsVisible(true);
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            setErrors(prev => [...prev, `Promise Rejected: ${event.reason}`]);
            setIsVisible(true);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        // FORCE UNREGISTER SERVICE WORKERS
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    console.log('Unregistering SW:', registration);
                    registration.unregister();
                }
                if (registrations.length > 0) {
                    setErrors(prev => [...prev, `SYSTEM: Unregistered ${registrations.length} Service Worker(s). Please refresh.`]);
                    setIsVisible(true);
                }
            });
        }

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    // Also check if we are on v162.html
    const isBypass = window.location.pathname.includes('v162.html');

    if (!isVisible && !isBypass) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-red-900/90 text-white text-xs font-mono p-4 z-[9999] max-h-[50vh] overflow-auto border-t-2 border-red-500">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-yellow-300">DEBUG CONSOLE (v1.6.2-debug)</span>
                <button onClick={() => setIsVisible(false)} className="text-white underline">Hide</button>
            </div>
            {errors.length === 0 ? (
                <div className="text-green-300">No global errors detected. System operational.</div>
            ) : (
                <ul className="list-disc pl-4 space-y-1">
                    {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
            )}
            <div className="mt-2 text-gray-400">
                Path: {window.location.pathname} | UA: {navigator.userAgent}
            </div>
        </div>
    );
};

export default GlobalDebug;
