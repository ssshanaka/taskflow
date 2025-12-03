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
    return this.fetch(`/lists/${tasklistId}/tasks?showCompleted=true&showHidden=true`);
  }

  async insertTask(tasklistId, title, notes = "") {
    return this.fetch(`/lists/${tasklistId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, notes })
    });
  }

  async updateTask(tasklistId, taskId, status) {
    return this.fetch(`/lists/${tasklistId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status === 'completed' ? 'completed' : 'needsAction'
      })
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
