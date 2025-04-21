import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Technology {
  name: string;
}

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: Technology[];
}

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectsSection = ({ projects, isLoading }: ProjectsSectionProps) => {
  const defaultProjects = [
    {
      title: "E-commerce Platform",
      description: "A full-featured online store with payment integration.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHdlYnNpdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      technologies: [
        { name: "React" },
        { name: "Node.js" },
        { name: "MongoDB" }
      ]
    },
    {
      title: "Health Tracker App",
      description: "Mobile application for tracking fitness and nutrition goals.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      technologies: [
        { name: "React Native" },
        { name: "Firebase" },
        { name: "Redux" }
      ]
    },
    {
      title: "Analytics Dashboard",
      description: "Interactive business analytics platform with real-time data.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGRhc2hib2FyZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      technologies: [
        { name: "Vue.js" },
        { name: "D3.js" },
        { name: "Express" }
      ]
    }
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

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
              <div 
                key={index} 
                className="project-card bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative h-48">
                  <img 
                    src={project.image}
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-background text-xs text-primary rounded">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Button className="inline-block px-8 py-6 h-auto bg-primary text-white font-medium rounded hover:bg-opacity-90 transition">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
