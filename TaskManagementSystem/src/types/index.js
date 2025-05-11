export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'in-progress' | 'review' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  projectId?: string;
  assignedTo?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
};