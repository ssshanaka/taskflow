import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Check } from 'lucide-react';

const TaskDetailsPanel = ({ task, listId, onClose, onUpdate, isDarkMode }) => {
  const [title, setTitle] = useState(task.title || '');
  const [notes, setNotes] = useState(task.notes || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task.due) {
      const d = new Date(task.due);
      setDate(d.toISOString().split('T')[0]);
      
      // Try to get time from metadata first (source of truth for Calendar tasks)
      if (task._metadata) {
         try {
            const meta = JSON.parse(task._metadata.match(/\[TFCAL\](.*?)\[\/TFCAL\]/)[1]);
            if (meta._st) {
               const start = new Date(meta._st);
               setTime(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
            }
         } catch(e) { console.warn("Failed to parse metadata time", e); }
      } else if (task.due.includes('T') && !task.due.includes('T00:00:00')) {
         // Fallback to due date time
         setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      }
    }
  }, [task]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let dueDateTime = null;
      if (date) {
        if (time) {
          dueDateTime = new Date(`${date}T${time}`).toISOString();
        } else {
          dueDateTime = new Date(date).toISOString();
        }
      }

      const updates = {
        title,
        notes,
        due: dueDateTime
      };
      
      // If time is set, explicit signal to update startTime (for Calendar)
      if (time && dueDateTime) {
         updates.startTime = dueDateTime;
      }
      
      await onUpdate(listId, task.id, updates);
      onClose();
    } catch (e) {
      console.error('Failed to update task', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Task Details
          </span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-400 text-slate-900 dark:text-white"
              placeholder="Task title"
              autoFocus
            />
          </div>

          {/* Date & Time Row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock size={14} />
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileText size={14} />
              Description
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              placeholder="Add details..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;
