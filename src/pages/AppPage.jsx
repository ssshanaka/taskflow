import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cloud,
  Layout,
  LogOut,
  Menu,
  Moon,
  MoreVertical,
  Plus,
  RotateCw,
  Star,
  Sun,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DesktopTaskItem from "../components/DesktopTaskItem";
import TaskBoard from "../components/TaskBoard";
import GoogleTasksService from "../services/GoogleTasksService";
import MockTasksService from "../services/MockTasksService";

const AppPage = ({
  isDarkMode,
  toggleDarkMode,
  isStandalone,
  onLogout,
  userProfile,
  authToken,
  isDemoMode,
  sessionExpiry,
}) => {
  const [api, setApi] = useState(null);
  const [taskLists, setTaskLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allTasksByList, setAllTasksByList] = useState({}); // For board view

  const [inputValue, setInputValue] = useState("");
  const [newListValue, setNewListValue] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [error, setError] = useState(null);

  // New UI states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [isListsExpanded, setIsListsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState("board"); // 'list' or 'board' - default to board (All Tasks)
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);

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

        // 1. Try to load from cache first (fast!)
        if (!isDemoMode && service.getCachedTaskLists) {
          const cachedLists = service.getCachedTaskLists();
          if (cachedLists && cachedLists.length > 0) {
            setTaskLists(cachedLists);
            // Don't set a specific list - let it default to board view (All Tasks)
            // Don't turn off loading yet, or maybe we can?
            // Let's keep loading true but show content if we have it?
            // Actually, for "instant" feel, we should probably stop the spinner if we have data.
            setIsLoadingLists(false);
          }
        }

        // 2. Fetch from network (background refresh)
        const data = await service.getTaskLists();
        if (data && data.items) {
          const uniqueItems = Array.from(
            new Map(data.items.map((item) => [item.id, item])).values()
          );
          setTaskLists(uniqueItems);

          // Update cache
          if (!isDemoMode && service.saveTaskListsToCache) {
            service.saveTaskListsToCache(uniqueItems);
          }

          // Don't set a specific list - let it default to board view (All Tasks)
        }
      } catch (e) {
        console.error("Failed to initialize API", e);
        // Only show error if we don't have cached data
        if (taskLists.length === 0) {
          setError(e.message || "Failed to load tasks. Please try again.");
        }
      } finally {
        setIsLoadingLists(false);
      }
    };

    if (authToken || isDemoMode) {
      initializeAPI();
    }
  }, [authToken, isDemoMode]);

  // Fetch tasks when list changes
  useEffect(() => {
    if (!api || !currentListId) return;

    const loadTasks = async () => {
      // 1. Load from cache immediately
      if (!isDemoMode && api.getCachedTasks) {
        const cachedTasks = api.getCachedTasks(currentListId);
        if (cachedTasks) {
          setTasks(cachedTasks);
        }
      }

      setIsSyncing(true);
      try {
        const data = await api.getTasks(currentListId);
        const newTasks = data.items || [];
        setTasks(newTasks);

        // 2. Update cache
        if (!isDemoMode && api.saveTasksToCache) {
          api.saveTasksToCache(currentListId, newTasks);
        }
      } catch (e) {
        console.error("Failed to load tasks", e);
      } finally {
        setIsSyncing(false);
      }
    };

    loadTasks();
  }, [api, currentListId]);

  // Fetch all tasks for board view
  useEffect(() => {
    // Only fetch if we have the API, we are in board view, and we have lists to fetch
    if (!api || viewMode !== "board" || taskLists.length === 0) return;

    const loadAllTasks = async () => {
      // 1. Load from cache
      if (!isDemoMode && api.getCachedTasks) {
        const cachedAllTasks = {};
        let hasCachedData = false;
        taskLists.forEach((list) => {
          const cached = api.getCachedTasks(list.id);
          if (cached) {
            cachedAllTasks[list.id] = cached;
            hasCachedData = true;
          }
        });

        if (hasCachedData) {
          setAllTasksByList((prev) => ({ ...prev, ...cachedAllTasks }));
        }
      }

      setIsSyncing(true);
      try {
        const data = await api.fetchAllTasks(taskLists);
        setAllTasksByList(data);

        // 2. Update cache for each list
        if (!isDemoMode && api.saveTasksToCache) {
          Object.entries(data).forEach(([listId, tasks]) => {
            api.saveTasksToCache(listId, tasks);
          });
        }
      } catch (e) {
        console.error("Failed to load all tasks", e);
      } finally {
        setIsSyncing(false);
      }
    };

    loadAllTasks();
  }, [api, viewMode, taskLists.length]); // Depend on taskLists.length to trigger when lists are loaded

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentListId) return;

    const tempId = `temp_${Date.now()}`;
    const newTask = { id: tempId, title: inputValue, status: "needsAction" };
    setTasks([newTask, ...tasks]);
    setInputValue("");
    setIsSyncing(true);

    try {
      await api.insertTask(currentListId, newTask.title);
      // Reload tasks to get the real ID
      const data = await api.getTasks(currentListId);
      setTasks(data.items || []);
    } catch (e) {
      console.error("Failed to add task", e);
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const newStatus =
      currentStatus === "completed" ? "needsAction" : "completed";
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    setIsSyncing(true);

    try {
      await api.updateTask(currentListId, taskId, newStatus);
    } catch (e) {
      console.error("Update failed", e);
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, status: currentStatus } : t
        )
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const oldTasks = [...tasks];
    setTasks(tasks.filter((t) => t.id !== taskId));
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

  const handleToggleStar = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStarred = !task.starred;
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, starred: newStarred } : t))
    );

    // For demo mode, MockTasksService will handle this automatically with _save()
    // For Google Tasks, we would need API support (not available in standard API)
    if (!isDemoMode && api.updateTaskStarred) {
      setIsSyncing(true);
      try {
        await api.updateTaskStarred(currentListId, taskId, newStarred);
      } catch (e) {
        console.error("Star toggle failed", e);
        setTasks(
          tasks.map((t) =>
            t.id === taskId ? { ...t, starred: !newStarred } : t
          )
        );
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListValue.trim()) return;
    setIsSyncing(true);
    try {
      const newList = await api.insertTaskList(newListValue);
      setTaskLists((prev) => [...prev, newList]);
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
      <div
        className={`flex items-center justify-center h-full bg-white dark:bg-slate-900 ${
          isStandalone ? "h-screen w-screen" : ""
        }`}
      >
        <div className="text-center">
          <RotateCw
            size={48}
            className="text-blue-500 animate-spin mx-auto mb-4"
          />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Loading your tasks...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-white dark:bg-slate-900 p-4 ${
          isStandalone ? "h-screen w-screen" : ""
        }`}
      >
        <div className="text-center max-w-2xl p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Failed to Load Tasks
          </h3>
          <div className="text-left bg-white dark:bg-slate-900 p-4 rounded-lg mb-6 border border-slate-200 dark:border-slate-600">
            <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
              {error}
            </pre>
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
    <div
      className={`flex flex-col h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 ${
        isStandalone ? "h-screen w-screen" : ""
      }`}
    >
      {!isStandalone && (
        <div className="h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 select-none flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            TaskFlow Desktop
          </div>
          <div className="w-16"></div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Google Tasks-style Sidebar */}
        <div
          className={`bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 flex-shrink-0 ${
            isSidebarCollapsed ? "w-0 sm:w-16" : "w-72"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 space-y-4">
            {/* Menu Button & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu
                  size={20}
                  className="text-slate-600 dark:text-slate-400"
                />
              </button>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                      <CheckCircle2 size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                      TaskFlow
                      <span className="text-blue-600 dark:text-blue-400">
                        Desktop
                      </span>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Create Button */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => {
                  setShowStarred(false);
                  setCurrentListId(taskLists[0]?.id || null);
                  // Focus on input after a short delay
                  setTimeout(() => {
                    const input = document.querySelector(
                      'input[placeholder="Add a task"]'
                    );
                    if (input) input.focus();
                  }, 100);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full text-slate-700 dark:text-slate-200 font-medium transition-colors shadow-sm"
              >
                <Plus size={20} />
                <span>Create</span>
              </button>
            )}
          </div>

          {/* Navigation */}
          {!isSidebarCollapsed && (
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
              {/* All Tasks (Board View) */}
              <button
                onClick={() => {
                  setShowStarred(false);
                  setViewMode("board");
                  setCurrentListId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors mb-1 ${
                  viewMode === "board"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Layout size={20} />
                <span>All tasks</span>
              </button>

              {/* Starred */}
              <button
                onClick={() => {
                  setShowStarred(true);
                  setViewMode("list");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors mb-4 ${
                  showStarred
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300  hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Star size={20} className={showStarred ? "fill-current" : ""} />
                <span>Starred</span>
              </button>

              {/* Lists Section */}
              <div className="mb-2">
                <button
                  onClick={() => setIsListsExpanded(!isListsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors uppercase tracking-wider"
                >
                  <span>Lists</span>
                  {isListsExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isListsExpanded && (
                  <div className="mt-1 space-y-0.5">
                    {taskLists.map((list) => {
                      const listTaskCount = tasks.filter(
                        (t) => !showStarred
                      ).length;
                      return (
                        <button
                          key={list.id}
                          onClick={() => {
                            setShowStarred(false);
                            setViewMode("list");
                            setCurrentListId(list.id);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                            currentListId === list.id &&
                            !showStarred &&
                            viewMode === "list"
                              ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <CheckCircle2 size={18} className="flex-shrink-0" />
                            <span className="truncate">{list.title}</span>
                          </div>
                          {listTaskCount > 0 && (
                            <span className="text-xs text-slate-500 dark:text-slate-500 ml-2">
                              {listTaskCount}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Create New List */}
                    {isAddingList ? (
                      <form onSubmit={handleCreateList} className="px-4 py-2">
                        <input
                          autoFocus
                          type="text"
                          value={newListValue}
                          onChange={(e) => setNewListValue(e.target.value)}
                          onBlur={() => !newListValue && setIsAddingList(false)}
                          placeholder="List name..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </form>
                    ) : (
                      <button
                        onClick={() => setIsAddingList(true)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                      >
                        <Plus size={18} />
                        <span>Create new list</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Profile at Bottom */}
          {!isSidebarCollapsed && (
            <div className="mt-auto border-t border-slate-200 dark:border-slate-700 p-3">
              <div className="flex items-center gap-3 px-2 mb-2">
                {userProfile?.picture && (
                  <img
                    src={userProfile.picture}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-200 truncate">
                    {userProfile?.name}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate">
                    {userProfile?.email}
                  </div>
                  {sessionExpiry && !isDemoMode && (
                    <div className="text-green-600 dark:text-green-400 text-[9px] mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      {sessionExpiry} {sessionExpiry === 1 ? "day" : "days"}{" "}
                      left
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full px-2 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-2 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
          <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-3">
              {viewMode === "board"
                ? "All Tasks"
                : showStarred
                ? "Starred"
                : taskLists.find((l) => l.id === currentListId)?.title ||
                  "Select a list"}
              {isSyncing && (
                <RotateCw size={14} className="text-blue-500 animate-spin" />
              )}
            </h2>
            <div className="flex items-center gap-3 text-slate-400">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                aria-label="Toggle dark mode"
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun
                    size={18}
                    className="text-slate-400 group-hover:text-yellow-500 transition-colors"
                  />
                ) : (
                  <Moon
                    size={18}
                    className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                  />
                )}
              </button>

              {/* Sync Indicator */}
              <div className="relative group">
                <span
                  className={`absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 ${
                    isSyncing ? "animate-pulse" : ""
                  }`}
                ></span>
                <Cloud size={18} />
                <div className="absolute right-0 top-6 w-32 bg-black text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-center z-50">
                  {isDemoMode ? "Demo Mode (Local)" : "Google Sync Active"}
                </div>
              </div>

              <MoreVertical
                size={18}
                className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {viewMode === "board" ? (
            <TaskBoard
              lists={taskLists}
              tasksByList={allTasksByList}
              onAddTask={(listId) => {
                setCurrentListId(listId);
                setViewMode("list");
                // Focus logic would go here
              }}
              onToggleTask={async (taskId, currentStatus) => {
                // Find which list this task belongs to
                let listId = null;
                let task = null;
                for (const [lid, tasks] of Object.entries(allTasksByList)) {
                  task = tasks.find((t) => t.id === taskId);
                  if (task) {
                    listId = lid;
                    break;
                  }
                }

                if (listId && task) {
                  // Optimistic update
                  const newStatus =
                    currentStatus === "completed" ? "needsAction" : "completed";
                  setAllTasksByList((prev) => ({
                    ...prev,
                    [listId]: prev[listId].map((t) =>
                      t.id === taskId ? { ...t, status: newStatus } : t
                    ),
                  }));

                  setIsSyncing(true);
                  try {
                    await api.updateTask(listId, taskId, newStatus);
                  } catch (e) {
                    console.error("Toggle failed", e);
                    // Revert
                    setAllTasksByList((prev) => ({
                      ...prev,
                      [listId]: prev[listId].map((t) =>
                        t.id === taskId ? { ...t, status: currentStatus } : t
                      ),
                    }));
                  } finally {
                    setIsSyncing(false);
                  }
                }
              }}
              onDeleteTask={async (taskId) => {
                // Find list ID
                let listId = null;
                for (const [lid, tasks] of Object.entries(allTasksByList)) {
                  if (tasks.find((t) => t.id === taskId)) {
                    listId = lid;
                    break;
                  }
                }

                if (listId) {
                  const oldTasks = allTasksByList[listId];
                  setAllTasksByList((prev) => ({
                    ...prev,
                    [listId]: prev[listId].filter((t) => t.id !== taskId),
                  }));

                  setIsSyncing(true);
                  try {
                    await api.deleteTask(listId, taskId);
                  } catch (e) {
                    console.error("Delete failed", e);
                    setAllTasksByList((prev) => ({
                      ...prev,
                      [listId]: oldTasks,
                    }));
                  } finally {
                    setIsSyncing(false);
                  }
                }
              }}
              onToggleStar={async (taskId) => {
                // Find list ID and task
                let listId = null;
                let task = null;
                for (const [lid, tasks] of Object.entries(allTasksByList)) {
                  task = tasks.find((t) => t.id === taskId);
                  if (task) {
                    listId = lid;
                    break;
                  }
                }

                if (listId && task) {
                  const newStarred = !task.starred;
                  setAllTasksByList((prev) => ({
                    ...prev,
                    [listId]: prev[listId].map((t) =>
                      t.id === taskId ? { ...t, starred: newStarred } : t
                    ),
                  }));

                  if (!isDemoMode && api.updateTaskStarred) {
                    setIsSyncing(true);
                    try {
                      await api.updateTaskStarred(listId, taskId, newStarred);
                    } catch (e) {
                      console.error("Star toggle failed", e);
                      // Revert
                      setAllTasksByList((prev) => ({
                        ...prev,
                        [listId]: prev[listId].map((t) =>
                          t.id === taskId ? { ...t, starred: !newStarred } : t
                        ),
                      }));
                    } finally {
                      setIsSyncing(false);
                    }
                  }
                }
              }}
              isDarkMode={isDarkMode}
            />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {tasks.length === 0 && !isSyncing ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <CheckCircle2 size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">
                      {showStarred
                        ? "No starred tasks"
                        : "No tasks in this list"}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-1">
                    {/* Filter tasks based on starred view */}
                    {(showStarred
                      ? tasks.filter(
                          (t) => t.starred && t.status !== "completed"
                        )
                      : tasks.filter((t) => t.status !== "completed")
                    ).map((task) => (
                      <DesktopTaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onToggleStar={handleToggleStar}
                      />
                    ))}

                    {tasks.some(
                      (t) =>
                        t.status === "completed" && (!showStarred || t.starred)
                    ) && (
                      <>
                        <div className="px-2 py-4">
                          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
                        </div>

                        <button
                          onClick={() =>
                            setIsCompletedExpanded(!isCompletedExpanded)
                          }
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors w-full text-left"
                        >
                          {isCompletedExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <span>
                            Completed (
                            {
                              tasks.filter(
                                (t) =>
                                  t.status === "completed" &&
                                  (!showStarred || t.starred)
                              ).length
                            }
                            )
                          </span>
                        </button>

                        {isCompletedExpanded && (
                          <div className="space-y-1 opacity-75">
                            {(showStarred
                              ? tasks.filter(
                                  (t) => t.starred && t.status === "completed"
                                )
                              : tasks.filter((t) => t.status === "completed")
                            ).map((task) => (
                              <DesktopTaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                                onToggleStar={handleToggleStar}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Add Task Input (Only in List View) */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                <form onSubmit={handleAddTask} className="relative group">
                  <input
                    type="text"
                    placeholder="Add a task"
                    disabled={!currentListId && !showStarred}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white disabled:opacity-50"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="absolute left-3 top-3 text-blue-600 dark:text-blue-400">
                    <Plus size={20} />
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppPage;
