
import React, { useState, useEffect } from 'react';
import type { Skill } from '../../types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '../../firebase/firestoreService';
import Modal from './Modal';
import { PlusIcon, TrashIcon, PencilIcon } from '../icons';

const EMPTY_SKILL_STATE = { name: '', level: 50 };

const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>(EMPTY_SKILL_STATE);
  const [isEditing, setIsEditing] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    const data = await getCollection<Skill>('skills');
    data.sort((a, b) => b.level - a.level);
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setIsEditing(true);
      setCurrentSkill(skill);
    } else {
      setIsEditing(false);
      setCurrentSkill(EMPTY_SKILL_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSkill(EMPTY_SKILL_STATE);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => ({ ...prev, [name]: name === 'level' ? parseInt(value) : value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSkill.name) return;

    if (isEditing && currentSkill.id) {
        await updateDocument('skills', currentSkill.id, currentSkill);
    } else {
        await addDocument('skills', currentSkill);
    }
    
    handleCloseModal();
    await fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
        await deleteDocument('skills', id);
        await fetchSkills();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Skills</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2"
        >
          <PlusIcon /> Add Skill
        </button>
      </div>

      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        {loading ? (
            <p>Loading skills...</p>
        ): (
            <table className="w-full text-left">
            <thead className="border-b border-gray-700">
                <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Proficiency Level</th>
                <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-gray-800 hover:bg-primary">
                    <td className="p-4 font-medium">{skill.name}</td>
                    <td className="p-4 flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-accent h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                    <span className="text-sm text-text-secondary ml-4 w-12 text-right">{skill.level}%</span>
                    </td>
                    <td className="p-4 flex gap-4">
                    <button onClick={() => handleOpenModal(skill)} className="text-blue-400 hover:text-blue-300"><PencilIcon /></button>
                    <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>

      <Modal title={isEditing ? 'Edit Skill' : 'Add New Skill'} isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={currentSkill.name || ''} onChange={handleInputChange} placeholder="Skill Name" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Proficiency Level: {currentSkill.level || 50}%</label>
              <input type="range" name="level" min="0" max="100" value={currentSkill.level || 50} onChange={handleInputChange} className="w-full" />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleCloseModal} className="bg-gray-600 py-2 px-4 rounded-lg hover:bg-gray-500">Cancel</button>
              <button type="submit" className="bg-accent py-2 px-4 rounded-lg hover:bg-blue-500">{isEditing ? 'Save Changes' : 'Add Skill'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default SkillsManager;