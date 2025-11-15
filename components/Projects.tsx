
import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import { getCollection } from '../firebase/firestoreService';
import { GitHubIcon, ExternalLinkIcon } from './icons';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
      <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-text-primary">{project.title}</h3>
        <p className="text-text-secondary mb-4 h-32 overflow-hidden">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span key={tech} className="bg-gray-700 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
            <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2">
                <GitHubIcon />
                <span>Source Code</span>
            </a>
            {project.liveDemoUrl && (
                <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2">
                    <ExternalLinkIcon />
                    <span>Live Demo</span>
                </a>
            )}
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getCollection<Project>('projects');
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-12">
        My Projects
      </h2>
      {loading ? (
        <p className="text-center text-text-secondary">Loading projects...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;