import React, { useState, useEffect } from 'react';
import { Plus, RotateCw, Cloud, MoreVertical, List, LogOut, CheckCircle2, Moon, Sun } from 'lucide-react';
import GoogleTasksService from '../services/GoogleTasksService';
import MockTasksService from '../services/MockTasksService';
import DesktopTaskItem from '../components/DesktopTaskItem';

const AppPage = ({ isDarkMode, toggleDarkMode, isStandalone, onLogout, userProfile, authToken, isDemoMode, sessionExpiry }) => {
  const [api, setApi] = useState(null);
  const [taskLists, setTaskLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const [inputValue, setInputValue] = useState("");
  const [newListValue, setNewListValue] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [error, setError] = useState(null);

  // Initialize API Service and load lists
  useEffect(() => {
    const initializeAPI = async () => {
      setIsLoadingLists(true);
      setError(null);
      
      try {
        const service = isDemoMode 
          ? new MockTasksService() 
          : new GoogleTasksService(authToken);
        
        setApi(service);
        
        // Load task lists
        const data = await service.getTaskLists();
        if (data && data.items) {
          const uniqueItems = Array.from(new Map(data.items.map(item => [item.id, item])).values());
          setTaskLists(uniqueItems);
          
          if (uniqueItems.length > 0) {
            setCurrentListId(uniqueItems[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to initialize API", e);
        setError(e.message || "Failed to load tasks. Please try again.");
      } finally {
        setIsLoadingLists(false);
      }
    };

    if (authToken || isDemoMode) {
      initializeAPI();
    }
  }, [authToken, isDemoMode]);

  // Fetch Tasks when List Changes
  useEffect(() => {
    if (!api || !currentListId) return;
    loadTasks(currentListId);
  }, [currentListId, api]);

  const loadTasks = async (listId) => {
    setIsSyncing(true);
    try {
      const data = await api.getTasks(listId);
      const uniqueItems = data.items ? Array.from(new Map(data.items.map(item => [item.id, item])).values()) : [];
      setTasks(uniqueItems);
    } catch (e) {
      console.error("Failed to load tasks", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentListId) return;
    
    const tempId = `temp_${Date.now()}`;
    const newTask = { id: tempId, title: inputValue, status: 'needsAction' };
    setTasks([newTask, ...tasks]);
    setInputValue("");
    setIsSyncing(true);

    try {
      await api.insertTask(currentListId, newTask.title);
      await loadTasks(currentListId);
    } catch (e) {
      console.error("Failed to add task", e);
      setTasks(prev => prev.filter(t => t.id !== tempId));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    setIsSyncing(true);

    try {
      await api.updateTask(currentListId, taskId, newStatus);
    } catch (e) {
      console.error("Update failed", e);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: currentStatus } : t));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const oldTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId));
    setIsSyncing(true);
    try {
      await api.deleteTask(currentListId, taskId);
    } catch (e) {
      console.error("Delete failed", e);
      setTasks(oldTasks);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListValue.trim()) return;
    setIsSyncing(true);
    try {
      const newList = await api.insertTaskList(newListValue);
      setTaskLists(prev => [...prev, newList]);
      setCurrentListId(newList.id);
      setNewListValue("");
      setIsAddingList(false);
    } catch (e) {
      console.error("List creation failed", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Loading state
  if (isLoadingLists) {
    return (
      <div className={`flex items-center justify-center h-full bg-white dark:bg-slate-900 ${isStandalone ? 'h-screen w-screen' : ''}`}>
        <div className="text-center">
          <RotateCw size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center h-full bg-white dark:bg-slate-900 p-4 ${isStandalone ? 'h-screen w-screen' : ''}`}>
        <div className="text-center max-w-2xl p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Failed to Load Tasks</h3>
          <div className="text-left bg-white dark:bg-slate-900 p-4 rounded-lg mb-6 border border-slate-200 dark:border-slate-600">
            <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">{error}</pre>
          </div>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={onLogout}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 ${isStandalone ? 'h-screen w-screen' : ''}`}>
      {!isStandalone && (
        <div className="h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 select-none flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium">TaskFlow Desktop</div>
          <div className="w-16"></div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden sm:flex flex-shrink-0">
          <div className="p-4">
             {isAddingList ? (
               <form onSubmit={handleCreateList} className="mb-2">
                 <input 
                   autoFocus
                   type="text" 
                   value={newListValue}
                   onChange={(e) => setNewListValue(e.target.value)}
                   onBlur={() => !newListValue && setIsAddingList(false)}
                   placeholder="List Name..."
                   className="w-full px-3 py-2 text-sm rounded-lg border border-blue-500 outline-none bg-white dark:bg-slate-900"
                 />
               </form>
             ) : (
               <button 
                  onClick={() => setIsAddingList(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <Plus size={16} />
                  <span>New List</span>
                </button>
             )}
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
            {taskLists.map((list) => (
              <button
                key={list.id}
                onClick={() => setCurrentListId(list.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 ${
                  currentListId === list.id 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <List size={16} />
                <span className="truncate">{list.title}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center gap-3 px-1 mb-3">
               {userProfile?.picture && <img src={userProfile.picture} alt={userProfile.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600" />}
               <div className="min-w-0 flex-1">
                 <div className="font-bold text-xs dark:text-slate-200 truncate">{userProfile?.name}</div>
                 <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate">{userProfile?.email}</div>
                 {sessionExpiry && !isDemoMode && (
                   <div className="text-green-600 dark:text-green-400 text-[9px] mt-0.5 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     Session: {sessionExpiry} {sessionExpiry === 1 ? 'day' : 'days'} left
                   </div>
                 )}
               </div>
            </div>
            <button onClick={onLogout} className="w-full text-left px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-2 transition-colors">
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
          <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-3">
              {taskLists.find(l => l.id === currentListId)?.title || "Select a list"}
              {isSyncing && <RotateCw size={14} className="text-blue-500 animate-spin" />}
            </h2>
            <div className="flex items-center gap-3 text-slate-400">
               {/* Dark Mode Toggle */}
               <button
                 onClick={toggleDarkMode}
                 className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                 aria-label="Toggle dark mode"
                 title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
               >
                 {isDarkMode ? (
                   <Sun size={18} className="text-slate-400 group-hover:text-yellow-500 transition-colors" />
                 ) : (
                   <Moon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                 )}
               </button>
               
               {/* Sync Indicator */}
               <div className="relative group">
                 <span className={`absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 ${isSyncing ? 'animate-pulse' : ''}`}></span>
                 <Cloud size={18} />
                 <div className="absolute right-0 top-6 w-32 bg-black text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-center z-50">
                   {isDemoMode ? "Demo Mode (Local)" : "Google Sync Active"}
                 </div>
               </div>
               
               <MoreVertical size={18} className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {tasks.length === 0 && !isSyncing ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <CheckCircle2 size={48} className="mb-4 opacity-20" />
                 <p className="text-sm">No tasks in this list</p>
               </div>
            ) : (
              <div className="p-4 space-y-1">
                {tasks.filter(t => t.status !== 'completed').map(task => (
                  <DesktopTaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
                ))}
                
                {tasks.some(t => t.status === 'completed') && (
                  <>
                    <div className="px-2 py-4">
                      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
                    </div>
                    <div className="px-3 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Completed</div>
                    {tasks.filter(t => t.status === 'completed').map(task => (
                      <DesktopTaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
            <form onSubmit={handleAddTask} className="relative group">
              <input 
                type="text" 
                placeholder="Add a task" 
                disabled={!currentListId}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white disabled:opacity-50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="absolute left-3 top-3 text-blue-600 dark:text-blue-400">
                <Plus size={20} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
