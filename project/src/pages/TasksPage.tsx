import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import {
  CalendarDays,
  Grid,
  LayoutList,
  Plus,
  Search
} from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import { Status } from '../types';

type ViewMode = 'board' | 'list';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:8080/api'; // Replace with your actual backend URL

export default function TasksPage() {
  const { tasks, addTask, moveTask } = useTaskStore();

  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [initialStatus, setInitialStatus] = useState<Status>('todo');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = (status: Status) => {
    setInitialStatus(status);
    setShowTaskForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="bg-gray-100 rounded-md p-1 flex items-center">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md ${
                viewMode === 'board' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              title="Board view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              title="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setInitialStatus('todo');
              setShowTaskForm(true);
            }}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10 w-full max-w-md"
        />
      </div>

      {/* Task Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-13rem)] min-h-[32rem]">
          <TaskList status="todo" onAddTask={handleAddTask} />
          <TaskList status="in-progress" onAddTask={handleAddTask} />
          <TaskList status="review" onAddTask={handleAddTask} />
          <TaskList status="completed" onAddTask={handleAddTask} />
        </div>
      )}

      {/* Task List View */}
      {viewMode === 'list' && (
        <div className="card overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Task</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Due Date</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTasks.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No tasks found</p>
                <button
                  onClick={() => {
                    setInitialStatus('todo');
                    setShowTaskForm(true);
                  }}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  Create a new task
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="hover:bg-gray-50">
                  <TaskItem task={task} onStatusChange={moveTask} />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg">
            <TaskForm
              initialStatus={initialStatus}
              onClose={() => setShowTaskForm(false)}
              onSubmit={addTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}