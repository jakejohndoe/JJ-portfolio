// Simple test component to isolate the issue
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "@/services/apiService";
import { useState, useEffect } from "react";

const SimpleHome = () => {
  const [processedSkills, setProcessedSkills] = useState([
    { id: 1, name: 'React', level: 90, category: 'Frontend', icon: 'icon-react' },
    { id: 2, name: 'TypeScript', level: 85, category: 'Language', icon: 'icon-typescript' },
    { id: 3, name: 'Node.js', level: 80, category: 'Backend', icon: 'icon-nodejs' }
  ]);

  const [processedProjects, setProcessedProjects] = useState([
    { 
      title: 'Test Project', 
      description: 'A test project', 
      technologies: [{ name: 'React' }, { name: 'TypeScript' }],
      image: 'https://via.placeholder.com/300x200',
      link: '#'
    }
  ]);

  // Add the useQuery hooks that might be causing the issue
  const { data: apiSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      try {
        return await portfolioService.getSkills();
      } catch (error) {
        console.error('Error fetching skills:', error);
        return null;
      }
    }
  });

  const { data: apiProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        return await portfolioService.getProjects();
      } catch (error) {
        console.error('Error fetching projects:', error);
        return null;
      }
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <SkillsSection skills={processedSkills} isLoading={skillsLoading} />
      <ProjectsSection projects={processedProjects} isLoading={projectsLoading} />
      <Footer />
    </div>
  );
};

export default SimpleHome;