import { Skeleton } from "@/components/ui/skeleton";

interface Skill {
  name: string;
  icon: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

const SkillsSection = ({ skills, isLoading }: SkillsSectionProps) => {
  const defaultSkills = [
    { name: "HTML5", icon: "fab fa-html5" },
    { name: "CSS", icon: "fab fa-css3-alt" },
    { name: "JavaScript", icon: "fab fa-js" },
    { name: "Node.js", icon: "fab fa-node-js" },
    { name: "React", icon: "fab fa-react" },
    { name: "Git", icon: "fab fa-git-alt" },
    { name: "GitHub", icon: "fab fa-github" }
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <section className="py-12 bg-[#0F172A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-7 gap-10 text-center">
          {isLoading ? (
            // Skeleton loading state
            Array(7).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : (
            // Display skills
            displaySkills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="text-gray-400 hover:text-primary transition duration-300">
                  <i className={`${skill.icon} text-3xl mb-2`}></i>
                  <p>{skill.name}</p>
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
