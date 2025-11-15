
import React, { useState, useEffect } from 'react';
import type { Experience } from '../../types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '../../firebase/firestoreService';
import Modal from './Modal';
import { PlusIcon, TrashIcon, PencilIcon } from '../icons';

// FIX: Define a specific type for the form state to avoid type conflicts.
// 'description' in the form is a newline-separated string, but in the Experience type it's string[].
type ExperienceFormState = Omit<Partial<Experience>, 'description'> & { description: string };

const EMPTY_EXPERIENCE_STATE: ExperienceFormState = {
  role: '',
  company: '',
  period: '',
  description: '',
  type: 'work' as 'work' | 'education',
};

const ExperienceManager: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // FIX: Use the specific ExperienceFormState type for the component state. This resolves all related type errors.
  const [currentExperience, setCurrentExperience] = useState<ExperienceFormState>(EMPTY_EXPERIENCE_STATE);
  const [isEditing, setIsEditing] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    const data = await getCollection<Experience>('experiences');
    data.sort((a, b) => (a.period > b.period ? -1 : 1));
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setIsEditing(true);
      setCurrentExperience({ ...exp, description: exp.description.join('\n') });
    } else {
      setIsEditing(false);
      setCurrentExperience(EMPTY_EXPERIENCE_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentExperience(EMPTY_EXPERIENCE_STATE);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: currentExperience.description is now correctly inferred as a string.
    const descArray = currentExperience.description.split('\n').map(line => line.trim());
    const experienceData = {
      ...currentExperience,
      description: descArray,
    };

    if (isEditing && currentExperience.id) {
        await updateDocument('experiences', currentExperience.id, experienceData);
    } else {
        await addDocument('experiences', experienceData);
    }
    
    handleCloseModal();
    await fetchExperiences();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
        await deleteDocument('experiences', id);
        await fetchExperiences();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Experiences</h2>
        <button onClick={() => handleOpenModal()} className="bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2">
          <PlusIcon /> Add Experience
        </button>
      </div>

      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        {loading ? (
            <p>Loading experiences...</p>
        ) : (
            <table className="w-full text-left">
            <thead className="border-b border-gray-700">
                <tr>
                <th className="p-4">Role</th>
                <th className="p-4">Company / Institution</th>
                <th className="p-4">Type</th>
                <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {experiences.map((exp) => (
                <tr key={exp.id} className="border-b border-gray-800 hover:bg-primary">
                    <td className="p-4 font-medium">{exp.role}</td>
                    <td className="p-4 text-text-secondary">{exp.company}</td>
                    <td className="p-4">
                    <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${exp.type === 'work' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                        {exp.type}
                    </span>
                    </td>
                    <td className="p-4 flex gap-4">
                    <button onClick={() => handleOpenModal(exp)} className="text-blue-400 hover:text-blue-300"><PencilIcon /></button>
                    <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>

      <Modal title={isEditing ? 'Edit Experience' : 'Add New Experience'} isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="role" value={currentExperience.role} onChange={handleInputChange} placeholder="Role / Degree" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input name="company" value={currentExperience.company} onChange={handleInputChange} placeholder="Company / Institution" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input name="period" value={currentExperience.period} onChange={handleInputChange} placeholder="Period (e.g., Jan 2020 - Present)" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <textarea name="description" value={currentExperience.description} onChange={handleInputChange} placeholder="Description (one point per line)" className="w-full bg-primary p-2 rounded border border-gray-600" rows={4} required></textarea>
            <select name="type" value={currentExperience.type} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-gray-600">
                <option value="work">Work</option>
                <option value="education">Education</option>
            </select>
            <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-600 py-2 px-4 rounded-lg hover:bg-gray-500">Cancel</button>
                <button type="submit" className="bg-accent py-2 px-4 rounded-lg hover:bg-blue-500">{isEditing ? 'Save Changes' : 'Add Experience'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExperienceManager;
