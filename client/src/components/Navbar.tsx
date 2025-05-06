import { useState, useEffect } from "react";
import { Link } from "wouter";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href") || "";
    
    if (targetId.startsWith("#")) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
        setIsOpen(false);
      }
    }
  };

  return (
    <nav className={`fixed w-full z-10 bg-opacity-90 backdrop-blur-sm transition-all duration-300 ${scrolled ? "py-3" : "py-4"} bg-[#0F172A]`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
      <Link
        href="/"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
    })
  }
  className="text-white text-xl font-bold cursor-pointer"
>
  Jakob Johnson
</Link>
        <div className="hidden md:flex space-x-8">
          <a href="#home" onClick={handleNavClick} className="text-white hover:text-primary transition">
            Home
          </a>
          <a href="#services" onClick={handleNavClick} className="text-white hover:text-primary transition">
            About
          </a>
          <a href="#projects" onClick={handleNavClick} className="text-white hover:text-primary transition">
            Projects
          </a>
          <a href="#contact" onClick={handleNavClick} className="text-white hover:text-primary transition">
            Contact
          </a>
        </div>
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-[#0F172A] w-full ${isOpen ? "" : "hidden"}`}>
        <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
          <a href="#home" onClick={handleNavClick} className="text-white hover:text-primary transition py-2">
            Home
          </a>
          <a href="#services" onClick={handleNavClick} className="text-white hover:text-primary transition py-2">
            About
          </a>
          <a href="#projects" onClick={handleNavClick} className="text-white hover:text-primary transition py-2">
            Projects
          </a>
          <a href="#contact" onClick={handleNavClick} className="text-white hover:text-primary transition py-2">
            Contacts
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
