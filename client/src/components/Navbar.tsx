// Modified Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react"; // Using lucide-react for icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  
  // Check if we're on an admin page
  const isAdminPage = location.startsWith('/admin');

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
    <nav className={`fixed w-full z-50 bg-opacity-90 backdrop-blur-sm transition-all duration-300 ${scrolled ? "py-3" : "py-4"} bg-[#0F172A]`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          onClick={() => {
            if (!isAdminPage) {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
            setIsOpen(false);
          }}
          className="text-white text-xl font-bold cursor-pointer"
        >
          Jakob Johnson
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {isAdminPage ? (
            // Admin Navigation Links
            <>
              <Link href="/" className="text-white hover:text-primary transition">
                View Site
              </Link>
              <Link href="/admin" className={`text-white hover:text-primary transition ${location === '/admin' ? 'text-primary' : ''}`}>
                Dashboard
              </Link>
              <Link href="/admin/blogs" className={`text-white hover:text-primary transition ${location === '/admin/blogs' ? 'text-primary' : ''}`}>
                Manage Blogs
              </Link>
              <Link href="/admin/users" className={`text-white hover:text-primary transition ${location === '/admin/users' ? 'text-primary' : ''}`}>
                Manage Users
              </Link>
            </>
          ) : (
            // Regular Site Navigation
            <>
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
              <Link href="/blogs" className="text-white hover:text-primary transition">
                Blog
              </Link>
            </>
          )}
        </div>
        
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-[#0F172A] w-full absolute top-full left-0 shadow-md z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {isAdminPage ? (
            // Admin Mobile Navigation
            <>
              <Link 
                href="/" 
                className="text-white hover:text-primary transition py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                View Site
              </Link>
              <Link 
                href="/admin" 
                className={`text-white hover:text-primary transition py-2 px-4 ${location === '/admin' ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/blogs" 
                className={`text-white hover:text-primary transition py-2 px-4 ${location === '/admin/blogs' ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Manage Blogs
              </Link>
              <Link 
                href="/admin/users" 
                className={`text-white hover:text-primary transition py-2 px-4 ${location === '/admin/users' ? 'text-primary' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Manage Users
              </Link>
            </>
          ) : (
            // Regular Mobile Navigation
            <>
              <a href="#home" onClick={handleNavClick} className="text-white hover:text-primary transition py-2 px-4">
                Home
              </a>
              <a href="#services" onClick={handleNavClick} className="text-white hover:text-primary transition py-2 px-4">
                About
              </a>
              <a href="#projects" onClick={handleNavClick} className="text-white hover:text-primary transition py-2 px-4">
                Projects
              </a>
              <a href="#contact" onClick={handleNavClick} className="text-white hover:text-primary transition py-2 px-4">
                Contact
              </a>
              <Link 
                href="/blogs" 
                className="text-white hover:text-primary transition py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;