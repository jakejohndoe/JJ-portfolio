export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    imageUrl?: string;
  }
  
  export interface Skill {
    id: number;
    name: string;
    level: number;
    category: string;
  }
  
  export interface Stats {
    visitors: number;
    projectsCompleted: number;
    happyClients: number;
  }
  
  export interface Service {
    id: number;
    title: string;
    description: string;
  }