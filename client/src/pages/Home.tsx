import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { portfolioService } from "@/services/apiService";
import { useState, useEffect } from "react";

// API interfaces
interface ApiSkill {
  id: number;
  name: string;
  level: number;
  category: string;
}

interface ApiService {
  id: number;
  title: string;
  description: string;
}

interface ApiProject {
  id?: number;
  title: string;
  description: string;
  technologies?: string[];
  tech?: string[];
  imageUrl?: string;
  link?: string;
}

interface ApiStats {
  visitors: number;
  projectsCompleted: number;
  happyClients: number;
}

// Component interfaces
interface ComponentSkill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon: string;
}

interface ComponentService {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Technology {
  name: string;
}

interface ComponentProject {
  id?: number;
  title: string;
  description: string;
  technologies: Technology[];
  image: string;
  link?: string;
}

// Fallback data - complete set of skills to display
const fallbackSkills: ComponentSkill[] = [
  { id: 1, name: 'React', level: 90, category: 'Frontend', icon: 'icon-react' },
  { id: 2, name: 'TypeScript', level: 85, category: 'Language', icon: 'icon-typescript' },
  { id: 3, name: 'JavaScript', level: 88, category: 'Language', icon: 'icon-javascript' },
  { id: 4, name: 'MongoDB', level: 80, category: 'Database', icon: 'icon-mongodb' },
  { id: 5, name: 'Tailwind CSS', level: 85, category: 'Frontend', icon: 'icon-tailwind-css' },
  { id: 6, name: 'HTML5', level: 90, category: 'Frontend', icon: 'icon-html5' },
  { id: 7, name: 'CSS3', level: 90, category: 'Frontend', icon: 'icon-css3' },
  { id: 8, name: 'Git', level: 85, category: 'Tool', icon: 'icon-git' },
  { id: 9, name: 'GitHub', level: 85, category: 'Platform', icon: 'icon-github' },
  { id: 10, name: 'Node.js', level: 80, category: 'Backend', icon: 'icon-nodejs' }
];

const fallbackServices: ComponentService[] = [
  { id: 1, title: 'Web Development', description: 'Building modern web applications', icon: 'icon-web' },
  { id: 2, title: 'API Development', description: 'Creating robust backend services', icon: 'icon-api' }
];

// Updated fallback projects to include the ones from your server data
const fallbackProjects: ComponentProject[] = [
  { 
    id: 1, 
    title: 'StretchSmart', 
    description: 'A smart stretching app that targets body parts using AI.', 
    technologies: [
      { name: 'React' }, 
      { name: 'Three.js' }, 
      { name: 'MongoDB' }
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1170&q=80',
    link: 'https://hellojakejohn.com/stretchsmart'
  },
  { 
    id: 2, 
    title: 'VibeCheck', 
    description: 'A mood-based to-do list that adapts to your emotional state.', 
    technologies: [
      { name: 'React' }, 
      { name: 'Express' }, 
      { name: 'Weather API' }
    ],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1170&q=80',
    link: 'https://hellojakejohn.com/vibecheck'
  },
  { 
    id: 3, 
    title: 'Portfolio Website', 
    description: 'A modern portfolio built with React, TypeScript, and Tailwind CSS.', 
    technologies: [
      { name: 'React' }, 
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' }
    ],
    image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=1170&q=80',
    link: 'https://hellojakejohn.com'
  }
];

const Home = () => {
  // Create state variables to safely store processed data
  const [processedSkills, setProcessedSkills] = useState<ComponentSkill[]>(fallbackSkills);
  const [processedServices, setProcessedServices] = useState<ComponentService[]>(fallbackServices);
  const [processedProjects, setProcessedProjects] = useState<ComponentProject[]>(fallbackProjects);
  const [statsData, setStatsData] = useState({
    completedProjects: 3,
    satisfaction: 95,
    experience: 2
  });

  // Fetch skills data
  const { data: apiSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      try {
        return await portfolioService.getSkills();
      } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
      }
    }
  });

  // Fetch services data
  const { data: apiServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        return await portfolioService.getServices();
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    }
  });

  // Fetch projects data
  const { data: apiProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const projects = await portfolioService.getProjects();
        console.log("API Projects response:", projects);
        return projects;
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    }
  });

  // Fetch stats data
  const { data: apiStats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        return await portfolioService.getStats();
      } catch (error) {
        console.error("Error fetching stats:", error);
        return { visitors: 0, projectsCompleted: 0, happyClients: 0 };
      }
    }
  });

  // UPDATED: Modified useEffect to preserve our complete set of skills
  useEffect(() => {
    // Always use our complete fallback set for now
    // This ignores the API result to ensure we always show all skills
    setProcessedSkills(fallbackSkills);
    
    // Uncomment the code below if you update your backend API with all skills
    /*
    if (apiSkills && Array.isArray(apiSkills) && apiSkills.length > 0) {
      const processed = apiSkills.map((skill: ApiSkill) => ({
        ...skill,
        icon: `icon-${skill.name.toLowerCase().replace(/\s+/g, '-')}`
      }));
      setProcessedSkills(processed);
    }
    */
  }, [apiSkills]);

  // UPDATED: Modified useEffect to always show all 6 services
  useEffect(() => {
    // Always use our complete set of services
    setProcessedServices([
      { 
        id: 1, 
        title: 'React & Modern Frontend', 
        description: 'Enterprise-grade applications with React, Redux, and Next.js that deliver exceptional user experiences while maintaining robust architecture.', 
        icon: 'fab fa-react' 
      },
      { 
        id: 2, 
        title: 'Full-Stack TypeScript', 
        description: 'End-to-end type safety with TypeScript across frontend and backend, reducing bugs by up to 40% and accelerating development velocity for business-critical applications.', 
        icon: 'fas fa-shield-alt' 
      },
      { 
        id: 3, 
        title: 'Cloud-Native Development', 
        description: 'Scalable, resilient applications built for AWS, Azure, or GCP using container orchestration, microservices architecture, and infrastructure as code.', 
        icon: 'fas fa-cloud' 
      },
      { 
        id: 4, 
        title: 'API Development & Integration', 
        description: 'RESTful and GraphQL APIs that connect seamlessly with third-party services, legacy systems, and microservices while maintaining industry-standard documentation.', 
        icon: 'fas fa-exchange-alt' 
      },
      { 
        id: 5, 
        title: 'Database Architecture', 
        description: 'Strategic data management with MongoDB, PostgreSQL, and Redis, implementing advanced patterns like CQRS and event sourcing for optimal performance at scale.', 
        icon: 'fas fa-database' 
      },
      { 
        id: 6, 
        title: 'Performance Optimization', 
        description: 'Sub-second loading times through advanced bundling techniques, SSR/SSG implementation, and Web Vitals optimization that directly impact conversion rates and SEO.', 
        icon: 'fas fa-tachometer-alt' 
      }
    ]);
  }, [apiServices]);

  // UPDATED: Fixed project processing to handle both data formats
  useEffect(() => {
    // Log for debugging
    console.log("API Projects in useEffect:", apiProjects);
    
    // Always start with fallback projects
    let projects = [...fallbackProjects];
    
    if (apiProjects && Array.isArray(apiProjects) && apiProjects.length > 0) {
      console.log("Processing API projects");
      
      const processed = apiProjects.map((project: ApiProject) => {
        // Handle tech vs technologies format difference
        const techArray = project.technologies || project.tech || [];
        
        return {
          id: project.id,
          title: project.title,
          description: project.description,
          image: project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1170&q=80',
          technologies: Array.isArray(techArray) 
            ? techArray.map((tech: string) => ({ name: tech }))
            : [],
          link: project.link
        };
      });
      
      if (processed.length > 0) {
        projects = processed;
      }
    }
    
    console.log("Final processed projects:", projects);
    setProcessedProjects(projects);
  }, [apiProjects]);

  useEffect(() => {
    if (apiStats && typeof apiStats === 'object') {
      setStatsData({
        completedProjects: apiStats.projectsCompleted || 3,
        satisfaction: 95,
        experience: 2
      });
    }
  }, [apiStats]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <HeroSection />
      <SkillsSection skills={processedSkills} isLoading={skillsLoading} />
      <ServicesSection 
        services={processedServices} 
        stats={statsData}
        isLoading={{ services: servicesLoading, stats: statsLoading }}
      />
      <ProjectsSection projects={processedProjects} isLoading={projectsLoading} />
      <ContactSection />
      <Footer />
      
      {/* Admin login link */}
      <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
        <Link href="/admin/login" className="text-gray-500 hover:text-gray-700 text-xs">
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Home;