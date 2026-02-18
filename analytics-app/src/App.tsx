import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';

const DashboardLayout = lazy(() => import('./DashboardLayout'));
const CheckoutPage = lazy(() => import('./components/pages/CheckoutPage'));

import ErrorBoundary from './components/ui/ErrorBoundary';

const PaymentSuccessPage = lazy(() => import('./components/pages/PaymentSuccessPage'));
const WizardPage = lazy(() => import('./components/pages/WizardPage'));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ErrorBoundary>
            <LandingPage />
          </ErrorBoundary>
        } />
        <Route path="/checkout" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080C14]" />}>
            <CheckoutPage />
          </Suspense>
        } />
        <Route path="/payment-success" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080C14]" />}>
            <PaymentSuccessPage />
          </Suspense>
        } />
        <Route path="/wizard" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080C14]" />}>
            <WizardPage />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080C14]" />}>
            <DashboardLayout />
          </Suspense>
        } />
        {/* Catch-all for 404s and cache-busting filenames like v162.html */}
        <Route path="*" element={
          <ErrorBoundary>
            <LandingPage />
          </ErrorBoundary>
        } />
      </Routes>
    </Router>
  );
};

export default App;
