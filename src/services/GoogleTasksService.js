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

  async insertTask(tasklistId, title, notes = "") {
    return this.fetch(`/lists/${tasklistId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, notes })
    });
  }

  async updateTask(tasklistId, taskId, status) {
    // First get the task to preserve title and other fields
    // We can't just send status because PATCH semantics might vary or we might overwrite title if we don't include it
    // But for Google Tasks PATCH, we can send just the fields to update.
    // HOWEVER, if we want to preserve the [STARRED] tag, we need to know if it's there.
    // Since we don't have the current task state here easily without fetching, 
    // we'll assume the caller might need to handle the title if they want to change it.
    // But for status toggle, we just want to change status.
    // The issue is: if we just send status, does Google keep the title? Yes.
    
    return this.fetch(`/lists/${tasklistId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status === 'completed' ? 'completed' : 'needsAction'
      })
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
}

export default GoogleTasksService;
