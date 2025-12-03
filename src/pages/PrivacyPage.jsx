import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Shield, Database, Users, Globe, Lock, Mail } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = "December 3, 2025";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              TaskFlow<span className="text-blue-600 dark:text-blue-400">Desktop</span>
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide mb-6">
              <Shield size={12} />
              Your Privacy Matters
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Shield className="text-blue-600 dark:text-blue-400" size={28} />
                Introduction
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                TaskFlow Desktop ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Progressive Web Application (PWA).
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                TaskFlow Desktop is a client-side application that runs entirely in your browser. We do not operate a backend server that stores your data.
              </p>
            </div>

            {/* Data Collection */}
            <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Database className="text-blue-600 dark:text-blue-400" size={28} />
                Data We Collect
              </h2>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                1. Google Account Information
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                When you sign in with Google, we receive and temporarily store:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                <li>Your name</li>
                <li>Your email address</li>
                <li>Your profile picture</li>
                <li>OAuth access token (for Google Tasks API access)</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                2. Task Data
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Your Google Tasks data (task lists, tasks, notes, due dates) is:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                <li>Fetched directly from Google's servers via their API</li>
                <li>Cached in your browser's localStorage for performance</li>
                <li><strong>Never sent to our servers</strong> (we don't have any servers storing this data)</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                3. Application Settings
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                We store the following preferences locally in your browser:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                <li>Dark mode preference</li>
                <li>Selected task list</li>
                <li>UI state (sidebar collapsed, etc.)</li>
                <li>Demo mode data (if you use Demo Mode)</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                4. Analytics (Optional - If Implemented)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Currently, we do not collect analytics. If we add analytics in the future, we will update this policy and notify users. Any analytics would be anonymous and used solely to improve the application.
              </p>
            </div>

            {/* Data Storage */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Lock className="text-blue-600 dark:text-blue-400" size={28} />
                How We Store Your Data
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                All data is stored <strong>locally on your device</strong> using browser technologies:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-3 mb-4">
                <li><strong>localStorage</strong>: Stores your authentication token, preferences, and cached task data</li>
                <li><strong>PWA Cache</strong>: Stores application files for offline functionality</li>
                <li><strong>IndexedDB</strong>: May be used for larger data sets in future updates</li>
              </ul>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <strong>Important:</strong> Since data is stored locally, clearing your browser data will delete all locally cached information. Your tasks remain safe in your Google account.
              </p>
            </div>

            {/* Third-Party Services */}
            <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Globe className="text-blue-600 dark:text-blue-400" size={28} />
                Third-Party Services
              </h2>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                1. Google Services
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                We use Google's services for authentication and task management:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-3">
                <li><strong>Google OAuth 2.0</strong>: For secure sign-in</li>
                <li><strong>Google Tasks API</strong>: To read and write your tasks</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your use of Google services is governed by{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Google's Privacy Policy
                </a>.
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                2. PayPal (For Paid Plans)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                If you purchase a paid plan, payment processing is handled by PayPal:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-3">
                <li>We do not store or process credit card information</li>
                <li>Payment data is handled entirely by PayPal's secure servers</li>
                <li>We receive only order confirmation details (Order ID, email, plan selected)</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                PayPal's data handling is governed by{' '}
                <a href="https://www.paypal.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  PayPal's Privacy Policy
                </a>.
              </p>
            </div>

            {/* User Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Users className="text-blue-600 dark:text-blue-400" size={28} />
                Your Rights & GDPR Compliance
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-3">
                <li><strong>Access</strong>: You can view all data stored locally in your browser's developer tools (localStorage)</li>
                <li><strong>Delete</strong>: Clear your browser data or sign out to remove locally cached information</li>
                <li><strong>Export</strong>: Your task data can be exported from Google Tasks directly</li>
                <li><strong>Revoke Access</strong>: Disconnect TaskFlow from your Google account at any time via{' '}
                  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Google Account Permissions
                  </a>
                </li>
                <li><strong>Data Portability</strong>: Export your data anytime through Google Takeout</li>
              </ul>
            </div>

            {/* Cookies */}
            <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Cookies & Tracking
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                We use minimal cookies and tracking:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                <li><strong>Authentication Cookies</strong>: From Google OAuth (required for sign-in)</li>
                <li><strong>localStorage</strong>: For app preferences and cached data (not technically cookies)</li>
                <li><strong>No Third-Party Tracking</strong>: We do not use advertising or analytics cookies</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Mail className="text-blue-600 dark:text-blue-400" size={28} />
                Contact Us
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or want to exercise your data rights, please contact us:
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-slate-900 dark:text-white font-semibold mb-2">TaskFlow Desktop Privacy Team</p>
                <p className="text-slate-600 dark:text-slate-300">
                  Email:{' '}
                  <a href="mailto:privacy@taskflow.app" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    privacy@taskflow.app
                  </a>
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                  We will respond to privacy requests within 30 days.
                </p>
              </div>
            </div>

            {/* Updates */}
            <div className="mb-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Changes to This Policy
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Significant changes will be announced via the application or email (if we have it).
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 dark:bg-white rounded flex items-center justify-center text-white dark:text-slate-900">
              <CheckCircle2 size={14} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">TaskFlow Desktop</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} TaskFlow Open Source. Not affiliated with Google.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
            <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
