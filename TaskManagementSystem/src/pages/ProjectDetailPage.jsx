import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import { useTaskStore } from '../stores/taskStore';
import { useAuthStore } from '../stores/authStore';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  Plus, 
  Trash, 
  Users 
} from 'lucide-react';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import { formatDate } from '../lib/utils';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, deleteProject } = useProjectStore();
  const { getTasksByProject, tasks, addTask, moveTask } = useTaskStore();
  const { user } = useAuthStore();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  const project = getProjectById(id || '');
  const projectTasks = id ? getTasksByProject(id) : [];
  
  if (!project) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-600 mb-4">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-primary"
        >
          Back to Projects
        </button>
      </div>
    );
  }
  
  const handleDeleteProject = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(project.id);
      navigate('/projects');
    }
  };
  
  // Calculate project statistics
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center gap-2 text-gray-500">
        <button
          onClick={() => navigate('/projects')}
          className="p-1 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span>Back to Projects</span>
      </div>
      
      <div 
        className="card p-6 border-t-4"
        style={{ borderTopColor: project.color }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{project.members.length} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created on {formatDate(project.createdAt, 'PPP')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Last updated {formatDate(project.updatedAt, 'PPP')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                // This would open a project edit modal in a complete app
                alert('Project edit functionality would appear here in a complete app');
              }}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDeleteProject}
              className="btn btn-danger inline-flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Project Progress */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Total Tasks</p>
            <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Completion Rate</p>
            <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Progress</h3>
            <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all"
              style={{ 
                width: `${completionRate}%`,
                backgroundColor: project.color 
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Project Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
        
        {projectTasks.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-gray-500 mb-4">No tasks in this project yet</p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Task</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projectTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={moveTask}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Add Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg">
            <TaskForm 
              projectId={project.id}
              onClose={() => setShowTaskForm(false)} 
              onSubmit={addTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}