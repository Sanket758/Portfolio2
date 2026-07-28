import experienceData from '../experience.json' assert { type: 'json' }
import educationData from '../education.json' assert { type: 'json' }
import skillsData from '../skills.json' assert { type: 'json' }
import blogsData from '../blogs.json' assert { type: 'json' }

export async function getExperience(): Promise<Experience[]> {
  return experienceData as Experience[]
}

export async function getEducation(): Promise<Experience[]> {
  return educationData as Experience[]
}

export async function getSkills(): Promise<Skill[]> {
  return skillsData as Skill[]
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return blogsData as BlogPost[]
}

export interface Skill {
  name: string
  level: number
  description?: string
}

export interface Experience {
  id?: string
  role: string
  company: string
  period: string
  description: string[] | string
  type: 'work' | 'education'
}

export interface BlogPost {
  id?: string
  title: string
  description: string
  blogUrl: string
  thumbnailUrl: string | null
  date: string
  slug?: string
  content?: string
  publishedDate?: string
}
