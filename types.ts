
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
  slug: string; // URL-friendly identifier
  imageUrl: string;
  summary: string;
  content: string; // Full content, can be markdown
  publishedDate: string; // e.g., "2024-07-29"
}
