import { create } from 'zustand';
import { Task, Status, Priority } from '../types';
import { generateId } from '../lib/utils';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  toggleTaskCompletion: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: Status) => Task[];
}

// Mock data for demonstration
const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Create project plan',
    description: 'Outline the project objectives, timeline, and deliverables',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
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
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    projectId: 'project-1',
    assignedTo: ['user-1', 'user-2'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false
  },
  {
    id: 'task-3',
    title: 'Implement authentication',
    description: 'Set up user registration and login functionality',
    status: 'review',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    projectId: 'project-2',
    assignedTo: ['user-2'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false
  },
  {
    id: 'task-4',
    title: 'Write documentation',
    description: 'Create comprehensive API documentation',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    projectId: 'project-2',
    assignedTo: ['user-1'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: true
  }
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,
  isLoading: false,
  error: null,
  
  addTask: (task) => {
    const newTask: Task = {
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