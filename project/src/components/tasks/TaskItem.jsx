import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  MoreVertical, 
  Edit, 
  Trash, 
  CheckCircle2,
  ArrowRightCircle
} from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useProjectStore } from '../../stores/projectStore';
import { formatDate, getPriorityColor, isDueDateNear, isDueDatePast } from '../../lib/utils';
import EditTaskForm from './EditTaskForm';

function TaskItem({ task, onStatusChange }) {
  const { toggleTaskCompletion, deleteTask, updateTask } = useTaskStore();
  const { getProjectById } = useProjectStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const menuRef = useRef(null);
  
  const project = task.projectId ? getProjectById(task.projectId) : undefined;
  const isNearDueDate = isDueDateNear(task.dueDate);
  const isPastDueDate = isDueDatePast(task.dueDate);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getNextStatus = (currentStatus) => {
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
    <>
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
                    setShowEditForm(true);
                    setShowMenu(false);
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
        
        {/* Task Description */}
        {task.description && (
          <p className="mt-1 ml-7 text-xs text-gray-600">
            {task.description.length > 100
              ? `${task.description.substring(0, 100)}...`
              : task.description}
          </p>
        )}
        
        {/* Task Metadata */}
        <div className="mt-2 ml-7 flex flex-wrap items-center gap-2">
          {/* Project Badge */}
          {project && (
            <span 
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: `${project.color}20`,
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
      
      {/* Edit Task Modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg">
            <EditTaskForm
              task={task}
              onClose={() => setShowEditForm(false)}
              onSubmit={updateTask}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TaskItem;