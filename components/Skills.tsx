
import React, { useState, useEffect } from 'react';
import type { Skill } from '../types';
import { getCollection } from '../firebase/firestoreService';

const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-text-primary">{skill.name}</span>
        <span className="text-sm font-medium text-text-primary">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-accent h-2.5 rounded-full" 
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  );
};


const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      const data = await getCollection<Skill>('skills');
      // Sort skills by level, descending
      data.sort((a, b) => b.level - a.level);
      setSkills(data);
      setLoading(false);
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-12">
        Technical Skills
      </h2>
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-text-secondary">Loading skills...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {skills.map((skill) => (
              <SkillBar key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;