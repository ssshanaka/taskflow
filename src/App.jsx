import React, { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [viewMode, setViewMode] = useState('landing');
  
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
      if (isStandalone) setViewMode('app');
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
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const confirmInstall = async () => {
    setShowModal(false);
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    } else {
      setViewMode('app');
    }
  };
  
  const handleLogout = () => {
    logout();
    setViewMode('landing');
  };

  // If running as standalone PWA or authenticated, show the App UI
  if (viewMode === 'app' || isAuthenticated) {
    if (!isAuthenticated) {
      // Show login screen in app frame for standalone PWA
      return (
        <div className={`h-full w-full bg-slate-100 dark:bg-slate-950 transition-colors duration-300 font-sans ${isDarkMode ? 'dark' : ''} fixed inset-0`}>
           <div className="h-10 bg-slate-200 dark:bg-slate-800 flex items-center justify-between px-4 border-b border-slate-300 dark:border-slate-700 select-none">
             <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400/50" /><div className="w-3 h-3 rounded-full bg-slate-400/50" /><div className="w-3 h-3 rounded-full bg-slate-400/50" /></div>
             <div className="text-xs text-slate-500">Sign In Required</div>
             <div className="w-16"></div>
           </div>
           <LoginScreen 
             onDemoLogin={startDemo} 
             hasClientId={!!GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("YOUR_CLIENT_ID")} 
             googleClientId={GOOGLE_CLIENT_ID}
           />
        </div>
      );
    }
    
    // Authenticated - show full app
    return (
      <div className={`${isDarkMode ? 'dark' : ''} h-screen w-screen overflow-hidden font-sans`}>
        <AppPage 
          isDarkMode={isDarkMode} 
          isStandalone={true} 
          onLogout={handleLogout}
          userProfile={userProfile}
          authToken={authToken}
          isDemoMode={isDemoMode}
          sessionExpiry={sessionExpiry}
        />
      </div>
    );
  }

  // Show landing page
  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300 font-sans`}>
      <LandingPage 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        showModal={showModal}
        setShowModal={setShowModal}
        installPrompt={installPrompt}
        confirmInstall={confirmInstall}
        isAuthenticated={isAuthenticated}
        userProfile={userProfile}
        authToken={authToken}
        isDemoMode={isDemoMode}
        onDemoLogin={startDemo}
        onLogout={handleLogout}
        googleClientId={GOOGLE_CLIENT_ID}
        sessionExpiry={sessionExpiry}
      />
    </div>
  );
}