import { useEffect } from 'react';

/**
 * Custom hook to manage keyboard shortcuts
 * @param {boolean} enabled - Whether shortcuts are enabled
 * @param {Array} shortcuts - Array of shortcut definitions
 * Each shortcut: { key: string, ctrl?: boolean, shift?: boolean, handler: function }
 */
const useKeyboardShortcuts = (enabled, shortcuts) => {
  useEffect(() => {
    if (!enabled || !shortcuts || shortcuts.length === 0) return;

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in input fields, textareas, or contenteditable
      const target = event.target;
      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true';

      // Exception: Allow Esc to work even in input fields
      if (isInputField && event.key !== 'Escape') {
        return;
      }

      // Find matching shortcut
      for (const shortcut of shortcuts) {
        const keyMatch = event.key === shortcut.key || event.code === shortcut.code;
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.handler(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, shortcuts]);
};

export default useKeyboardShortcuts;
