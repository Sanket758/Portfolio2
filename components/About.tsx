
import React, { useState, useEffect } from 'react';
import type { Experience } from '../types';
import { getCollection } from '../firebase/firestoreService';
import { BriefcaseIcon, AcademicCapIcon } from './icons';

const TimelineItem: React.FC<{ item: Experience }> = ({ item }) => (
  <li className="mb-10 ml-6">
    <span className="absolute flex items-center justify-center w-8 h-8 bg-secondary rounded-full -left-4 ring-4 ring-primary">
      {item.type === 'education' ? <AcademicCapIcon /> : <BriefcaseIcon />}
    </span>
    <h3 className="flex items-center mb-1 text-xl font-semibold text-text-primary">
      {item.role}
      <span className="text-accent text-sm font-medium ml-2">@ {item.company}</span>
    </h3>
    <time className="block mb-2 text-sm font-normal leading-none text-text-secondary">{item.period}</time>
    <ul className="list-disc list-inside space-y-1 text-text-secondary">
      {/* FIX: Check if description is an array before mapping to prevent crashes */}
      {Array.isArray(item.description) && item.description.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </li>
);

const About: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      const data = await getCollection<Experience>('experiences');
      // A simple sort to keep education and work history in a reasonable order
      data.sort((a, b) => (a.period > b.period ? -1 : 1));
      setExperiences(data);
      setLoading(false);
    };
    fetchExperiences();
  }, []);

  return (
    <section id="about" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-12">
        About Me
      </h2>
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/3">
          <img 
            src="https://picsum.photos/seed/about/600/800"
            alt="Sanket Gadge working"
            className="rounded-lg shadow-2xl object-cover w-full h-full"
          />
        </div>
        <div className="lg:w-2/3">
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            I am an AI & ML Engineer with over 4 years of experience, specializing in designing and deploying computer vision and NLP systems using PyTorch, TensorFlow, and cloud platforms like AWS/GCP. I have a proven record of optimizing real-world AI pipelines for scale, reducing manual effort significantly, and ensuring GDPR-compliant deployments. I am currently expanding my expertise in full-stack MLOps and applied generative AI solutions to build robust, production-ready environments.
          </p>
          <h3 className="text-2xl font-bold mb-6">Experience & Education</h3>
          {loading ? (
            <p className="text-text-secondary">Loading timeline...</p>
          ) : (
            <ol className="relative border-l border-gray-700">
              {experiences.map((exp) => (
                <TimelineItem key={exp.id} item={exp} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;