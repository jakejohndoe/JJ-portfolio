import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default anchor behavior

    const targetId = e.currentTarget.getAttribute("href") || "";
    
    if (targetId && targetId.startsWith("#")) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-24 flex items-center bg-background relative overflow-hidden"
    >
      {/* Code Line Numbers */}
      <div className="absolute left-4 top-1/4 bottom-1/4 flex flex-col justify-between opacity-20 text-primary hidden md:flex z-0">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="font-mono text-sm">{i + 1}</div>
        ))}
      </div>

      {/* Code Comment Elements */}
      <div className="absolute right-8 top-1/6 opacity-15 text-muted-foreground font-mono hidden lg:block z-0">
        /* Software Developer */
      </div>

      <div className="absolute left-16 bottom-10 opacity-15 text-muted-foreground font-mono transform rotate-2 hidden lg:block z-0">
        // TODO: Write amazing code
      </div>

      {/* Floating Code Symbols */}
      <div className="code-symbols z-0">
        <div className="absolute left-1/4 top-20 text-primary opacity-10 text-xl font-mono">&#123;&#125;</div>
        <div className="absolute right-1/3 top-40 text-primary opacity-10 text-xl font-mono">&#40;&#41; =&gt;</div>
        <div className="absolute left-1/5 bottom-20 text-primary opacity-10 text-2xl font-mono">;</div>
        <div className="absolute right-1/4 bottom-40 text-primary opacity-10 text-xl font-mono">&amp;&amp;</div>
      </div>

      {/* Enhanced Bracket Elements */}
      <div className="absolute -left-10 top-1/3 text-primary opacity-20 text-9xl transform -rotate-6 z-0">
        &lt;
      </div>
      <div className="absolute -right-10 top-2/3 text-primary opacity-20 text-9xl transform rotate-6 z-0">
        &gt;
      </div>
      <div className="absolute left-1/4 bottom-10 text-primary opacity-10 text-5xl transform rotate-12 z-0">
        /&gt;
      </div>
      <div className="absolute right-1/4 top-20 text-primary opacity-10 text-4xl transform -rotate-3 z-0">
        &lt;/
      </div>

      {/* Code Pattern Background */}
      <div className="absolute inset-0 code-pattern opacity-5 z-0"></div>

      {/* Animated Code Flow */}
      <div className={`code-flow absolute inset-0 z-0 transition-opacity duration-1000 ${isVisible ? 'opacity-30' : 'opacity-30'}`}></div>

      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40 z-0"></div>

      {/* Liquid Animation Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 liquid-bg opacity-20 z-0"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 liquid-bg opacity-15 z-0" style={{ animationDelay: '5s' }}></div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-0">
        {/* Left side content */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="flex items-center">
            <div className="font-mono text-muted-foreground opacity-70 mr-2">01</div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Hello<span className="text-primary text-glow">!</span>
            </h1>
          </div>
          <div className="my-4 border-l-2 border-primary pl-4">
            <div className="font-mono text-muted-foreground opacity-70 mb-1">02</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              I'm Jakob Johnson, a
            </h2>
            <div className="font-mono text-muted-foreground opacity-70 mt-2 mb-1">03</div>
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              <span className="text-primary">Software</span> Developer
            </h3>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 relative z-30">
            <Button
              className="enhanced-button px-6 py-3 h-auto bg-primary text-white font-medium rounded hover:bg-opacity-90 transition relative"
              onClick={() => {
                const contactSection = document.querySelector("#contact");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <span className="relative z-10">Got a project?</span>
            </Button>
            <Button 
              variant="outline"
              className="enhanced-button px-6 py-3 h-auto border border-primary text-white font-medium rounded hover:bg-primary hover:bg-opacity-10 transition relative"
              asChild
            >
              <a href="/assets/resume.html" target="_blank" rel="noopener noreferrer">
                <span className="relative z-10">My resume</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Right side profile image */}
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
          <div className="profile-circle rounded-full overflow-hidden h-64 w-64 md:h-80 md:w-80 border-2 border-primary relative">
            <img 
              src="/assets/jj-headshot.jpeg"
              alt="Jakob Johnson"
              className="object-cover w-full h-full"
            />
            <div className="absolute -bottom-2 -right-2 text-primary text-sm font-mono bg-background p-1 rounded">
              .developer
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;