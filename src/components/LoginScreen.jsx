import React from 'react';
import { AlertCircle, Monitor } from 'lucide-react';

const SCOPES = 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

const LoginScreen = ({ onDemoLogin, hasClientId, googleClientId }) => {
  const handleGoogleLogin = () => {
    // Construct the OAuth 2.0 URL using Implicit Flow
    const redirectUri = window.location.origin + window.location.pathname;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(SCOPES)}` +
      `&include_granted_scopes=true` +
      `&state=taskflow_auth` +
      `&prompt=consent select_account`;

    // Redirect the user to Google
    window.location.href = authUrl;
  };

  return (
    <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-inner">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Welcome to TaskFlow</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Sign in to sync your tasks across devices.</p>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={!hasClientId}
            className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-3 relative group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
          
          {!hasClientId && (
             <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                   <strong>Config Required:</strong> Add your <code>CLIENT_ID</code> to App.jsx to enable Google sign-in.
                </p>
             </div>
          )}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-700"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-800 px-2 text-slate-500">Or continue with</span></div>
          </div>

          <button 
            onClick={onDemoLogin}
            className="w-full py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-3"
          >
            <Monitor size={20} />
            Demo Mode (Offline)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
