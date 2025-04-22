const Footer = () => {
  return (
    <footer className="py-8 bg-[#0F172A] border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Jakob Johnson. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://github.com/jakejohndoe" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-primary transition" 
              aria-label="GitHub"
            >
              <i className="fab fa-github text-xl"></i>
            </a>
            <a 
              href="https://www.linkedin.com/in/jakejohndoe/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-primary transition" 
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in text-xl"></i>
            </a>
            <a 
              href="https://x.com/yaekyon" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-primary transition" 
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a 
              href="https://www.instagram.com/jakejohndoe/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-primary transition" 
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
