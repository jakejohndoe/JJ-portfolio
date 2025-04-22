import { Skeleton } from "@/components/ui/skeleton";
import useCounter from "@/hooks/useCounter";

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface Stats {
  completedProjects: number;
  satisfaction: number;
  experience: number;
}

interface ServicesSectionProps {
  services: Service[];
  stats: Stats;
  isLoading: {
    services: boolean;
    stats: boolean;
  };
}

const ServicesSection = ({ services, stats, isLoading }: ServicesSectionProps) => {
  const defaultServices = [
    {
      title: "Website Development",
      description: "Creating responsive, modern websites with the latest technologies.",
      icon: "fas fa-laptop-code"
    },
    {
      title: "App Development",
      description: "Building cross-platform mobile applications with React Native.",
      icon: "fas fa-mobile-alt"
    },
    {
      title: "Website Hosting",
      description: "Secure and reliable hosting solutions for your web projects.",
      icon: "fas fa-server"
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;
  const completedProjectsCounter = useCounter(stats.completedProjects, 2000);
  const satisfactionCounter = useCounter(stats.satisfaction, 2000);
  const experienceCounter = useCounter(stats.experience, 2000);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Services timeline */}
          <div className="w-full md:w-1/2">
            <div className="relative pl-10">
              {isLoading.services ? (
                // Skeleton loading state
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="timeline-dot mb-16 relative">
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center service-icon">
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                    <div className="bg-card p-5 rounded-md">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                // Display services
                displayServices.map((service, index) => (
                  <div key={index} className="timeline-dot mb-16 relative">
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center service-icon">
                      <i className={`${service.icon} text-primary`}></i>
                    </div>
                    <div className="bg-card p-5 rounded-md">
                      <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* About me section */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0" id="about">
            <h2 className="text-4xl font-bold text-white mb-6">About me</h2>
            <p className="text-gray-300 mb-6">
            I got my start in software through the Metana Bootcamp, and instantly fell in love 
            with building things from scratch.
            It combined two things I am passionate about—learning:
            new skills and creating something real—and that is what keeps me 
            excited about development every day.
            </p>
            
            {/* Stats section */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              {isLoading.stats ? (
                // Skeleton loading state for stats
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="text-center">
                    <Skeleton className="h-10 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))
              ) : (
                <>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-white counter">
                        {completedProjectsCounter}
                      </span>
                      <span className="text-3xl font-bold text-primary ml-1">+</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Completed Projects</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-white counter">
                        {satisfactionCounter}
                      </span>
                      <span className="text-3xl font-bold text-primary ml-1">%</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Client satisfaction</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-white counter">
                        {experienceCounter}
                      </span>
                      <span className="text-3xl font-bold text-primary ml-1">+</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Years of experience</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
