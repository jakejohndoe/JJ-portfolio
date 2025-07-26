// src/pages/BlogList.tsx
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogService } from '@/services/apiService';
import { CalendarDays, ArrowRight, User } from 'lucide-react';

// Updated interface to match MongoDB's document structure
interface Blog {
  _id: string;  // Changed from id: number to _id: string to match MongoDB format
  title: string;
  excerpt: string;
  content?: string;
  author?: string;
  createdAt: string;
  imageUrl?: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    blogService.getAllBlogs()
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Default placeholder image if none is provided
  const getImageUrl = (blog: Blog) => {
    return blog.imageUrl || 
      `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1170&q=80`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Latest Posts</h1>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </header>
        
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border border-gray-800 shadow-lg animate-pulse">
                <div className="h-48 bg-gray-800"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {!isLoading && !error && blogs.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xl">No blog posts found.</p>
            <p className="mt-2">Check back soon for new content!</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map(blog => (
            <Link 
              key={blog._id} 
              href={`/blogs/${blog._id}`}
              className="group"
            >
              <article className="bg-[#1E293B] rounded-lg overflow-hidden border border-gray-800 shadow-lg h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:border-primary">
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(blog)}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-60"></div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                    {blog.title}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-gray-400 mb-4 flex-grow">
                    {blog.excerpt}
                  </p>
                  
                  {/* Meta info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <div className="flex items-center">
                      <CalendarDays size={14} className="mr-1" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    
                    {blog.author && (
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        <span>{blog.author}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Read more link */}
                  <div className="mt-4 pt-4 border-t border-gray-800 flex items-center text-primary group-hover:text-white transition-colors">
                    <span className="mr-2">Read more</span>
                    <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}