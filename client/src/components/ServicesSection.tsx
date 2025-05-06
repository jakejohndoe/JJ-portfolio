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

const DEFAULT_SERVICES: Service[] = [
  {
    title: "React/Next.js Development",
    description: "High-performance React applications with SSR and optimized rendering.",
    icon: "fab fa-react"
  },
  {
    title: "Node.js Backends",
    description: "Scalable server-side applications with Express or NestJS.",
    icon: "fab fa-node-js"
  },
  {
    title: "TypeScript Expertise",
    description: "Type-safe JavaScript development for more robust applications.",
    icon: "fas fa-shield-alt"
  },
  {
    title: "Database Solutions",
    description: "PostgreSQL, MongoDB, and ORMs like Prisma/Drizzle.",
    icon: "fas fa-database"
  },
  {
    title: "Cloud Architecture",
    description: "AWS/Vercel deployments with Terraform and Docker.",
    icon: "fas fa-cloud"
  }
];

const DEFAULT_STATS: Stats = {
  completedProjects: 3,
  satisfaction: 95,
  experience: 2
};

const ServicesSection = ({ 
  services = [], 
  stats = DEFAULT_STATS, 
  isLoading = { services: false, stats: false } 
}: ServicesSectionProps) => {
  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;
  
  const counters = {
    projects: useCounter(stats.completedProjects, 2000),
    satisfaction: useCounter(stats.satisfaction, 2000),
    experience: useCounter(stats.experience, 2000)
  };

  return (
    <section className="py-16 bg-background" id="services">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Services Column */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-white mb-8">My Services</h2>
            
            <div className="space-y-8">
              {isLoading.services ? (
                Array(3).fill(0).map((_, index) => (
                  <ServiceSkeleton key={index} />
                ))
              ) : (
                displayServices.map((service, index) => (
                  <ServiceCard 
                    key={index} 
                    service={service} 
                    index={index} 
                  />
                ))
              )}
            </div>
          </div>
          
          {/* About Me Column */}
          <div className="w-full md:w-1/2">
            <AboutSection 
              isLoading={isLoading.stats} 
              counters={counters} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Sub-components for better organization
const ServiceSkeleton = () => (
  <div className="flex items-start gap-4 p-4 bg-card rounded-lg">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

const ServiceCard = ({ service, index }: { service: Service; index: number }) => (
  <div className="flex items-start gap-4 p-6 bg-card rounded-lg hover:bg-card-hover transition-colors">
    <div className="p-2 bg-primary/10 rounded-full">
      <i className={`${service.icon} text-primary text-xl`} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
      <p className="text-gray-400">{service.description}</p>
    </div>
  </div>
);

const AboutSection = ({ isLoading, counters }: { 
  isLoading: boolean; 
  counters: { projects: number; satisfaction: number; experience: number } 
}) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">About Me</h2>
    <p className="text-gray-300">
      As a full-stack developer, I bridge my past in high-stakes problem-solving (from kitchens to film sets) 
      with crafting scalable systems. Metana Bootcamp showed me how code turns discipline into tools people use — 
      whether it's designing APIs or pixel-perfect UIs, that end-to-end impact is what drives me.
    </p>
    
    <StatsGrid isLoading={isLoading} counters={counters} />
    
    {/* Education & Certifications Section */}
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-lg border-l-4 border-primary">
        <h3 className="text-lg font-semibold text-white">Education</h3>
        <p className="text-gray-300 mt-1">
          <span className="text-primary">Metana Bootcamp</span> Graduate
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Intensive training in modern web development and software engineering principles
        </p>
      </div>

      {/* Certifications */}
      <div className="p-4 bg-card rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
        <div className="space-y-3">
          <a 
            href="https://www.freecodecamp.org/certification/jakejohndoe/javascript-algorithms-and-data-structures-v8" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 group hover:bg-card-hover p-2 -m-2 rounded-lg transition-colors"
          >
            <div className="mt-1 p-1 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
              <i className="fas fa-certificate text-primary text-sm"></i>
            </div>
            <div>
              <h4 className="text-white font-medium group-hover:text-primary transition-colors">
                JavaScript Algorithms and Data Structures
                <i className="fas fa-external-link-alt ml-2 text-xs opacity-70"></i>
              </h4>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <span>freeCodeCamp</span>
                <span className="mx-2">•</span>
                <span>Jan 2025</span>
              </div>
            </div>
          </a>
          <a 
            href="https://www.freecodecamp.org/certification/jakejohndoe/responsive-web-design" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 group hover:bg-card-hover p-2 -m-2 rounded-lg transition-colors"
          >
            <div className="mt-1 p-1 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
              <i className="fas fa-certificate text-primary text-sm"></i>
            </div>
            <div>
              <h4 className="text-white font-medium group-hover:text-primary transition-colors">
                Responsive Web Design
                <i className="fas fa-external-link-alt ml-2 text-xs opacity-70"></i>
              </h4>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <span>freeCodeCamp</span>
                <span className="mx-2">•</span>
                <span>Dec 2024</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    
    {/* Mission Statement */}
    <div className="p-4 bg-card rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-3">From Kitchens to Keyboards</h3>
      <p className="text-gray-300">
      For 7+ years, I thrived in high-pressure environments as a Chef and Kitchen Manager — 
      designing systems, leading teams, and turning chaos into seamless experiences. 
      Later, I brought that same problem-solving mindset to the film industry, where I 
      coordinated technical crews and negotiated equipment rentals, ensuring the right tools 
      matched creative vision.
      <br /><br />
      These experiences taught me that great work — whether a dish, a film set, or an app — 
      balances creativity with execution. Now, I build software with the same principles: 
    <span className="italic"> scalable, human-centered, and crafted to last</span>.
      </p>
    </div>
  </div>
);

const StatsGrid = ({ isLoading, counters }: { 
  isLoading: boolean; 
  counters: { projects: number; satisfaction: number; experience: number } 
}) => (
  <div className="grid grid-cols-3 gap-4 mt-8">
    {isLoading ? (
      Array(3).fill(0).map((_, index) => (
        <StatSkeleton key={index} />
      ))
    ) : (
      <>
        <StatItem 
          value={counters.projects} 
          suffix="+" 
          label="Completed Projects" 
        />
        <StatItem 
          value={counters.satisfaction} 
          suffix="%" 
          label="Client Satisfaction" 
        />
        <StatItem 
          value={counters.experience} 
          suffix="+"
          label="Years of Experience" 
        />
      </>
    )}
  </div>
);

const StatSkeleton = () => (
  <div className="text-center p-4 bg-card rounded-lg">
    <Skeleton className="h-8 w-16 mx-auto mb-2" />
    <Skeleton className="h-4 w-20 mx-auto" />
  </div>
);

const StatItem = ({ value, suffix = "", label }: { 
  value: number; 
  suffix?: string; 
  label: string 
}) => (
  <div className="text-center p-4 bg-card rounded-lg">
    <div className="flex items-center justify-center">
      <span className="text-3xl font-bold text-white">{value}</span>
      {suffix && <span className="text-2xl font-bold text-primary ml-1">{suffix}</span>}
    </div>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </div>
);

export default ServicesSection;