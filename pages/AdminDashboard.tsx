
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

// Import Admin Components
import ProjectManager from '../components/admin/ProjectManager';
import SkillsManager from '../components/admin/SkillsManager';
import ExperienceManager from '../components/admin/ExperienceManager';

// Import Icons
import { FolderIcon, SparklesIcon, BriefcaseIcon } from '../components/icons';

type View = 'projects' | 'skills' | 'experiences';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState<View>('projects');
  
  const renderContent = () => {
    switch (activeView) {
      case 'projects':
        return <ProjectManager />;
      case 'skills':
        return <SkillsManager />;
      case 'experiences':
        return <ExperienceManager />;
      default:
        return <p>Select a category to manage.</p>;
    }
  };

  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${
          activeView === view ? 'bg-accent text-white' : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
        }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    </li>
  );

  return (
    <div className="min-h-screen bg-primary flex text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-primary border-r border-gray-800 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Portal</h1>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <NavItem view="projects" label="Projects" icon={<FolderIcon className="w-6 h-6" />} />
            <NavItem view="skills" label="Skills" icon={<SparklesIcon className="w-6 h-6" />} />
            <NavItem view="experiences" label="Experiences" icon={<BriefcaseIcon className="w-6 h-6" />} />
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;