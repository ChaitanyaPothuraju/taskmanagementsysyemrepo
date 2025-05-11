import { 
  Clock, 
  Flag, 
  MoreVertical, 
  Edit, 
  Trash, 
  CheckCircle2,
  ArrowRightCircle
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Task, Status } from '../../types';
import { formatDate, getPriorityColor, isDueDateNear, isDueDatePast } from '../../lib/utils';
import { useTaskStore } from '../../stores/taskStore';
import { useProjectStore } from '../../stores/projectStore';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Status) => void;
}

export default function TaskItem({ task, onStatusChange }: TaskItemProps) {
  const { toggleTaskCompletion, deleteTask } = useTaskStore();
  const { getProjectById } = useProjectStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const project = task.projectId ? getProjectById(task.projectId) : undefined;
  const isNearDueDate = isDueDateNear(task.dueDate);
  const isPastDueDate = isDueDatePast(task.dueDate);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getNextStatus = (currentStatus: Status): Status => {
    switch (currentStatus) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'review';
      case 'review':
        return 'completed';
      case 'completed':
        return 'todo';
      default:
        return 'todo';
    }
  };
  
  return (
    <div className={`
      card p-3 hover:shadow transition-all 
      ${task.completed ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white animate-scale-in'}
    `}>
      <div className="flex items-start justify-between">
        {/* Task Completion Status */}
        <div className="flex items-center">
          <button
            onClick={() => toggleTaskCompletion(task.id)}
            className={`
              flex-shrink-0 h-5 w-5 rounded-full border 
              ${task.completed 
                ? 'bg-green-100 border-green-500 text-green-500' 
                : 'border-gray-300 hover:border-primary-500'
              }
            `}
          >
            {task.completed && <CheckCircle2 className="h-4 w-4" />}
          </button>
          
          {/* Task Title */}
          <h4 className={`ml-2 text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h4>
        </div>
        
        {/* Task Actions */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onStatusChange(task.id, getNextStatus(task.status));
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <ArrowRightCircle className="h-4 w-4" />
                <span>Move to {getNextStatus(task.status).replace('-', ' ')}</span>
              </button>
              <button
                onClick={() => {
                  toggleTaskCompletion(task.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</span>
              </button>
              <button
                onClick={() => {
                  // This would open a task edit modal in a real app
                  setShowMenu(false);
                  alert('Edit task functionality would open a modal in a complete app');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
                <span>Edit task</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(task.id);
                  }
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash className="h-4 w-4" />
                <span>Delete task</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Task Description (if any) */}
      {task.description && (
        <p className="mt-1 ml-7 text-xs text-gray-600">
          {task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description}
        </p>
      )}
      
      {/* Task Metadata */}
      <div className="mt-2 ml-7 flex flex-wrap items-center gap-2">
        {/* Project Badge (if assigned to a project) */}
        {project && (
          <span 
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ 
              backgroundColor: `${project.color}20`, // Adding transparency
              color: project.color 
            }}
          >
            {project.name}
          </span>
        )}
        
        {/* Priority Badge */}
        <span className={`badge ${getPriorityColor(task.priority)}`}>
          <Flag className="mr-1 h-3 w-3" />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        
        {/* Due Date Badge */}
        <span 
          className={`
            badge flex items-center gap-1
            ${isPastDueDate ? 'bg-red-100 text-red-800' : isNearDueDate ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
          `}
        >
          <Clock className="h-3 w-3" />
          {formatDate(task.dueDate, 'MMM d')}
        </span>
      </div>
    </div>
  );
}