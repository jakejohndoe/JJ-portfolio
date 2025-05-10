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
}

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}


const SkillsSection = ({ skills, isLoading }: SkillsSectionProps) => {
  // Use a simpler approach with direct icon elements
  const defaultSkills: Skill[] = [
    { name: "React", icon: <FaReact size={36} color="#61DAFB" /> },
    { name: "TypeScript", icon: <SiTypescript size={36} color="#3178C6" /> },
    { name: "JavaScript", icon: <FaJs size={36} color="#F7DF1E" /> },
    { name: "MongoDB", icon: <SiMongodb size={36} color="#47A248" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss size={36} color="#06B6D4" /> },
    { name: "HTML5", icon: <FaHtml5 size={36} color="#E34F26" /> },
    { name: "CSS", icon: <FaCss3Alt size={36} color="#1572B6" /> },
    { name: "Git", icon: <FaGitAlt size={36} color="#F05032" /> },
    { name: "GitHub", icon: <FaGithub size={36} color="#181717" /> },
    { name: "Node.js", icon: <FaNodeJs size={36} color="#339933" /> },
  ];

  // Use default skills if none provided
  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <section className="py-12 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-10 text-center">
          {isLoading ? (
            // Skeleton loading state
            Array(10).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : (
            // Display skills with simplified rendering
            displaySkills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2">{skill.icon}</div>
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