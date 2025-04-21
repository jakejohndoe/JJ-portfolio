import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen pt-24 flex items-center bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left side content */}
        <div className="md:w-1/2 mb-10 md:mb-0 z-10">
          <div className="flex items-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Hello<span className="text-primary">.</span>
            </h1>
          </div>
          <div className="my-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              I'm Jensen
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mt-2">
              Software Developer
            </h3>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              asChild
              className="px-6 py-6 h-auto bg-primary text-white font-medium rounded hover:bg-opacity-90 transition"
            >
              <a href="#contact">Got a project?</a>
            </Button>
            <Button 
              variant="outline"
              className="px-6 py-6 h-auto border border-primary text-white font-medium rounded hover:bg-primary hover:bg-opacity-10 transition"
              asChild
            >
              <a href="/api/resume" target="_blank" rel="noopener noreferrer">My resume</a>
            </Button>
          </div>
        </div>
        
        {/* Right side profile image */}
        <div className="md:w-1/2 flex justify-center md:justify-end relative z-10">
          <div className="profile-circle rounded-full overflow-hidden h-64 w-64 md:h-80 md:w-80 border-2 border-primary relative">
            <img 
              src="https://images.unsplash.com/photo-1603575448878-868a20723f5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
              alt="Jensen's profile" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute -left-10 top-1/3 text-primary opacity-20 text-9xl">
          &lt;
        </div>
        <div className="absolute -right-10 top-2/3 text-primary opacity-20 text-9xl">
          &gt;
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
