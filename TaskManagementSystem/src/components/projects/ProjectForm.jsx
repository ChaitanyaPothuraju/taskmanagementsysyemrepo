import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { X } from 'lucide-react';

const COLOR_OPTIONS = [
  { value: '#3B82F6', name: 'Blue' },
  { value: '#8B5CF6', name: 'Purple' },
  { value: '#EC4899', name: 'Pink' },
  { value: '#F97316', name: 'Orange' },
  { value: '#10B981', name: 'Green' },
  { value: '#64748B', name: 'Slate' },
];

interface ProjectFormProps {
  onClose: () => void;
  onSubmit: (projectData: any) => void;
}

export default function ProjectForm({ onClose, onSubmit }: ProjectFormProps) {
  const { user } = useAuthStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    const projectData = {
      name,
      description,
      color,
      members: [user?.id || 'user-1'],
      createdBy: user?.id || 'user-1',
    };
    
    onSubmit(projectData);
    onClose();
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="Enter project name"
              required
            />
          </div>
          
          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full min-h-[80px]"
              placeholder="Enter project description"
            />
          </div>
          
          {/* Project Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all
                    ${color === option.value ? 'border-gray-900 scale-110' : 'border-transparent'}
                  `}
                  style={{ backgroundColor: option.value }}
                  onClick={() => setColor(option.value)}
                  title={option.name}
                />
              ))}
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
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}