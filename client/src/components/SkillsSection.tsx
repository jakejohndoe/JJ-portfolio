import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaReact, FaGitAlt, FaGithub
} from "react-icons/fa";
import { SiTypescript, SiMongodb, SiTailwindcss } from "react-icons/si";

// Updated interface to match how skills are used
interface Skill {
  name: string;
  component?: React.ReactNode;
  icon?: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

const SkillsSection = ({ skills, isLoading }: SkillsSectionProps) => {
  const defaultSkills: Skill[] = [
    { name: "React", component: <FaReact className="text-3xl text-blue-400" /> },
    { name: "TypeScript", component: <SiTypescript className="text-3xl text-blue-600" /> },
    { name: "JavaScript", component: <FaJs className="text-3xl text-yellow-400" /> },
    { name: "MongoDB", component: <SiMongodb className="text-3xl text-green-500" /> },
    { name: "Tailwind CSS", component: <SiTailwindcss className="text-3xl text-cyan-400" /> },
    { name: "HTML5", component: <FaHtml5 className="text-3xl text-orange-500" /> },
    { name: "CSS", component: <FaCss3Alt className="text-3xl text-blue-500" /> },
    { name: "Git", component: <FaGitAlt className="text-3xl text-orange-600" /> },
    { name: "GitHub", component: <FaGithub className="text-3xl text-gray-800" /> },
    { name: "Node.js", component: <FaNodeJs className="text-3xl text-green-600" /> },
  ];

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
            // Display skills
            displaySkills.map((skill, index) => (
              <div key={index} className="skill-item flex flex-col items-center">
                <div className="text-gray-400 hover:text-primary transition duration-300 flex flex-col items-center">
                  {skill.component ? (
                    <div className="mb-2">{skill.component}</div>
                  ) : skill.icon ? (
                    <i className={`${skill.icon} text-3xl mb-2`}></i>
                  ) : null}
                  <p className="mt-2">{skill.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;