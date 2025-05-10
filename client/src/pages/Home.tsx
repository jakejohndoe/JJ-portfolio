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
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
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
  id: number;
  title: string;
  description: string;
  technologies: Technology[];
  image: string;
}

// Fallback data - ensure we always have something to display
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

const fallbackProjects: ComponentProject[] = [
  { 
    id: 1, 
    title: 'Portfolio Website', 
    description: 'A modern portfolio built with React', 
    technologies: [{ name: 'React' }, { name: 'TypeScript' }],
    image: 'default-image.jpg'
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
        return await portfolioService.getProjects();
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

  // Process data when API responses change
  useEffect(() => {
    if (apiSkills && Array.isArray(apiSkills)) {
      const processed = apiSkills.map((skill: ApiSkill) => ({
        ...skill,
        icon: `icon-${skill.name.toLowerCase().replace(/\s+/g, '-')}`
      }));
      setProcessedSkills(processed.length > 0 ? processed : fallbackSkills);
    }
  }, [apiSkills]);

  useEffect(() => {
    if (apiServices && Array.isArray(apiServices)) {
      const processed = apiServices.map((service: ApiService) => ({
        ...service,
        icon: `icon-${service.title.toLowerCase().replace(/\s+/g, '-')}`
      }));
      setProcessedServices(processed.length > 0 ? processed : fallbackServices);
    }
  }, [apiServices]);

  useEffect(() => {
    if (apiProjects && Array.isArray(apiProjects)) {
      const processed = apiProjects.map((project: ApiProject) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.imageUrl || 'default-image.jpg',
        technologies: Array.isArray(project.technologies) 
          ? project.technologies.map((tech: string) => ({ name: tech }))
          : []
      }));
      setProcessedProjects(processed.length > 0 ? processed : fallbackProjects);
    }
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