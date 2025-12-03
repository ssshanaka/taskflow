import React from 'react';
import { Download, Star, RotateCw, Layout, Zap, Smartphone, Moon, Menu, Shield, Cloud, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoginScreen from '../components/LoginScreen';
import LaptopMockup from '../components/shared/LaptopMockup';
import FeatureCard from '../components/shared/FeatureCard';
import StepCard from '../components/shared/StepCard';
import PricingCard from '../components/shared/PricingCard';
import InstallPromptModal from '../components/shared/InstallPromptModal';
import AppPage from './AppPage';

const LandingPage = ({ 
  isDarkMode, 
  toggleDarkMode, 
  showModal, 
  setShowModal, 
  installPrompt,
  confirmInstall,
  isAuthenticated,
  userProfile,
  authToken,
  isDemoMode,
  onDemoLogin,
  onLogout,
  googleClientId,
  sessionExpiry
}) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onInstall={() => setShowModal(true)} />
      <InstallPromptModal isOpen={showModal} onClose={() => setShowModal(false)} onInstall={confirmInstall} canInstall={!!installPrompt} />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10 transition-colors duration-300" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:gap-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide mb-6"><Star size={12} className="fill-current" />#1 PWA Task Client</div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">Google Tasks on your <br className="hidden lg:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Desktop</span></h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">Experience the clean, focused task management you love. Install as a native app on Windows, macOS, or Linux directly from your browser.</p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
                <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-blue-900/20 hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-3 w-full sm:w-auto justify-center"><Download size={22} />Install App</button>
                <div className="text-xs text-slate-400 font-medium px-4">v3.0.0 • PWA • All Platforms</div>
              </div>
            </div>
            
            {/* Laptop Preview */}
            <div className="w-full relative z-10 px-2 sm:px-4">
               <LaptopMockup>
                 {isAuthenticated ? (
                    <AppPage 
                      isDarkMode={isDarkMode} 
                      isStandalone={false} 
                      onLogout={onLogout}
                      userProfile={userProfile}
                      authToken={authToken}
                      isDemoMode={isDemoMode}
                      sessionExpiry={sessionExpiry}
                    />
                 ) : (
                    <div className="h-full w-full bg-slate-100 dark:bg-slate-950 relative">
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 flex items-center justify-between px-4 border-b border-slate-300 dark:border-slate-700 select-none">
                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400/50" /><div className="w-3 h-3 rounded-full bg-slate-400/50" /><div className="w-3 h-3 rounded-full bg-slate-400/50" /></div>
                        <div className="text-xs text-slate-500">Sign In</div>
                        <div className="w-16"></div>
                      </div>
                      <LoginScreen onDemoLogin={onDemoLogin} hasClientId={!!googleClientId && !googleClientId.includes("YOUR_CLIENT_ID")} googleClientId={googleClientId} />
                    </div>
                 )}
               </LaptopMockup>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center"><p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Trusted by productive people worldwide</p><div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 dark:invert dark:hover:invert-0"><span className="text-xl font-bold text-slate-800 dark:text-slate-200">ACME Corp</span><span className="text-xl font-bold text-slate-800 dark:text-slate-200">GlobalTech</span><span className="text-xl font-bold text-slate-800 dark:text-slate-200">Nebula</span><span className="text-xl font-bold text-slate-800 dark:text-slate-200">FoxRun</span><span className="text-xl font-bold text-slate-800 dark:text-slate-200">Circle</span></div></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950 scroll-mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Native power, Web flexibility.</h2><p className="text-lg text-slate-600 dark:text-slate-400">TaskFlow PWA brings the best of both worlds. Light as a website, powerful as a native app.</p></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={RotateCw} title="Instant Sync" description="Changes sync instantly via Google Tasks API. Work offline and sync when you reconnect." />
            <FeatureCard icon={Layout} title="Standalone Window" description="Runs in its own window without browser chrome. Launch it from your Start Menu or Dock." />
            <FeatureCard icon={Zap} title="Zero Install Size" description="No 100MB+ installer files. The app caches instantly and takes up minimal space on your drive." />
            <FeatureCard icon={Moon} title="Dark Mode" description="Automatically matches your system theme preferences or toggle manually." />
            <FeatureCard icon={Smartphone} title="Cross Platform" description="One app works everywhere: Windows, macOS, Linux, ChromeOS, and even Android." />
            <FeatureCard icon={Menu} title="Full Feature Set" description="Subtasks, due dates, lists, and drag-and-drop organization." />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 scroll-mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Installation made simple.</h2><p className="text-lg text-slate-600 dark:text-slate-400">Forget .exe files and wizards. PWA technology makes installation instantaneous.</p></div>
          <div className="grid md:grid-cols-3 gap-12 relative">
             <StepCard number="1" icon={Download} title="Click Install" description="Click the 'Install App' button in the navigation bar or the prompt in your browser address bar." />
             <StepCard number="2" icon={Shield} title="Confirm" description="Your browser will ask for confirmation. The app is verified and safe." />
             <StepCard number="3" icon={Cloud} title="Launch" description="TaskFlow is added to your desktop. Launch it just like any other program." />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950 scroll-mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Free forever.</h2><p className="text-lg text-slate-600 dark:text-slate-400">TaskFlow PWA is open source and free to use.</p></div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard tier="Personal" price="$0" period="/ forever" recommended={false} onDownload={() => setShowModal(true)} features={["Unlimited Tasks", "Google Account Sync", "Subtasks & Notes", "Dark Mode", "Basic Support"]} />
            <PricingCard tier="Pro" price="$4.99" period="/ month" recommended={true} onDownload={() => setShowModal(true)} features={["Everything in Personal", "Multiple Google Accounts", "Custom Themes", "Priority Support", "Early Access"]} />
            <PricingCard tier="Team" price="$19" period="/ month" recommended={false} onDownload={() => setShowModal(true)} features={["Up to 5 Pro Accounts", "Centralized Billing", "Team Onboarding", "Priority Features", "Account Manager"]} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6"><div className="flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 dark:bg-white rounded flex items-center justify-center text-white dark:text-slate-900"><CheckCircle2 size={14} /></div><span className="font-bold text-slate-900 dark:text-white">TaskFlow Desktop</span></div><div className="text-slate-500 dark:text-slate-400 text-sm">© {new Date().getFullYear()} TaskFlow Open Source. Not affiliated with Google.</div><div className="flex gap-6 text-slate-400 dark:text-slate-500"><a href="#" className="hover:text-slate-900 dark:hover:text-white"><CheckCircle2 size={20}/></a><a href="#" className="hover:text-slate-900 dark:hover:text-white"><Layout size={20}/></a></div></div>
      </footer>
    </div>
  );
};

export default LandingPage;
