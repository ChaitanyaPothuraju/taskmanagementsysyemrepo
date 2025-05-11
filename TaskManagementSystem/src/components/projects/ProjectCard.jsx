import { useNavigate } from 'react-router-dom';
import { CalendarDays, MoreVertical, Users } from 'lucide-react';
import { Project } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { formatDate } from '../../lib/utils';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  
  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.completed).length;
  const progress = projectTasks.length > 0 
    ? Math.round((completedTasks / projectTasks.length) * 100) 
    : 0;
  
  return (
    <div 
      className="card overflow-hidden cursor-pointer transition-all hover:translate-y-[-2px]"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Project header with color */}
      <div 
        className="h-2"
        style={{ backgroundColor: project.color }}
      />
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h3>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // This would open a project menu in a complete app
              alert('Project menu would appear in a complete app');
            }}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              Progress
            </span>
            <span className="text-xs font-medium text-gray-700">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${progress}%`,
                backgroundColor: project.color 
              }}
            />
          </div>
        </div>
        
        {/* Project metadata */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{project.members.length} members</span>
          </div>
          
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Created {formatDate(project.createdAt, 'MMM d')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}