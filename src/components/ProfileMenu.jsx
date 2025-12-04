import React, { useState, useRef, useEffect } from 'react';
import { LogOut, UserPlus, Settings, ExternalLink, Monitor, ChevronDown, X, Check } from 'lucide-react';

const ProfileMenu = ({ 
  userProfile, 
  isDemoMode, 
  onLogout, 
  onSwitchAccount,
  onAddAccount,
  onSignIn,
  accounts = {},
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Demo user fallback image
  const demoImage = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/google-tasks.png";
  const profileImage = userProfile?.picture || demoImage;
  const userName = userProfile?.name || "Demo User";
  const userEmail = userProfile?.email || "demo@taskflow.app";

  // Get other accounts
  const otherAccounts = Object.values(accounts).filter(acc => acc.profile.email !== userEmail);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Profile Icon Button */}
      <button 
        onClick={toggleMenu}
        className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        <img 
          src={profileImage} 
          alt={userName} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[320px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          
          {/* Header / Current User */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img 
                src={profileImage} 
                alt={userName} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {userEmail}
                </div>
              </div>
            </div>
            
            {!isDemoMode && (
              <a
                href="https://myaccount.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full text-center py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Manage your Google Account
              </a>
            )}
            
            {isDemoMode && (
               <button
                onClick={() => {
                  setIsOpen(false);
                  onSignIn();
                }}
                className="mt-3 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5 bg-white rounded-full p-0.5" />
                Sign in with Google
              </button>
            )}
          </div>

          {/* Account Switcher */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {otherAccounts.length > 0 && (
              <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="px-4 pb-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Switch Account
                </div>
                {otherAccounts.map((account) => (
                  <button
                    key={account.profile.email}
                    onClick={() => {
                      setIsOpen(false);
                      onSwitchAccount(account.profile.email);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <img 
                      src={account.profile.picture} 
                      alt={account.profile.name} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {account.profile.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {account.profile.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddAccount();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <UserPlus size={16} />
                <span>Add another account</span>
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <a href="/privacy" className="hover:text-slate-800 dark:hover:text-slate-200">Privacy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-slate-800 dark:hover:text-slate-200">Terms</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
