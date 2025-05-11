import { create } from 'zustand';
import { generateId } from '../lib/utils';

const initialTasks = [
  {
    id: 'task-1',
    title: 'Create project plan',
    description: 'Outline the project objectives, timeline, and deliverables',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    projectId: 'project-1',
    assignedTo: ['user-1'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false
  },
  {
    id: 'task-2',
    title: 'Design user interface',
    description: 'Create wireframes and mockups for the main application screens',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    projectId: 'project-1',
    assignedTo: ['user-1', 'user-2'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false
  }
];

export const useTaskStore = create((set, get) => ({
  tasks: initialTasks,
  isLoading: false,
  error: null,
  
  addTask: (task) => {
    const newTask = {
      id: generateId('task-'),
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) => 
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
  
  moveTask: (taskId, newStatus) => {
    set((state) => ({
      tasks: state.tasks.map((task) => 
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
  
  toggleTaskCompletion: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) => 
        task.id === id
          ? { 
              ...task, 
              completed: !task.completed, 
              status: !task.completed ? 'completed' : 'todo',
              updatedAt: new Date().toISOString() 
            }
          : task
      ),
    }));
  },
  
  getTasksByProject: (projectId) => {
    return get().tasks.filter((task) => task.projectId === projectId);
  },
  
  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },
}));