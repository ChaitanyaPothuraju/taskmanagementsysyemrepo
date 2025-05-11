import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className={`flex-1 p-4 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}