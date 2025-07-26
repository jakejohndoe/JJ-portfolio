import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation, sectionVariants, staggerContainerVariants, staggerItemVariants } from "@/hooks/useScrollAnimation";
import HolographicText from "@/components/HolographicText";

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
          className="text-4xl font-bold text-white mb-12"
          variants={staggerItemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <HolographicText 
            holographicEffect={true} 
            glitchIntensity={0.08}
            animateOnHover={true}
          >
            &lt;Projects /&gt;
          </HolographicText>
        </motion.h2>
        
        {/* Projects grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {isLoading ? (
            // Enhanced skeleton loading state
            Array(3).fill(0).map((_, index) => (
              <motion.div 
                key={index} 
                className="bg-card rounded-lg overflow-hidden shadow-lg"
                variants={staggerItemVariants}
              >
                <div className="relative h-48">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Terminal-themed project cards
            displayProjects.map((project, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <motion.a
                  href={project.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-window group block h-full flex flex-col relative overflow-hidden"
                  whileHover={{ 
                    y: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Terminal Header */}
                  <div className="terminal-header px-4 py-3 flex items-center gap-2 relative">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-gray-400 text-sm font-mono">~/projects/{project.title.toLowerCase().replace(/\s+/g, '-')}</span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExternalLink className="text-primary" size={16} />
                    </motion.div>
                  </div>

                  {/* Terminal Body */}
                  <div className="flex-1 p-4 font-mono text-sm relative">
                    {/* Code-like project display */}
                    <div className="space-y-2">
                      {/* File header */}
                      <div className="text-gray-500">
                        <span className="text-purple-400">const</span> 
                        <span className="text-blue-400 ml-2">{project.title.replace(/\s+/g, '')}</span>
                        <span className="text-white ml-1">=</span>
                        <span className="text-yellow-400 ml-1">&#123;</span>
                      </div>
                      
                      {/* Project details as code */}
                      <div className="ml-4 space-y-1">
                        <div>
                          <span className="text-green-400">name:</span>
                          <span className="text-orange-400 ml-2">"{project.title}"</span><span className="text-white">,</span>
                        </div>
                        <div>
                          <span className="text-green-400">description:</span>
                          <span className="text-orange-400 ml-2">"{project.description}"</span><span className="text-white">,</span>
                        </div>
                        <div>
                          <span className="text-green-400">tech_stack:</span>
                          <span className="text-white ml-2">[</span>
                        </div>
                        <div className="ml-4">
                          {project.technologies?.map((tech, techIndex) => (
                            <motion.div 
                              key={techIndex}
                              className="text-cyan-400"
                              whileHover={{ x: 2, color: "#ff5e3a" }}
                              transition={{ duration: 0.2 }}
                            >
                              "{tech.name}"{techIndex < (project.technologies?.length || 0) - 1 ? ',' : ''}
                            </motion.div>
                          ))}
                        </div>
                        <div>
                          <span className="text-white">],</span>
                        </div>
                        <div>
                          <span className="text-green-400">status:</span>
                          <span className="text-green-400 ml-2">"deployed"</span><span className="text-white">,</span>
                        </div>
                        <div>
                          <span className="text-green-400">live_demo:</span>
                          <span className="text-blue-400 ml-2 underline">"{project.link || '#'}"</span>
                        </div>
                      </div>
                      
                      <div className="text-yellow-400">&#125;;</div>
                      
                      {/* Terminal cursor */}
                      <motion.div 
                        className="inline-block w-2 h-4 bg-primary opacity-75"
                        animate={{ opacity: [0.75, 0, 0.75] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      ></motion.div>
                    </div>

                    {/* Preview image as ASCII art representation */}
                    <div className="absolute top-4 right-4 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover rounded border border-primary/30"
                      />
                    </div>

                    {/* Glitch effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
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