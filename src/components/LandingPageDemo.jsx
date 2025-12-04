import {
  CheckCircle2,
  Layout,
  Menu,
  Plus,
  Star,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import DesktopTaskItem from "./DesktopTaskItem";
import MockTasksService from "../services/MockTasksService";

const LandingPageDemo = ({ isDarkMode }) => {
  const [api, setApi] = useState(null);
  const [taskLists, setTaskLists] = useState([]);
  const [allTasksByList, setAllTasksByList] = useState({});
  const [viewMode, setViewMode] = useState("board"); // 'board' or 'starred'
  const [addingTaskToList, setAddingTaskToList] = useState(null); // Track which list is adding a task
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Initialize API Service and load lists
  useEffect(() => {
    const initializeAPI = async () => {
      const service = new MockTasksService();
      setApi(service);

      // Load task lists
      const data = await service.getTaskLists();
      if (data && data.items) {
        setTaskLists(data.items);
      }
    };

    initializeAPI();
  }, []);

  // Fetch all tasks for board view
  useEffect(() => {
    if (!api || taskLists.length === 0) return;

    const loadAllTasks = async () => {
      const data = await api.fetchAllTasks(taskLists);
      setAllTasksByList(data);
    };

    loadAllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, taskLists.length]);

  const handleStartAddTask = (listId) => {
    setAddingTaskToList(listId);
    setNewTaskTitle("");
  };

  const handleAddTask = async (listId, e) => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await api.insertTask(listId, newTaskTitle.trim());
      // Reload tasks
      const data = await api.fetchAllTasks(taskLists);
      setAllTasksByList(data);
      setNewTaskTitle("");
      setAddingTaskToList(null);
    } catch (e) {
      console.error("Failed to add task", e);
    }
  };

  const handleCancelAddTask = () => {
    setAddingTaskToList(null);
    setNewTaskTitle("");
  };

  const handleToggleTask = async (taskId, currentStatus) => {
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
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
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

      try {
        await api.deleteTask(listId, taskId);
      } catch (e) {
        console.error("Delete failed", e);
        setAllTasksByList((prev) => ({
          ...prev,
          [listId]: oldTasks,
        }));
      }
    }
  };

  const handleToggleStar = async (taskId) => {
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
      }
    }
  };

  // Get all starred tasks
  const getStarredTasks = () => {
    const starred = [];
    Object.entries(allTasksByList).forEach(([listId, tasks]) => {
      tasks.forEach((task) => {
        if (task.starred && task.status !== "completed") {
          starred.push({ ...task, listId });
        }
      });
    });
    return starred;
  };

  const starredTasks = getStarredTasks();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden">
        {/* Simplified Sidebar */}
        <div className="w-56 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col flex-shrink-0">
          {/* Sidebar Header */}
          <div className="p-3 space-y-3">
            {/* Menu Button & Logo */}
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Menu size={18} className="text-slate-600 dark:text-slate-400" />
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                  TaskFlow
                </span>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={() => {
                if (taskLists.length > 0) {
                  setViewMode("board");
                  handleStartAddTask(taskLists[0].id);
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full text-slate-700 dark:text-slate-200 font-medium transition-colors shadow-sm text-sm"
            >
              <Plus size={16} />
              <span>Create</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
            {/* All Tasks (Board View) */}
            <button
              onClick={() => setViewMode("board")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors mb-1 ${
                viewMode === "board"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Layout size={16} />
              <span>All tasks</span>
            </button>

            {/* Starred */}
            <button
              onClick={() => setViewMode("starred")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors mb-3 ${
                viewMode === "starred"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Star size={16} className={viewMode === "starred" ? "fill-current" : ""} />
              <span>Starred</span>
            </button>

            {/* Lists Section */}
            <div className="mb-2">
              <div className="w-full px-3 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Lists
              </div>

              <div className="mt-1 space-y-0.5">
                {taskLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setViewMode("board")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <CheckCircle2 size={14} className="flex-shrink-0" />
                      <span className="truncate">{list.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Badge */}
          <div className="mt-auto border-t border-slate-200 dark:border-slate-700 p-2">
            <div className="text-center text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 rounded py-1 px-2">
              🎮 Demo Mode
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
          <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
            <h2 className="text-base font-bold flex items-center gap-2">
              {viewMode === "starred" ? "Starred" : "All Tasks"}
            </h2>
          </div>

          {viewMode === "starred" ? (
            // Starred View
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              {starredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Star size={40} className="mb-3 opacity-20" />
                  <p className="text-sm">No starred tasks</p>
                </div>
              ) : (
                <div className="max-w-2xl space-y-2">
                  {starredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden"
                    >
                      <DesktopTaskItem
                        task={task}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onToggleStar={handleToggleStar}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Board View
            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-white dark:bg-slate-900 p-4">
              <div className="flex h-full gap-4">
                {taskLists.map((list) => {
                  const listTasks = allTasksByList[list.id] || [];
                  const activeTasks = listTasks.filter((t) => t.status !== "completed");

                  return (
                    <div
                      key={list.id}
                      className="w-64 flex-shrink-0 flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 max-h-full"
                    >
                      {/* Column Header */}
                      <div className="p-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate pr-2">
                          {list.title}
                        </div>
                      </div>

                      {/* Tasks Container */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {/* Add Task Input or Button */}
                        {addingTaskToList === list.id ? (
                          <form
                            onSubmit={(e) => handleAddTask(list.id, e)}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-blue-500 p-2"
                          >
                            <input
                              autoFocus
                              type="text"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              placeholder="Task title..."
                              className="w-full px-2 py-1 text-sm outline-none bg-transparent text-slate-900 dark:text-white mb-2"
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelAddTask}
                                className="px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => handleStartAddTask(list.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                          >
                            <Plus size={16} />
                            <span>Add a task</span>
                          </button>
                        )}

                        {/* Active Tasks */}
                        <div className="space-y-1">
                          {activeTasks.map((task) => (
                            <div
                              key={task.id}
                              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden"
                            >
                              <DesktopTaskItem
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                                onToggleStar={handleToggleStar}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPageDemo;
