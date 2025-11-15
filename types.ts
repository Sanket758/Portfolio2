
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveDemoUrl?: string;
  githubRepoUrl: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // Percentage from 0 to 100
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  type: 'work' | 'education';
}