import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Settings,
  Users,
  BarChart,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Reports', path: '/reports', icon: BarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 pt-16 transition-transform duration-300 bg-white border-r border-gray-200',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:invisible md:w-0'
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1 p-2">
          {links.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5',
                    active ? 'text-primary-600' : 'text-gray-500'
                  )}
                />
                <span>{name}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-600" />
                )}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
