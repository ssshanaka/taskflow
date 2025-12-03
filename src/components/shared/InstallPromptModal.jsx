import React from 'react';
import { X, Monitor } from 'lucide-react';

const InstallPromptModal = ({ isOpen, onClose, onInstall, canInstall }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={24} /></button>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><Monitor size={32} /></div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{canInstall ? "Install TaskFlow Desktop" : "Run in Desktop Mode"}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{canInstall ? "Install this app on your device for quick access, offline support, and a native experience." : "Experience the desktop application interface right here in your browser."}</p>
          <button onClick={onInstall} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">{canInstall ? "Install Now" : "Launch Desktop App View"}</button>
        </div>
      </div>
    </div>
  );
};

export default InstallPromptModal;
