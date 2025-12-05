import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Sparkles, Keyboard, Palette, Download } from 'lucide-react';
import ExportModal from './ExportModal';

const SettingsMenu = ({ isDarkMode, toggleDarkMode, taskLists, onExport, shortcutsEnabled, onToggleShortcuts, geminiEnabled, onToggleGemini }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        aria-label="Settings menu"
        aria-expanded={isOpen}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="py-2">
            {/* Gemini Support */}
            <div 
              className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" 
              onClick={() => onToggleGemini && onToggleGemini()}
            >
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <Sparkles size={18} className="text-blue-500" />
                <span className="text-sm font-medium">Gemini Support</span>
              </div>
              {/* Toggle Switch */}
              <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${geminiEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${geminiEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div 
              className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative" 
              onClick={() => onToggleShortcuts && onToggleShortcuts()}
            >
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <Keyboard size={18} className="text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium">Keyboard Shortcuts</span>
              </div>
              {/* Toggle Switch */}
              <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${shortcutsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${shortcutsEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-0 w-64 bg-slate-900 dark:bg-slate-800 text-white text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] shadow-xl border border-slate-700">
                <div className="font-semibold mb-2 text-blue-400">Available Shortcuts:</div>
                <div className="space-y-1 text-[10px] leading-relaxed">
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">Ctrl+?</kbd> Show shortcuts</div>
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">Ctrl+1-9</kbd> Switch lists</div>
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">Ctrl+N</kbd> New task</div>
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">↑/↓</kbd> Navigate tasks</div>
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">Space</kbd> Complete task</div>
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">Enter</kbd> Edit task</div>
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">Delete</kbd> Delete task</div>
                  <div><kbd className="bg-slate-700 px-1 py-0.5 rounded text-[9px]">Esc</kbd> Close/Clear</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

            {/* Change Theme */}
            <button 
              onClick={() => {
                toggleDarkMode();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-200 text-left"
            >
              <Palette size={18} className="text-purple-500" />
              <span className="text-sm font-medium">Change Theme</span>
            </button>

            {/* Export */}
            <button 
              onClick={() => {
                setIsOpen(false);
                setIsExportModalOpen(true);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-200 text-left"
            >
              <Download size={18} className="text-green-500" />
              <span className="text-sm font-medium">Export to CSV/JSON</span>
            </button>
          </div>
        </div>
      )}

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        taskLists={taskLists}
        onExport={onExport}
      />
    </div>
  );
};

export default SettingsMenu;
