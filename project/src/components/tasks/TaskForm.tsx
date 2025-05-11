import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useProjectStore } from '../../stores/projectStore';
import { X } from 'lucide-react';
import { Priority, Status } from '../../types';

interface TaskFormProps {
  initialStatus?: Status;
  projectId?: string;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
}

export default function TaskForm({ 
  initialStatus = 'todo',
  projectId,
  onClose, 
  onSubmit 
}: TaskFormProps) {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(initialStatus);
  const [priority, setPriority] = useState<Priority>('medium');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [dueDate, setDueDate] = useState('');
  
  // Set tomorrow as the default due date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDueDate(tomorrow.toISOString().split('T')[0]);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    const taskData = {
      title,
      description,
      status,
      priority,
      projectId: selectedProjectId || undefined,
      dueDate: new Date(dueDate).toISOString(),
      assignedTo: [user?.id || 'user-1'],
      createdBy: user?.id || 'user-1',
      completed: false
    };
    
    onSubmit(taskData);
    onClose();
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full"
              placeholder="Enter task title"
              required
            />
          </div>
          
          {/* Task Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full min-h-[80px]"
              placeholder="Enter task description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="input"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            {/* Project */}
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                id="project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="input"
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}