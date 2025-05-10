import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaReact, 
  FaHtml5, 
  FaCss3Alt, 
  FaJs, 
  FaNodeJs, 
  FaGitAlt, 
  FaGithub 
} from "react-icons/fa";
import { 
  SiTypescript, 
  SiMongodb, 
  SiTailwindcss 
} from "react-icons/si";

// Match the interface from Home.tsx
interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

const SkillsSection = ({ skills, isLoading }: SkillsSectionProps) => {
  // Map icon strings to React components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'icon-react':
        return <FaReact size={40} />;
      case 'icon-typescript':
        return <SiTypescript size={40} />;
      case 'icon-javascript':
      case 'icon-js':
        return <FaJs size={40} />;
      case 'icon-mongodb':
        return <SiMongodb size={40} />;
      case 'icon-tailwind-css':
        return <SiTailwindcss size={40} />;
      case 'icon-html5':
      case 'icon-html':
        return <FaHtml5 size={40} />;
      case 'icon-css3':
      case 'icon-css3-alt':
      case 'icon-css':
        return <FaCss3Alt size={40} />;
      case 'icon-git':
      case 'icon-git-alt':
        return <FaGitAlt size={40} />;
      case 'icon-github':
        return <FaGithub size={40} />;
      case 'icon-nodejs':
      case 'icon-node-js':
        return <FaNodeJs size={40} />;
      default:
        return null;
    }
  };

  return (
    <section className="py-12 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center">
          {isLoading ? (
            // Skeleton loading state
            Array(10).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : (
            // Display skills with icon mapping
            skills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center justify-center py-4">
                <div className="flex justify-center items-center mb-3 h-12 text-gray-400 hover:text-primary transition-colors duration-300">
                  {getIconComponent(skill.icon)}
                </div>
                <p className="text-gray-400">{skill.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;