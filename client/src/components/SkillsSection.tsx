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
  SiTailwindcss,
  SiExpress,
  SiVite,
  SiPython
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
  // Define a complete skills list with proper icons
  const defaultSkills: Skill[] = [
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

  // Map icon strings to React components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'icon-react':
        return <FaReact size={42} color="#61DAFB" />;
      case 'icon-typescript':
        return <SiTypescript size={42} color="#3178C6" />;
      case 'icon-javascript':
      case 'icon-js':
        return <FaJs size={42} color="#F7DF1E" />;
      case 'icon-mongodb':
        return <SiMongodb size={42} color="#47A248" />;
      case 'icon-tailwind-css':
        return <SiTailwindcss size={42} color="#06B6D4" />;
      case 'icon-html5':
      case 'icon-html':
        return <FaHtml5 size={42} color="#E34F26" />;
      case 'icon-css3':
      case 'icon-css3-alt':
      case 'icon-css':
        return <FaCss3Alt size={42} color="#1572B6" />;
      case 'icon-git':
      case 'icon-git-alt':
        return <FaGitAlt size={42} color="#F05032" />;
      case 'icon-github':
        return <FaGithub size={42} color="#181717" />;
      case 'icon-nodejs':
      case 'icon-node-js':
        return <FaNodeJs size={42} color="#339933" />;
      default:
        // Return a placeholder div to maintain spacing if icon not found
        return <div className="w-10 h-10" />;
    }
  };

  // Use default skills if none provided or empty array
  const displaySkills = skills && skills.length > 0 ? skills : defaultSkills;

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
            displaySkills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center justify-center py-4">
                <div className="flex justify-center items-center mb-3 h-12">
                  {getIconComponent(skill.icon)}
                </div>
                <p className="text-gray-400 mt-2">{skill.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;