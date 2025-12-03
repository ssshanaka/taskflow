import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, FileText, AlertTriangle, Scale, Shield } from 'lucide-react';

const TermsPage = () => {
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
              <FileText size={12} />
              Legal Agreement
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
              Terms of Service
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
                <FileText className="text-blue-600 dark:text-blue-400" size={28} />
                Introduction
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Welcome to TaskFlow Desktop. These Terms of Service ("Terms") govern your use of our Progressive Web Application ("Service"). By accessing or using TaskFlow Desktop, you agree to be bound by these Terms.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                If you do not agree to these Terms, please do not use our Service.
              </p>
            </div>

            {/* Acceptance */}
            <div className="mb-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                By creating an account or using TaskFlow Desktop, you acknowledge that you have read, understood, and agree to be bound by these Terms and our{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Privacy Policy
                </Link>. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
            </div>

            {/* Use of Service */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Shield className="text-blue-600 dark:text-blue-400" size={28} />
                2. Use of Service
              </h2>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                2.1 License Grant
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                TaskFlow Desktop grants you a limited, non-exclusive, non-transferable, revocable license to use the Service for personal or commercial purposes in accordance with these Terms.
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                2.2 Acceptable Use
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                You agree to use the Service only for lawful purposes. You agree NOT to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                <li>Violate any local, state, national, or international law</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service to transmit malware, viruses, or harmful code</li>
                <li>Impersonate any person or entity</li>
                <li>Scrape or use automated tools to access the Service without permission</li>
                <li>Reverse engineer, decompile, or disassemble the Service (except as permitted by law)</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                2.3 Open Source
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                TaskFlow Desktop is an open-source project. The source code is available for review, modification, and contribution under the applicable open-source license. Commercial use of the code is subject to the license terms.
              </p>
            </div>

            {/* Accounts */}
            <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                3. Accounts & Security
              </h2>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                3.1 Google Account
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                To use TaskFlow Desktop, you must sign in with a Google account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                <li>Maintaining the security of your Google account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Complying with Google's Terms of Service</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                3.2 No Password Storage
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We do not store your Google password. Authentication is handled entirely by Google's OAuth 2.0 system. We receive only an access token that allows us to access your Google Tasks data on your behalf.
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                3.3 Account Termination
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You may stop using the Service at any time by signing out and revoking TaskFlow Desktop's access via{' '}
                <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Google Account Permissions
                </a>. We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </div>

            {/* Payments */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Scale className="text-blue-600 dark:text-blue-400" size={28} />
                4. Payments & Refunds
              </h2>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                4.1 Paid Plans
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                TaskFlow Desktop offers paid subscription plans (Pro and Team). By purchasing a paid plan, you agree to pay the fees specified on our{' '}
                <Link to="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Pricing Page
                </Link>.
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                4.2 Payment Processing
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Payments are processed by PayPal. We do not store your payment information. By making a purchase, you agree to PayPal's terms and privacy policy.
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                4.3 Billing & Renewals
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Paid plans are billed monthly. Subscriptions automatically renew unless cancelled. You will be charged the then-current price for your plan.
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                4.4 Refund Policy
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                We offer a 14-day money-back guarantee for first-time purchases:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>Full refund within 14 days of purchase</li>
                <li>Contact support@taskflow.app with your PayPal order ID</li>
                <li>Refunds typically processed within 5-7 business days</li>
                <li>After 14 days, refunds are handled case-by-case</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">
                4.5 Cancellation
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You may cancel your subscription anytime. Cancellation takes effect at the end of the current billing period. No partial refunds for unused time unless required by law.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mb-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={28} />
                5. Disclaimer of Warranties
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy or reliability of data</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                You use the Service at your own risk. We recommend backing up important data.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TASKFLOW DESKTOP AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Damages resulting from unauthorized access to or alteration of your data</li>
                <li>Damages resulting from any third-party services (e.g., Google, PayPal)</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS, OR $100, WHICHEVER IS GREATER.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                7. Indemnification
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You agree to indemnify and hold harmless TaskFlow Desktop, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
              </p>
            </div>

            {/* Changes */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. We will make reasonable efforts to notify users of material changes via:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>In-app notification</li>
                <li>Email (if we have your email address)</li>
                <li>Updated "Last Updated" date at the top of this page</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your continued use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                9. Governing Law & Jurisdiction
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Any disputes arising from these Terms or your use of the Service shall be resolved exclusively in the courts of [Your Jurisdiction]. You consent to the personal jurisdiction of such courts.
              </p>
            </div>

            {/* Severability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                10. Severability
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </div>

            {/* Entire Agreement */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                11. Entire Agreement
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and TaskFlow Desktop regarding the Service and supersede all prior agreements and understandings.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                12. Contact Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-900 dark:text-white font-semibold mb-1">TaskFlow Desktop Legal</p>
                <p className="text-slate-600 dark:text-slate-300">
                  Email:{' '}
                  <a href="mailto:legal@taskflow.app" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    legal@taskflow.app
                  </a>
                </p>
              </div>
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
            <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
