/**
 * Mock Tasks Service
 * Local storage-based service for demo mode
 * Implements the same interface as GoogleTasksService
 */
class MockTasksService {
  constructor() {
    let storedLists = JSON.parse(localStorage.getItem('tf_lists'));
    
    // Deduplicate existing lists in localStorage to prevent key collision errors
    if (storedLists && Array.isArray(storedLists)) {
      const seen = new Set();
      storedLists = storedLists.filter(list => {
        const isDuplicate = seen.has(list.id);
        seen.add(list.id);
        return !isDuplicate;
      });
    }

    this.lists = storedLists || [
      { id: 'list_1', title: 'My Tasks' },
      { id: 'list_2', title: 'Work' }
    ];
    
    this.tasks = JSON.parse(localStorage.getItem('tf_tasks')) || {
      'list_1': [
        { id: 't1', title: 'Welcome to TaskFlow', status: 'needsAction', starred: false },
        { id: 't2', title: 'Try adding a task', status: 'needsAction', starred: false }
      ],
      'list_2': []
    };
  }
  
  _save() {
    localStorage.setItem('tf_lists', JSON.stringify(this.lists));
    localStorage.setItem('tf_tasks', JSON.stringify(this.tasks));
  }
  
  async getTaskLists() {
    return { items: this.lists };
  }
  
  async getTasks(listId) {
    return { items: this.tasks[listId] || [] };
  }

  async fetchAllTasks(lists) {
    const result = {};
    for (const list of lists) {
      result[list.id] = this.tasks[list.id] || [];
    }
    return result;
  }
  
  async insertTask(listId, title, notes = "", due = null, parent = null) {
    const uniqueId = `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask = { id: uniqueId, title, notes, status: 'needsAction', starred: false };
    if (due) {
      newTask.due = due;
    }
    if (parent) {
      newTask.parent = parent;
    }
    
    if (!this.tasks[listId]) this.tasks[listId] = [];
    this.tasks[listId].unshift(newTask);
    this._save();
    return newTask;
  }
  
  async updateTask(listId, taskId, updates = {}) {
    const list = this.tasks[listId] || [];
    const task = list.find(t => t.id === taskId);
    if (task) {
      if (updates.status !== undefined) task.status = updates.status;
      if (updates.notes !== undefined) task.notes = updates.notes;
      if (updates.due !== undefined) task.due = updates.due;
      if (updates.title !== undefined) task.title = updates.title;
      this._save();
    }
    return task;
  }
  
  async updateTaskStarred(listId, taskId, starred) {
    const list = this.tasks[listId] || [];
    const task = list.find(t => t.id === taskId);
    if (task) task.starred = starred;
    this._save();
    return task;
  }
  
  async deleteTask(listId, taskId) {
    if (this.tasks[listId]) {
      this.tasks[listId] = this.tasks[listId].filter(t => t.id !== taskId);
      this._save();
    }
  }
  
  async insertTaskList(title) {
    const uniqueId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newList = { id: uniqueId, title };
    this.lists.push(newList);
    this.tasks[newList.id] = [];
    this._save();
    return newList;
  }

  async updateTaskList(tasklistId, title) {
    const list = this.lists.find(l => l.id === tasklistId);
    if (list) {
      list.title = title;
      this._save();
    }
    return list;
  }

  async deleteTaskList(tasklistId) {
    this.lists = this.lists.filter(l => l.id !== tasklistId);
    delete this.tasks[tasklistId];
    this._save();
  }

  exportAllTasks() {
    return {
      lists: this.lists,
      tasks: this.tasks
    };
  }
}

export default MockTasksService;
