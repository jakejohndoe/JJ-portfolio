import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

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
    <section id="projects" className="py-16 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-12">Projects</h2>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg">
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
              </div>
            ))
          ) : (
            // Display projects
            displayProjects.map((project, index) => (
              <a 
                href={project.link || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                key={index} 
                className="project-card bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="relative h-48">
                  <img 
                    src={project.image}
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    <ExternalLink className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-background text-xs text-primary rounded">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            className="inline-block px-8 py-6 h-auto bg-primary text-white font-medium rounded hover:bg-opacity-90 transition"
            asChild
          >
            <a href="https://github.com/jakejohndoe" target="_blank" rel="noopener noreferrer">
              View All Projects
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;