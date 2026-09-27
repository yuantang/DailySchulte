import React, { useState, useEffect } from 'react';
import { RoutePath } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SupportPage } from './pages/SupportPage';

export const App: React.FC = () => {
  // Normalize initial path
  const getInitialPath = (): RoutePath => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    if (path === '/privacy' || path === '/terms' || path === '/support') {
      return path as RoutePath;
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<RoutePath>(getInitialPath);

  // Sync state on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: RoutePath) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentPath === '/' && <HomePage />}
        {currentPath === '/privacy' && <PrivacyPage />}
        {currentPath === '/terms' && <TermsPage />}
        {currentPath === '/support' && <SupportPage />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
