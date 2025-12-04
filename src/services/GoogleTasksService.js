/**
 * Google Tasks API Service
 * Handles all interactions with the Google Tasks API
 */
class GoogleTasksService {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://tasks.googleapis.com/tasks/v1';
  }

  async fetch(endpoint, options = {}) {
    if (!this.token) throw new Error("Not authenticated");
    
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });
    
    if (res.status === 401) {
      // Token expired or invalid
      window.location.hash = ''; // Clear hash
      throw new Error("Unauthorized - please sign in again");
    }

    if (!res.ok) {
      // Get detailed error message from Google API
      let errorMessage = `API Error: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.error) {
          errorMessage = errorData.error.message || errorData.error;
          
          // Add helpful hints for common errors
          if (res.status === 403) {
            errorMessage += "\n\n💡 To fix this:\n" +
              "1. Go to Google Cloud Console (console.cloud.google.com)\n" +
              "2. Enable the 'Google Tasks API' under APIs & Services > Library\n" +
              "3. Verify your OAuth consent screen is configured\n" +
              "4. Ensure the app has 'https://www.googleapis.com/auth/tasks' scope";
          }
        }
      } catch (e) {
        // If error response isn't JSON, use status text
      }
      
      console.error('Google Tasks API Error:', {
        status: res.status,
        statusText: res.statusText,
        endpoint: endpoint,
        url: `${this.baseUrl}${endpoint}`
      });
      
      throw new Error(errorMessage);
    }
    
    if (res.status === 204) return null;
    return res.json();
  }

  async getTaskLists() {
    return this.fetch('/users/@me/lists');
  }

  async getTasks(tasklistId) {
    let allItems = [];
    let nextPageToken = null;
    
    do {
      const url = `/lists/${tasklistId}/tasks?showCompleted=true&showHidden=true${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const data = await this.fetch(url);
      
      if (data && data.items) {
        allItems = [...allItems, ...data.items];
      }
      
      nextPageToken = data ? data.nextPageToken : null;
    } while (nextPageToken);

    // Process all items
    const processedItems = allItems.map(task => {
      const isStarred = task.title.includes('[STARRED]');
      return {
        ...task,
        title: task.title.replace(' [STARRED]', '').replace('[STARRED]', ''),
        starred: isStarred
      };
    });

    return { items: processedItems };
  }

  async fetchAllTasks(lists) {
    const promises = lists.map(list => 
      this.getTasks(list.id)
        .then(data => ({ listId: list.id, tasks: data.items || [] }))
        .catch(e => {
          console.error(`Failed to fetch tasks for list ${list.id}`, e);
          return { listId: list.id, tasks: [] };
        })
    );
    
    const results = await Promise.all(promises);
    return results.reduce((acc, { listId, tasks }) => {
      acc[listId] = tasks;
      return acc;
    }, {});
  }

  async insertTask(tasklistId, title, notes = "", due = null, parent = null) {
    const body = { title, notes };
    if (due) {
      body.due = due; // ISO 8601 format
    }
    if (parent) {
      body.parent = parent; // Parent task ID for sub-tasks
    }
    return this.fetch(`/lists/${tasklistId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async updateTask(tasklistId, taskId, updates = {}) {
    // Updates can contain: status, notes, due, title
    const body = {};
    
    if (updates.status !== undefined) {
      body.status = updates.status === 'completed' ? 'completed' : 'needsAction';
    }
    if (updates.notes !== undefined) {
      body.notes = updates.notes;
    }
    if (updates.due !== undefined) {
      body.due = updates.due; // null to clear, ISO 8601 to set
    }
    if (updates.title !== undefined) {
      body.title = updates.title;
    }
    
    return this.fetch(`/lists/${tasklistId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }
  
  async updateTaskStarred(tasklistId, taskId, starred) {
    // 1. Fetch the current task to get its full title
    const task = await this.fetch(`/lists/${tasklistId}/tasks/${taskId}`);
    
    // 2. Modify the title to add/remove [STARRED]
    let title = task.title || "";
    const hasTag = title.includes('[STARRED]');
    
    if (starred && !hasTag) {
      title = `${title} [STARRED]`;
    } else if (!starred && hasTag) {
      title = title.replace(' [STARRED]', '').replace('[STARRED]', '');
    }
    
    // 3. Update the task with the new title
    return this.fetch(`/lists/${tasklistId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title })
    });
  }

  async deleteTask(tasklistId, taskId) {
    return this.fetch(`/lists/${tasklistId}/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  async insertTaskList(title) {
    return this.fetch(`/users/@me/lists`, {
      method: 'POST',
      body: JSON.stringify({ title })
    });
  }

  async updateTaskList(tasklistId, title) {
    return this.fetch(`/users/@me/lists/${tasklistId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title })
    });
  }

  async deleteTaskList(tasklistId) {
    return this.fetch(`/users/@me/lists/${tasklistId}`, {
      method: 'DELETE'
    });
  }

  // Caching Helpers
  getCacheKey(key) {
    return `taskflow_cache_${key}`;
  }

  saveToCache(key, data) {
    try {
      const cacheItem = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(this.getCacheKey(key), JSON.stringify(cacheItem));
    } catch (e) {
      console.warn('Failed to save to cache', e);
    }
  }

  loadFromCache(key) {
    try {
      const item = localStorage.getItem(this.getCacheKey(key));
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      // Optional: Check for expiry if needed, for now we just return what we have
      // and let the network refresh it
      return parsed.data;
    } catch (e) {
      console.warn('Failed to load from cache', e);
      return null;
    }
  }

  // Specific Cache Methods
  getCachedTaskLists() {
    return this.loadFromCache('task_lists');
  }

  saveTaskListsToCache(lists) {
    this.saveToCache('task_lists', lists);
  }

  getCachedTasks(listId) {
    return this.loadFromCache(`tasks_${listId}`);
  }

  saveTasksToCache(listId, tasks) {
    this.saveToCache(`tasks_${listId}`, tasks);
  }

  async importTasksFromDemo(demoData) {
    if (!demoData || !demoData.lists) return;

    console.log('Starting migration of demo tasks...', demoData);

    for (const list of demoData.lists) {
      // 1. Create the list in Google Tasks
      try {
        const newList = await this.insertTaskList(list.title);
        const tasks = demoData.tasks[list.id] || [];

        // 2. Create all tasks in this list
        // We reverse the array to maintain order since we insert at top usually, 
        // but API inserts at top by default? Actually API inserts at top.
        // So if we want to preserve order [A, B, C], we should insert C, then B, then A.
        // Demo tasks are stored as [A, B, C] where A is top.
        for (let i = tasks.length - 1; i >= 0; i--) {
          const task = tasks[i];
          try {
            // Insert task
            const createdTask = await this.insertTask(newList.id, task.title, task.notes || "");
            
            // Update status if completed
            if (task.status === 'completed') {
              await this.updateTask(newList.id, createdTask.id, { status: 'completed' });
            }
            
            // Update starred status
            if (task.starred) {
              await this.updateTaskStarred(newList.id, createdTask.id, true);
            }
          } catch (e) {
            console.error(`Failed to migrate task ${task.title}`, e);
          }
        }
      } catch (e) {
        console.error(`Failed to migrate list ${list.title}`, e);
      }
    }
  }
}

export default GoogleTasksService;
