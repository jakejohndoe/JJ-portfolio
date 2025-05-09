import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter"; // Add this import

const Home = () => {
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['/api/skills'],
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/services'],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <HeroSection />
      <SkillsSection skills={skills || []} isLoading={skillsLoading} />
      <ServicesSection 
        services={services || []} 
        stats={stats || { completedProjects: 3, satisfaction: 95, experience: 2 }}
        isLoading={{ services: servicesLoading, stats: statsLoading }}
      />
      <ProjectsSection projects={projects || []} isLoading={projectsLoading} />
      <ContactSection />
      <Footer />
      
      {/* Admin login link - Just for testing, you can remove later */}
      <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
        <Link href="/admin/login">
          <a className="text-xs text-gray-500 hover:text-gray-700">Admin</a>
        </Link>
      </div>
    </div>
  );
};

export default Home;