import React from 'react';
import { X, Keyboard } from 'lucide-react';

const KeyboardShortcutsModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Global Navigation',
      items: [
        { keys: ['Ctrl', '?'], description: 'Show keyboard shortcuts' },
        { keys: ['Ctrl', '1-9'], description: 'Switch to list N' },
        { keys: ['Esc'], description: 'Close modal / Clear selection' },
      ]
    },
    {
      category: 'Task Management',
      items: [
        { keys: ['Ctrl', 'N'], description: 'Create new task' },
        { keys: ['Space'], description: 'Complete selected task' },
        { keys: ['Enter'], description: 'Edit selected task' },
        { keys: ['Delete'], description: 'Delete selected task' },
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['↑'], description: 'Move selection up' },
        { keys: ['↓'], description: 'Move selection down' },
      ]
    },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Keyboard size={20} className="text-blue-500" />
            Keyboard Shortcuts
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {shortcuts.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {section.category}
                </h4>
                <div className="space-y-2">
                  {section.items.map((shortcut, itemIdx) => (
                    <div 
                      key={itemIdx}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <React.Fragment key={keyIdx}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded shadow-sm min-w-[2rem] text-center">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-slate-400 text-xs mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
