import { create } from 'zustand';
import { Project } from '../types';
import { generateId } from '../lib/utils';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
}

// Mock data for demonstration
const initialProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Redesign company website with new branding',
    color: '#3B82F6',
    members: ['user-1', 'user-2'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    color: '#8B5CF6',
    members: ['user-1', 'user-2'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: initialProjects,
  isLoading: false,
  error: null,
  
  addProject: (project) => {
    const newProject: Project = {
      id: generateId('project-'),
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  
  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((project) => 
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      ),
    }));
  },
  
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    }));
  },
  
  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id);
  }
}));