import { useState, useEffect } from 'react';

const GOOGLE_CLIENT_ID = "824225213786-fv4vohfsuoh041fr802ds1abesdgc6go.apps.googleusercontent.com";

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'taskflow_auth_token',
  USER_PROFILE: 'taskflow_user_profile',
  TOKEN_EXPIRY: 'taskflow_token_expiry',
  IS_DEMO_MODE: 'taskflow_demo_mode'
};

// Token validity: 7 days in milliseconds
const TOKEN_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Secure storage utilities
 */
const SecureStorage = {
  // Save authentication session
  saveSession(token, profile, isDemoMode = false) {
    try {
      const expiryTime = Date.now() + TOKEN_VALIDITY_MS;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
      localStorage.setItem(STORAGE_KEYS.IS_DEMO_MODE, isDemoMode.toString());
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  },

  // Load existing session
  loadSession() {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const profileStr = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      const expiryStr = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      const isDemoStr = localStorage.getItem(STORAGE_KEYS.IS_DEMO_MODE);

      if (!token || !profileStr || !expiryStr) {
        return null;
      }

      // Check if token has expired
      const expiryTime = parseInt(expiryStr, 10);
      if (Date.now() > expiryTime) {
        console.log('Session expired, clearing storage');
        this.clearSession();
        return null;
      }

      const profile = JSON.parse(profileStr);
      const isDemoMode = isDemoStr === 'true';

      return { token, profile, isDemoMode };
    } catch (e) {
      console.error('Failed to load session:', e);
      this.clearSession();
      return null;
    }
  },

  // Clear all session data
  clearSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
      localStorage.removeItem(STORAGE_KEYS.IS_DEMO_MODE);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  },

  // Get days remaining until expiry
  getDaysUntilExpiry() {
    try {
      const expiryStr = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiryStr) return 0;
      
      const expiryTime = parseInt(expiryStr, 10);
      const msRemaining = expiryTime - Date.now();
      return Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
    } catch (e) {
      return 0;
    }
  }
};

/**
 * Custom hook to handle Google OAuth authentication with session persistence
 */
export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      // 1. Check for OAuth callback (new sign-in)
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        // New OAuth sign-in
        console.log('Processing OAuth callback...');
        window.history.replaceState(null, '', window.location.pathname);
        
        try {
          // Fetch user profile from Google
          const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          
          if (res.ok) {
            const profile = await res.json();
            
            // Save to localStorage
            SecureStorage.saveSession(accessToken, profile, false);
            
            setAuthToken(accessToken);
            setUserProfile(profile);
            setIsAuthenticated(true);
            setIsDemoMode(false);
            setSessionExpiry(SecureStorage.getDaysUntilExpiry());
          } else {
            console.error('Failed to fetch user profile');
          }
        } catch (e) {
          console.error("Profile fetch failed", e);
        }
      } else {
        // 2. Try to restore session from localStorage
        const savedSession = SecureStorage.loadSession();
        
        if (savedSession) {
          console.log('Restoring session from localStorage...');
          setAuthToken(savedSession.token);
          setUserProfile(savedSession.profile);
          setIsAuthenticated(true);
          setIsDemoMode(savedSession.isDemoMode);
          setSessionExpiry(SecureStorage.getDaysUntilExpiry());
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = () => {
    console.log('Logging out, clearing session...');
    SecureStorage.clearSession();
    setIsAuthenticated(false);
    setAuthToken(null);
    setUserProfile(null);
    setIsDemoMode(false);
    setSessionExpiry(null);
  };

  const startDemo = () => {
    const demoProfile = {
      name: "Demo User",
      email: "demo@taskflow.app",
      picture: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/google-tasks.png"
    };
    
    // Save demo session to localStorage
    SecureStorage.saveSession('demo_token', demoProfile, true);
    
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setUserProfile(demoProfile);
    setAuthToken('demo_token');
    setSessionExpiry(SecureStorage.getDaysUntilExpiry());
  };

  return {
    isAuthenticated,
    authToken,
    userProfile,
    isDemoMode,
    isLoading,
    sessionExpiry,
    logout,
    startDemo,
    GOOGLE_CLIENT_ID
  };
}
