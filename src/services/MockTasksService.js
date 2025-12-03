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
        { id: 't1', title: 'Welcome to TaskFlow', status: 'needsAction' },
        { id: 't2', title: 'Try adding a task', status: 'needsAction' }
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
  
  async insertTask(listId, title, notes = "") {
    const uniqueId = `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask = { id: uniqueId, title, notes, status: 'needsAction' };
    
    if (!this.tasks[listId]) this.tasks[listId] = [];
    this.tasks[listId].unshift(newTask);
    this._save();
    return newTask;
  }
  
  async updateTask(listId, taskId, status) {
    const list = this.tasks[listId] || [];
    const task = list.find(t => t.id === taskId);
    if (task) task.status = status;
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
}

export default MockTasksService;
