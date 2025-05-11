import { useState } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { Plus, Search } from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';

export default function ProjectsPage() {
  const { projects, addProject } = useProjectStore();
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        
        <button
          onClick={() => setShowProjectForm(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10 w-full max-w-md"
        />
      </div>
      
      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Create your first project to get started'}
          </p>
          <button
            onClick={() => setShowProjectForm(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      
      {/* Add Project Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg">
            <ProjectForm 
              onClose={() => setShowProjectForm(false)} 
              onSubmit={addProject}
            />
          </div>
        </div>
      )}
    </div>
  );
}