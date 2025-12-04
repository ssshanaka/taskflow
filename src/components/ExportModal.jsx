import React, { useState, useEffect } from 'react';
import { X, Download, FileJson, FileSpreadsheet, CheckSquare, Square } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, taskLists, onExport }) => {
  const [selectedListIds, setSelectedListIds] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen && taskLists) {
      // Select all by default
      setSelectedListIds(new Set(taskLists.map(list => list.id)));
    }
  }, [isOpen, taskLists]);

  if (!isOpen) return null;

  const toggleList = (listId) => {
    const newSelected = new Set(selectedListIds);
    if (newSelected.has(listId)) {
      newSelected.delete(listId);
    } else {
      newSelected.add(listId);
    }
    setSelectedListIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedListIds.size === taskLists.length) {
      setSelectedListIds(new Set());
    } else {
      setSelectedListIds(new Set(taskLists.map(list => list.id)));
    }
  };

  const handleExport = async (format) => {
    if (selectedListIds.size === 0) return;
    
    setIsExporting(true);
    try {
      await onExport(Array.from(selectedListIds), format);
      onClose();
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download size={20} className="text-blue-500" />
            Export Tasks
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Lists to Export
            </span>
            <button 
              onClick={toggleAll}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {selectedListIds.size === taskLists.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2 space-y-1">
            {taskLists.map(list => {
              const isSelected = selectedListIds.has(list.id);
              return (
                <div 
                  key={list.id}
                  onClick={() => toggleList(list.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                    {list.title}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-2 text-xs text-slate-500 text-center">
            {selectedListIds.size} list{selectedListIds.size !== 1 ? 's' : ''} selected
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={selectedListIds.size === 0 || isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <FileSpreadsheet size={18} className="text-green-600 dark:text-green-500" />
            <span>CSV</span>
          </button>
          
          <button
            onClick={() => handleExport('json')}
            disabled={selectedListIds.size === 0 || isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          >
            <FileJson size={18} />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
