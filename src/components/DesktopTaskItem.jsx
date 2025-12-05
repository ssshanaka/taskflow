import React, { useState } from 'react';
import { CheckCircle2, Trash2, Calendar, Star, Plus, ChevronRight, ChevronDown } from 'lucide-react';

const DesktopTaskItem = ({ 
  task, 
  onToggle, 
  onDelete, 
  onToggleStar, 
  onOpenDetails,
  onAddSubtask,
  level = 0,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = children && children.length > 0;

  return (
    <div>
      <div 
        className="group flex items-center gap-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors bg-white dark:bg-slate-900"
        style={{ paddingLeft: `${12 + level * 24}px` }}
      >
        {/* Expand/Collapse for parent tasks */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-slate-500" />
            ) : (
              <ChevronRight size={14} className="text-slate-500" />
            )}
          </button>
        ) : (
          <div className="flex-shrink-0 w-[18px]" />
        )}
        
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
        
        <div 
          className="flex-grow min-w-0 cursor-pointer" 
          onClick={() => onOpenDetails && onOpenDetails(task)}
        >
          <p className={`text-sm truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
            {task.title}
          </p>
          {(task.due || task._metadata) && (
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
              <Calendar size={10} />
              {task.due ? new Date(task.due).toLocaleDateString() : ''}
              {(() => {
                if (task._metadata) {
                  try {
                    const match = task._metadata.match(/\[TFCAL\](.*?)\[\/TFCAL\]/);
                    if (match) {
                      const meta = JSON.parse(match[1]);
                      if (meta._st) {
                         const timeStr = new Date(meta._st).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
                         return task.due ? ` • ${timeStr}` : timeStr;
                      }
                    }
                  } catch (e) {}
                }
                return null;
              })()}
            </div>
          )}
          {task.notes && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {task.notes}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add Subtask Button */}
          <button 
            onClick={() => onAddSubtask && onAddSubtask(task.id)}
            className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
            title="Add subtask"
          >
            <Plus size={14} />
          </button>
          <button 
            onClick={() => onToggleStar(task.id)}
            className={`p-1 transition-colors ${
              task.starred 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-slate-400 hover:text-yellow-500'
            }`}
            title={task.starred ? "Remove star" : "Add star"}
          >
            <Star size={14} className={task.starred ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default DesktopTaskItem;
