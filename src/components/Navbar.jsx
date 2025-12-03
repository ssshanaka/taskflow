import React from 'react';
import { CheckCircle2, Download, Moon, Sun } from 'lucide-react';

const Navbar = ({ isDarkMode, toggleDarkMode, onInstall }) => (
  <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30"><CheckCircle2 size={20} /></div><span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">TaskFlow<span className="text-blue-600 dark:text-blue-400">Desktop</span></span></div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300"><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a><a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a><a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></div>
      <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Toggle Dark Mode">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
        <button onClick={onInstall} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2"><Download size={16} />Install App</button>
      </div>
    </div>
  </nav>
);

export default Navbar;
