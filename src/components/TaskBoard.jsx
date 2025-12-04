import { ChevronDown, ChevronRight, MoreVertical, Plus } from "lucide-react";
import React, { useState } from "react";
import DesktopTaskItem from "./DesktopTaskItem";

const TaskBoard = ({
  lists,
  tasksByList,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onToggleStar,
  onOpenDetails,
  isDarkMode,
}) => {
  const [expandedLists, setExpandedLists] = useState({});

  const toggleListExpanded = (listId) => {
    setExpandedLists((prev) => ({
      ...prev,
      [listId]: !prev[listId],
    }));
  };

  // Helper to build task tree
  const buildTaskTree = (tasks) => {
    const taskMap = {};
    const roots = [];

    // 1. Create map
    tasks.forEach((task) => {
      taskMap[task.id] = { ...task, children: [] };
    });

    // 2. Build tree
    tasks.forEach((task) => {
      if (task.parent && taskMap[task.parent]) {
        taskMap[task.parent].children.push(taskMap[task.id]);
      } else {
        roots.push(taskMap[task.id]);
      }
    });

    // 3. Sort by position
    const sortTasks = (nodes) => {
      nodes.sort((a, b) => {
        if (a.position && b.position) {
          return a.position.localeCompare(b.position);
        }
        return 0;
      });
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortTasks(node.children);
        }
      });
    };

    sortTasks(roots);
    return roots;
  };

  // Recursive task renderer
  const renderTaskTree = (taskNode, level = 0) => {
    const childElements = taskNode.children?.map((child) =>
      renderTaskTree(child, level + 1)
    );

    return (
      <div
        key={taskNode.id}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden mb-1"
      >
        <DesktopTaskItem
          task={taskNode}
          level={level}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          onToggleStar={onToggleStar}
          onOpenDetails={onOpenDetails}
          onAddSubtask={() => {}} // Board view doesn't support adding subtasks inline
        >
          {childElements}
        </DesktopTaskItem>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-200 dark:bg-slate-900 p-6">
      <div className="flex h-full gap-6">
        {lists.map((list) => {
          const listTasks = tasksByList[list.id] || [];
          const activeTasks = listTasks.filter((t) => t.status !== "completed");
          const completedTasks = listTasks.filter(
            (t) => t.status === "completed"
          );
          const isExpanded = expandedLists[list.id];

          // Build trees
          const activeTree = buildTaskTree(activeTasks);
          const completedTree = buildTaskTree(completedTasks);

          return (
            <div
              key={list.id}
              className="w-80 flex-shrink-0 flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 max-h-full"
            >
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                  {list.title}
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Tasks Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {/* Add Task Button */}
                <button
                  onClick={() => onAddTask(list.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors mb-2"
                >
                  <Plus size={16} />
                  <span>Add a task</span>
                </button>

                {/* Active Tasks - Hierarchical */}
                <div className="space-y-1">
                  {activeTree.map((taskNode) => renderTaskTree(taskNode))}
                </div>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleListExpanded(list.id)}
                      className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                      <span>Completed ({completedTasks.length})</span>
                    </button>

                    {isExpanded && (
                      <div className="space-y-1 opacity-75 mt-1">
                        {completedTree.map((taskNode) =>
                          renderTaskTree(taskNode)
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
