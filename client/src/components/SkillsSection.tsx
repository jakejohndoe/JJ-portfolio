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

interface Skill {
  name: string;
  icon?: React.ReactNode;
  className?: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

const SkillsSection = ({ skills, isLoading }: SkillsSectionProps) => {
  // Define our skills with direct icon components
  const defaultSkills: Skill[] = [
    { 
      name: "React", 
      icon: <FaReact size={40} color="#61DAFB" />,
      className: "icon-react" 
    },
    { 
      name: "TypeScript", 
      icon: <SiTypescript size={40} color="#3178C6" />,
      className: "icon-typescript" 
    },
    { 
      name: "JavaScript", 
      icon: <FaJs size={40} color="#F7DF1E" />,
      className: "icon-javascript" 
    },
    { 
      name: "MongoDB", 
      icon: <SiMongodb size={40} color="#47A248" />,
      className: "icon-mongodb" 
    },
    { 
      name: "Tailwind CSS", 
      icon: <SiTailwindcss size={40} color="#06B6D4" />,
      className: "icon-tailwind-css" 
    },
    { 
      name: "HTML5", 
      icon: <FaHtml5 size={40} color="#E34F26" />,
      className: "icon-html" 
    },
    { 
      name: "CSS", 
      icon: <FaCss3Alt size={40} color="#1572B6" />,
      className: "icon-css" 
    },
    { 
      name: "Git", 
      icon: <FaGitAlt size={40} color="#F05032" />,
      className: "icon-git" 
    },
    { 
      name: "GitHub", 
      icon: <FaGithub size={40} color="#181717" />,
      className: "icon-github" 
    },
    { 
      name: "Node.js", 
      icon: <FaNodeJs size={40} color="#339933" />,
      className: "icon-nodejs" 
    },
  ];

  const displaySkills = skills && skills.length > 0 ? skills : defaultSkills;

  return (
    <section className="py-12 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 text-center">
          {isLoading ? (
            // Skeleton loading state
            Array(10).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : (
            // Display skills with more explicit styling
            displaySkills.map((skill, index) => (
              <div key={index} className={`flex flex-col items-center ${skill.className || ''}`}>
                <div className="mb-4 text-gray-300 hover:text-white transition-colors" style={{ fontSize: '40px', lineHeight: 1 }}>
                  {skill.icon}
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