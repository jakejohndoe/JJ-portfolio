import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// Define interfaces that match what your components expect
interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// Define a Technology type that matches what ProjectsSection expects
interface Technology {
  name: string;
  // Add any other properties that might be needed
}

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: Technology[]; // Changed to Technology[] type
  imageUrl: string; // Changed back to imageUrl
}

interface Stats {
  visitors?: number;
  projectsCompleted?: number;
  happyClients?: number;
}

const Home = () => {
  // Add proper type annotations to useQuery
  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<any[]>({
    queryKey: ['/api/projects'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  // Create a properly structured stats object with safe property access
  const statsData = {
    completedProjects: stats?.projectsCompleted || 3,
    satisfaction: 95,
    experience: 2
  };

  // Transform the data to include required properties if they're missing
  const processedSkills = skills?.map(skill => ({
    ...skill,
    icon: skill.icon || 'default-icon'
  })) || [];

  const processedServices = services?.map(service => ({
    ...service,
    icon: service.icon || 'default-icon'
  })) || [];

  // Transform projects to ensure they have the correct structure
  const processedProjects = projects?.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.imageUrl || project.image || 'default-image.jpg', // Use image instead of imageUrl
    technologies: Array.isArray(project.technologies) 
      ? project.technologies.map((tech: string | Technology) => 
          typeof tech === 'string' ? { name: tech } : tech)
      : []
  })) || [];

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
      
      {/* Admin login link - Just for testing, you can remove later */}
      <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
        <Link href="/admin/login" className="text-gray-500 hover:text-gray-700 text-xs">
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Home;