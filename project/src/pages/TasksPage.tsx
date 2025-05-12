import { useState, useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import {
  CalendarDays,
  Grid,
  LayoutList,
  Plus,
  Search,
  Pencil,
  Trash2,
} from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import { Status, Task } from '../types';
import { formatDate } from '../lib/utils';

type ViewMode = 'board' | 'list';

const API_BASE_URL = 'http://localhost:8080/api';

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [initialStatus, setInitialStatus] = useState<Status>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`);
        }
        const data: Task[] = await response.json();
        const mappedTasks: Task[] = data.map((serverTask) => ({
          id: serverTask.id.toString(),
          title: serverTask.title,
          description: serverTask.description,
          status: serverTask.status.toLowerCase() as Status,
          priority: 'medium',
          dueDate: serverTask.dueDate ? new Date(serverTask.dueDate).toISOString() : undefined,
          projectId: 'default-project',
          assignedTo: [],
          createdBy: 'user-1',
          createdAt: new Date(serverTask.createdAt).toISOString(),
          updatedAt: new Date(serverTask.updatedAt).toISOString(),
          completed: serverTask.status === 'COMPLETED',
        }));
        useTaskStore.setState({ tasks: mappedTasks });
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
          status: newTask.status.toUpperCase(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const createdTask: Task = await response.json();

      const adaptedTask: Task = {
        id: createdTask.id.toString(),
        title: createdTask.title,
        description: createdTask.description,
        status: createdTask.status.toLowerCase() as Status,
        priority: 'medium',
        dueDate: createdTask.dueDate ? new Date(createdTask.dueDate).toISOString() : undefined,
        projectId: 'default-project',
        assignedTo: [],
        createdBy: 'user-1',
        createdAt: new Date(createdTask.createdAt).toISOString(),
        updatedAt: new Date(createdTask.updatedAt).toISOString(),
        completed: createdTask.status === 'COMPLETED',
      };

      addTask(adaptedTask);
      setShowTaskForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    }
  };

  const handleUpdateTask = async (id: string, updatedTask: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setError(null);
    try {
      const taskId = Number(id);
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
          status: updatedTask.status?.toUpperCase(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTaskFromServer: Task = await response.json();

      const adaptedTask: Task = {
        id: updatedTaskFromServer.id.toString(),
        title: updatedTaskFromServer.title,
        description: updatedTaskFromServer.description,
        status: updatedTaskFromServer.status.toLowerCase() as Status,
        priority: 'medium',
        dueDate: updatedTaskFromServer.dueDate ? new Date(updatedTaskFromServer.dueDate).toISOString() : undefined,
        projectId: 'default-project',
        assignedTo: [],
        createdBy: 'user-1',
        createdAt: new Date(updatedTaskFromServer.createdAt).toISOString(),
        updatedAt: new Date(updatedTaskFromServer.updatedAt).toISOString(),
        completed: updatedTaskFromServer.status === 'COMPLETED',
      };
      updateTask(id, adaptedTask);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    setError(null);
    try {
      const taskId = Number(id);
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      deleteTask(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: Status) => {
    setError(null);
    try {
      const taskToUpdate = tasks.find((t) => t.id === taskId);
      if (!taskToUpdate) {
        console.error('Task to update not found');
        return;
      }
      const updatedTask = { ...taskToUpdate, status: newStatus };
      await handleUpdateTask(taskId, updatedTask);
    } catch (err: any) {
      setError(err.message || 'Failed to move task');
    }
  };

  const getStatusTitle = (status: Status): string => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'In Review';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100';
      case 'in-progress':
        return 'bg-blue-100';
      case 'review':
        return 'bg-purple-100';
      case 'completed':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>

        <div className="flex items-center gap-2">
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

      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-13rem)] min-h-[32rem]">
          <TaskList
            status="todo"
            onAddTask={handleAddTask}
            tasks={tasks.filter((task) => task.status === 'todo')}
            onStatusChange={handleMoveTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
          <TaskList
            status="in-progress"
            onAddTask={handleAddTask}
            tasks={tasks.filter((task) => task.status === 'in-progress')}
            onStatusChange={handleMoveTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
          <TaskList
            status="review"
            onAddTask={handleAddTask}
            tasks={tasks.filter((task) => task.status === 'review')}
            onStatusChange={handleMoveTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
          <TaskList
            status="completed"
            onAddTask={handleAddTask}
            tasks={tasks.filter((task) => task.status === 'completed')}
            onStatusChange={handleMoveTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        </div>
      )}

      {viewMode === 'list' && (
        <div className="card overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Task</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2">Actions</div>
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
                <div key={task.id} className="hover:bg-gray-50 px-4 py-3 grid grid-cols-12 items-center text-sm text-gray-700">
                  <div className="col-span-6 font-medium">{task.title}</div>
                  <div className="col-span-2 capitalize text-center">{task.status.replace('-', ' ')}</div>
                  <div className="col-span-2 capitalize text-center">{task.priority}</div>
                  <div className="col-span-2 text-right">{task.dueDate ? formatDate(task.dueDate, 'MMM d, YYYY') : '-'}</div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        const updatedTaskData = {
                          title: task.title,
                          description: task.description,
                          status: task.status,
                          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                        };
                        handleUpdateTask(task.id, updatedTaskData);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg">
            <TaskForm
              initialStatus={initialStatus}
              onClose={() => setShowTaskForm(false)}
              onSubmit={handleAddTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}