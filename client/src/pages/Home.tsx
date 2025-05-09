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

// Match the interfaces to what the API returns
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

// Define what the components expect
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

interface ComponentStats {
  visitors?: number;
  projectsCompleted?: number;
  happyClients?: number;
}

const Home = () => {
  // Fix the React Query implementation
  const { data: apiSkills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const result = await portfolioService.getSkills();
      return result;
    }
  });

  const { data: apiServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const result = await portfolioService.getServices();
      return result;
    }
  });

  const { data: apiProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const result = await portfolioService.getProjects();
      return result;
    }
  });

  const { data: apiStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const result = await portfolioService.getStats();
      return result;
    }
  });

  // Transform API data to match what components expect
  const processedSkills: ComponentSkill[] = apiSkills.map((skill: ApiSkill) => ({
    ...skill,
    icon: `icon-${skill.name.toLowerCase().replace(/\s+/g, '-')}` // Generate icon based on name
  }));

  const processedServices: ComponentService[] = apiServices.map((service: ApiService) => ({
    ...service,
    icon: `icon-${service.title.toLowerCase().replace(/\s+/g, '-')}` // Generate icon based on title
  }));

  const processedProjects: ComponentProject[] = apiProjects.map((project: ApiProject) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.imageUrl || 'default-image.jpg', // Map imageUrl to image
    technologies: Array.isArray(project.technologies) 
      ? project.technologies.map((tech: string) => ({ name: tech }))
      : []
  }));

  // Create a properly structured stats object
  const statsData = {
    completedProjects: (apiStats as ApiStats)?.projectsCompleted || 3,
    satisfaction: 95,
    experience: 2
  };

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