import { useMemo } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import TaskItem from './TaskItem';
import { PlusCircle } from 'lucide-react';
import { Status } from '../../types';

interface TaskListProps {
  status: Status;
  onAddTask: (status: Status) => void;
}

export default function TaskList({ status, onAddTask }: TaskListProps) {
  const { tasks, moveTask } = useTaskStore();
  
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => task.status === status);
  }, [tasks, status]);
  
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
  
  return (
    <div className="flex flex-col h-full">
      <div className={`px-3 py-2 rounded-t-md ${getStatusColor(status)}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            {getStatusTitle(status)} ({filteredTasks.length})
          </h3>
          <button
            onClick={() => onAddTask(status)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-b-md min-h-[200px]">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center text-sm text-gray-500">
            <p>No tasks yet</p>
            <button
              onClick={() => onAddTask(status)}
              className="mt-2 text-xs text-primary-600 hover:text-primary-700"
            >
              Add a task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onStatusChange={moveTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}