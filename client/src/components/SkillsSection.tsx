import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useScrollAnimation, sectionVariants, staggerContainerVariants, staggerItemVariants } from "@/hooks/useScrollAnimation";
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

// Enhanced loading skeleton with code theme
const CodeSkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <motion.div
        className="h-12 w-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg mb-3 relative overflow-hidden"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: "200% 100%"
        }}
      >
        {/* Code symbol overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-lg opacity-40">
          {"</>"}
        </div>
      </motion.div>
      
      <motion.div
        className="h-4 w-16 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          delay: 0.2
        }}
        style={{
          backgroundSize: "200% 100%"
        }}
      />
    </div>
  );
};

const SkillsSection = ({ skills, isLoading }: SkillsSectionProps) => {
  const [ref, isInView] = useScrollAnimation();
  
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
    <motion.section 
      ref={ref}
      className="py-12 bg-[#0F172A]"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {isLoading ? (
            // Enhanced skeleton loading state
            Array(10).fill(0).map((_, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center justify-center"
                variants={staggerItemVariants}
              >
                <CodeSkeletonLoader />
              </motion.div>
            ))
          ) : (
            // Display skills with enhanced animations
            skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={staggerItemVariants}
                className="group flex flex-col items-center justify-center py-4 cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <motion.div 
                  className="flex justify-center items-center mb-3 h-12 text-gray-400 group-hover:text-primary transition-colors duration-300 relative"
                  whileHover={{ 
                    filter: "drop-shadow(0 0 8px hsl(var(--primary)))",
                    transition: { duration: 0.3 }
                  }}
                >
                  {getIconComponent(skill.icon)}
                  
                  {/* Subtle glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.div>
                <p className="text-gray-400 group-hover:text-white transition-colors duration-300">
                  {skill.name}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SkillsSection;