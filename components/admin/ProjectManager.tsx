
import React, { useState, useEffect } from 'react';
import type { Project } from '../../types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '../../firebase/firestoreService';
import Modal from './Modal';
import { PlusIcon, TrashIcon, PencilIcon } from '../icons';

// FIX: Define a specific type for the form state to avoid type conflicts.
// 'techStack' in the form is a comma-separated string, but in the Project type it's string[].
type ProjectFormState = Omit<Partial<Project>, 'techStack'> & { techStack: string };

const EMPTY_PROJECT_STATE: ProjectFormState = {
  title: '',
  description: '',
  imageUrl: '',
  techStack: '',
  githubRepoUrl: '',
  liveDemoUrl: '',
};

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // FIX: Use the specific ProjectFormState type for the component state. This resolves all related type errors.
  const [currentProject, setCurrentProject] = useState<ProjectFormState>(EMPTY_PROJECT_STATE);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getCollection<Project>('projects');
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setIsEditing(true);
      // Safely join techStack, even if it's missing or not an array
      const techStackString = Array.isArray(project.techStack) ? project.techStack.join(', ') : '';
      setCurrentProject({ ...project, techStack: techStackString });
    } else {
      setIsEditing(false);
      setCurrentProject(EMPTY_PROJECT_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProject(EMPTY_PROJECT_STATE);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: currentProject.techStack is now correctly inferred as a string.
    const techArray = currentProject.techStack.split(',').map(tech => tech.trim()).filter(Boolean); // Also filter out empty strings
    const projectData = {
        ...currentProject,
        techStack: techArray,
    };

    if (isEditing && currentProject.id) {
        await updateDocument('projects', currentProject.id, projectData);
    } else {
        await addDocument('projects', projectData);
    }
    
    handleCloseModal();
    await fetchProjects();
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
        await deleteDocument('projects', id);
        await fetchProjects();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Projects</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2"
        >
          <PlusIcon /> Add Project
        </button>
      </div>

      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Tech Stack</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id} className="border-b border-gray-800 hover:bg-primary">
                    <td className="p-4 font-medium">{project.title}</td>
                    <td className="p-4 text-sm text-text-secondary">
                      {/* FIX: Check if techStack is an array before joining to prevent crash */}
                      {Array.isArray(project.techStack) ? project.techStack.join(', ') : 'N/A'}
                    </td>
                    <td className="p-4 flex gap-4">
                      <button onClick={() => handleOpenModal(project)} className="text-blue-400 hover:text-blue-300"><PencilIcon /></button>
                      <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal title={isEditing ? 'Edit Project' : 'Add New Project'} isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={currentProject.title} onChange={handleInputChange} placeholder="Project Title" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <textarea name="description" value={currentProject.description} onChange={handleInputChange} placeholder="Description" className="w-full bg-primary p-2 rounded border border-gray-600" rows={4} required></textarea>
            <input name="imageUrl" value={currentProject.imageUrl} onChange={handleInputChange} placeholder="Image URL" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input name="techStack" value={currentProject.techStack} onChange={handleInputChange} placeholder="Tech Stack (comma-separated)" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input name="githubRepoUrl" value={currentProject.githubRepoUrl} onChange={handleInputChange} placeholder="GitHub Repo URL" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input name="liveDemoUrl" value={currentProject.liveDemoUrl} onChange={handleInputChange} placeholder="Live Demo URL (optional)" className="w-full bg-primary p-2 rounded border border-gray-600" />
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleCloseModal} className="bg-gray-600 py-2 px-4 rounded-lg hover:bg-gray-500">Cancel</button>
              <button type="submit" className="bg-accent py-2 px-4 rounded-lg hover:bg-blue-500">{isEditing ? 'Save Changes' : 'Add Project'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectManager;
