import React from 'react';
import { CheckCircle2, Trash2, Calendar } from 'lucide-react';

const DesktopTaskItem = ({ task, onToggle, onDelete }) => (
  <div className="group flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors bg-white dark:bg-slate-900">
    <button 
      onClick={() => onToggle(task.id, task.status)}
      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        task.status === 'completed' 
          ? 'bg-blue-600 border-blue-600' 
          : 'border-slate-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500'
      }`}
    >
      {task.status === 'completed' && <CheckCircle2 size={14} className="text-white" />}
    </button>
    <div className="flex-grow min-w-0">
      <p className={`text-sm truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
        {task.title}
      </p>
      {task.due && (
        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
          <Calendar size={10} />
          {new Date(task.due).toLocaleDateString()}
        </div>
      )}
    </div>
    <button 
      onClick={() => onDelete(task.id)}
      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

export default DesktopTaskItem;
