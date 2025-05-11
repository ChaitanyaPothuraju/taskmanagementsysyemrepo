import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore } from '../stores/taskStore';
import { useProjectStore } from '../stores/projectStore';
import { useNotificationStore } from '../stores/notificationStore';
import { 
  BarChart, 
  CheckCircle, 
  Clock, 
  ListTodo, 
  Plus, 
  Briefcase 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskItem from '../components/tasks/TaskItem';
import ProjectCard from '../components/projects/ProjectCard';
import TaskForm from '../components/tasks/TaskForm';
import { formatDate, isDueDateNear, isDueDatePast } from '../lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, moveTask, addTask } = useTaskStore();
  const { projects } = useProjectStore();
  const { notifications } = useNotificationStore();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Calculate dashboard statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const upcomingTasks = tasks.filter(task => 
    !task.completed && (isDueDateNear(task.dueDate) || isDueDatePast(task.dueDate))
  ).length;
  
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Get recently updated tasks and projects for quick access
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
    
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'User'}</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <button
          onClick={() => setShowTaskForm(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>
      
      {/* Task Creation Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg">
            <TaskForm 
              onClose={() => setShowTaskForm(false)} 
              onSubmit={addTask}
            />
          </div>
        </div>
      )}
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="rounded-full p-3 bg-primary-100 text-primary-600">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="rounded-full p-3 bg-green-100 text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="rounded-full p-3 bg-blue-100 text-blue-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <p className="text-2xl font-semibold text-gray-900">{inProgressTasks}</p>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4">
          <div className="rounded-full p-3 bg-yellow-100 text-yellow-600">
            <BarChart className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
            <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-gray-500">No tasks yet</p>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              recentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={moveTask}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
              <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentProjects.length === 0 ? (
                <div className="card p-6 text-center">
                  <p className="text-gray-500">No projects yet</p>
                  <Link to="/projects" className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                    Create your first project
                  </Link>
                </div>
              ) : (
                recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </div>
          </div>
          
          {/* Upcoming Deadlines */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            
            {upcomingTasks === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-gray-500">No upcoming deadlines</p>
              </div>
            ) : (
              <div className="card p-4">
                <ul className="divide-y divide-gray-100">
                  {tasks
                    .filter(task => !task.completed && (isDueDateNear(task.dueDate) || isDueDatePast(task.dueDate)))
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 3)
                    .map((task) => (
                      <li key={task.id} className="py-2.5">
                        <div className="flex items-start gap-2">
                          <div className={`flex-shrink-0 w-1 h-full rounded-full ${
                            isDueDatePast(task.dueDate) ? 'bg-red-500' : 'bg-amber-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            <p className={`text-xs ${
                              isDueDatePast(task.dueDate) ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              Due {formatDate(task.dueDate)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}