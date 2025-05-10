// src/components/Navbar.tsx
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
// Import other dependencies you have

const Navbar = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if we're in admin area
  const isAdmin = location.startsWith('/admin');
  
  // Function to handle navigation and close mobile menu
  const navigateAndClose = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <header className="fixed w-full z-50 bg-[#0F172A] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Name */}
          <Link href="/" onClick={navigateAndClose}>
            <a className="text-xl font-bold text-white">Jakob Johnson</a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {/* If in admin area, show admin links, otherwise show normal links */}
            {isAdmin ? (
              <>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white transition-colors">Back to Site</a>
                </Link>
                <Link href="/admin">
                  <a className={`${location === '/admin' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Dashboard</a>
                </Link>
                <Link href="/admin/blogs">
                  <a className={`${location === '/admin/blogs' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Manage Blogs</a>
                </Link>
                <Link href="/admin/users">
                  <a className={`${location === '/admin/users' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Manage Users</a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/">
                  <a className={`${location === '/' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Home</a>
                </Link>
                <Link href="/blogs">
                  <a className={`${location === '/blogs' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Blog</a>
                </Link>
                {/* Add your other public navigation links here */}
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {/* Menu icon - you can use Lucide icons here if you prefer */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col space-y-4">
              {isAdmin ? (
                <>
                  <Link href="/" onClick={navigateAndClose}>
                    <a className="text-gray-300 hover:text-white transition-colors">Back to Site</a>
                  </Link>
                  <Link href="/admin" onClick={navigateAndClose}>
                    <a className={`${location === '/admin' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Dashboard</a>
                  </Link>
                  <Link href="/admin/blogs" onClick={navigateAndClose}>
                    <a className={`${location === '/admin/blogs' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Manage Blogs</a>
                  </Link>
                  <Link href="/admin/users" onClick={navigateAndClose}>
                    <a className={`${location === '/admin/users' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Manage Users</a>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/" onClick={navigateAndClose}>
                    <a className={`${location === '/' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Home</a>
                  </Link>
                  <Link href="/blogs" onClick={navigateAndClose}>
                    <a className={`${location === '/blogs' ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors`}>Blog</a>
                  </Link>
                  {/* Add your other public navigation links here */}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;