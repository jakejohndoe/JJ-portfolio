import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation, sectionVariants, staggerContainerVariants, staggerItemVariants } from "@/hooks/useScrollAnimation";

interface Technology {
  name: string;
}

interface Project {
  title: string;
  description: string;
  image?: string; // Make image optional
  technologies?: Technology[];
  tech?: string[]; // Add support for the server format
  link?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectsSection = ({ projects, isLoading }: ProjectsSectionProps) => {
  const [ref, isInView] = useScrollAnimation();
  
  // Normalize projects to ensure they have the correct format
  const normalizedProjects = projects.map(project => {
    // Convert tech array to technologies format if needed
    const technologies = project.technologies || 
      (project.tech ? project.tech.map(name => ({ name })) : []);
    
    return {
      ...project,
      technologies,
      // Use a default image if none is provided
      image: project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNvZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    };
  });

  // Use normalized projects
  const displayProjects = normalizedProjects;

  return (
    <motion.section 
      ref={ref}
      id="projects" 
      className="py-16 bg-[#0F172A]"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-white mb-12 glow-primary"
          variants={staggerItemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="text-primary text-glow">Projects</span>
        </motion.h2>
        
        {/* Projects grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {isLoading ? (
            // Enhanced code-themed skeleton loading state
            Array(3).fill(0).map((_, index) => (
              <motion.div 
                key={index} 
                className="bg-card rounded-lg overflow-hidden shadow-lg relative"
                variants={staggerItemVariants}
              >
                <div className="relative h-48 code-skeleton-primary">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-primary/40 font-mono text-2xl">
                      {"{ }"}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="code-skeleton-primary h-6 w-32 skeleton-with-code"></div>
                  <div className="space-y-2">
                    <div className="code-skeleton h-4 w-full"></div>
                    <div className="code-skeleton h-4 w-3/4"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="code-skeleton h-6 w-16 rounded-full"></div>
                    <div className="code-skeleton h-6 w-20 rounded-full"></div>
                    <div className="code-skeleton h-6 w-18 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Enhanced project cards
            displayProjects.map((project, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <motion.a
                  href={project.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card bg-card rounded-lg overflow-hidden shadow-lg group block h-full flex flex-col"
                  whileHover={{ 
                    y: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      style={{ aspectRatio: '16/9' }}
                    />
                    
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                    
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-300 rounded-lg"
                      whileHover={{
                        boxShadow: "inset 0 0 20px rgba(255, 94, 58, 0.1)"
                      }}
                    />
                    
                    <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-center">
                      <motion.h3 
                        className="text-xl font-semibold text-white"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {project.title}
                      </motion.h3>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <ExternalLink className="text-primary" size={18} />
                      </motion.div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="p-4 flex-grow flex flex-col"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                      {project.description}
                    </p>
                    {/* Enhanced tech tags with stagger */}
                    <motion.div 
                      className="flex flex-wrap gap-2 mt-auto"
                      variants={{
                        hover: {
                          transition: { staggerChildren: 0.05 }
                        }
                      }}
                      whileHover="hover"
                    >
                      {project.technologies?.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          className="px-2 py-1 bg-background text-xs text-primary rounded border border-primary/20 hover:border-primary/50 transition-colors duration-200"
                          variants={{
                            hover: {
                              scale: 1.05,
                              backgroundColor: "rgba(255, 94, 58, 0.1)"
                            }
                          }}
                        >
                          {tech.name}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.a>
              </motion.div>
            ))
          )}
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center"
          variants={staggerItemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Button 
            className="enhanced-button inline-block px-8 py-6 h-auto bg-primary text-white font-medium rounded hover:bg-opacity-90 transition relative"
            asChild
          >
            <a href="https://github.com/jakejohndoe" target="_blank" rel="noopener noreferrer">
              <span className="relative z-10">View All Projects</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProjectsSection;