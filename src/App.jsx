import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import PricingPage from './pages/PricingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LoginScreen from './components/LoginScreen';

function AppRoutes() {
  const [showModal, setShowModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dark mode with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('taskflow_dark_mode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Use custom auth hook
  const { 
    isAuthenticated, 
    authToken, 
    userProfile, 
    isDemoMode, 
    isLoading,
    sessionExpiry,
    logout, 
    startDemo,
    GOOGLE_CLIENT_ID 
  } = useAuth();

  // PWA Installation Logic
  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone || 
                          document.referrer.includes('android-app://');
      // If running as standalone PWA and not already on /app, navigate to /app
      if (isStandalone && location.pathname === '/') {
        navigate('/app');
      }
    };
    
    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [navigate, location.pathname]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('taskflow_dark_mode', newMode.toString());
      return newMode;
    });
  };
  
  const confirmInstall = async () => {
    setShowModal(false);
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    } else {
      navigate('/app');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Routes>
      {/* Landing Page Route */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/app" replace />
          ) : (
            <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300 font-sans`}>
              <LandingPage 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                showModal={showModal}
                setShowModal={setShowModal}
                installPrompt={installPrompt}
                confirmInstall={confirmInstall}
                onDemoLogin={() => {
                  startDemo();
                  navigate('/app');
                }}
                googleClientId={GOOGLE_CLIENT_ID}
              />
            </div>
          )
        } 
      />

      {/* App Route */}
      <Route 
        path="/app" 
        element={
          !isAuthenticated ? (
            // Show login screen in app frame for unauthenticated users
            <div className={`h-full w-full bg-slate-100 dark:bg-slate-950 transition-colors duration-300 font-sans ${isDarkMode ? 'dark' : ''} fixed inset-0`}>
               <div className="h-10 bg-slate-200 dark:bg-slate-800 flex items-center justify-between px-4 border-b border-slate-300 dark:border-slate-700 select-none">
                 <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400/50" /><div className="w-3 h-3 rounded-full bg-slate-400/50" /><div className="w-3 h-3 rounded-full bg-slate-400/50" /></div>
                 <div className="text-xs text-slate-500">Sign In Required</div>
                 <div className="w-16"></div>
               </div>
               <LoginScreen 
                 onDemoLogin={() => {
                   startDemo();
                   navigate('/app');
                 }} 
                 hasClientId={!!GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("YOUR_CLIENT_ID")} 
                 googleClientId={GOOGLE_CLIENT_ID}
               />
            </div>
          ) : (
            // Authenticated - show full app
            <div className={`${isDarkMode ? 'dark' : ''} h-screen w-screen overflow-hidden font-sans`}>
              <AppPage 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode}
                isStandalone={true} 
                onLogout={handleLogout}
                userProfile={userProfile}
                authToken={authToken}
                isDemoMode={isDemoMode}
                sessionExpiry={sessionExpiry}
              />
            </div>
          )
        } 
      />

      {/* Business Pages Routes */}
      <Route 
        path="/pricing" 
        element={
          <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300 font-sans`}>
            <PricingPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        } 
      />

      <Route 
        path="/privacy" 
        element={
          <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300 font-sans`}>
            <PrivacyPage />
          </div>
        } 
      />

      <Route 
        path="/terms" 
        element={
          <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300 font-sans`}>
            <TermsPage />
          </div>
        } 
      />

      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}