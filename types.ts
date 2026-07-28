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
  description?: string; // e.g., "Used for building REST APIs in Project X"
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  type: 'work' | 'education';
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  blogUrl: string;
  thumbnailUrl: string | null;
  date: string; // e.g., "March 06, 2025"
  slug?: string; 
  content?: string; 
  publishedDate?: string;
}

export interface Section {
  id: string;
  title: string;
  componentId: string; // e.g., 'Hero', 'About', 'Projects'
  isVisible: boolean;
  order: number;
}
