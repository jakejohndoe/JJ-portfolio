// src/pages/BlogPost.tsx
import React, { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogService } from "@/services/apiService";
import { CalendarDays, User, ArrowLeft } from "lucide-react";

// Update this interface to match the one in apiService.ts
interface Blog {
  _id: string;  // Changed from id: number to _id: string
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
}

const BlogPost = () => {
  // Get blog ID from URL
  const [match, params] = useRoute("/blogs/:id");
  const blogId = params?.id;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!blogId) {
      setError("Blog ID not found");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    blogService.getBlogById(blogId)
      .then(data => {
        setBlog(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blog:", err);
        setError("Error loading blog post. Please try again later.");
        setIsLoading(false);
      });
  }, [blogId]);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0F172A]">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !blog) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0F172A]">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-lg">
            {error || "Error loading blog post. Please try again later."}
          </div>
          <div className="mt-6">
            <Link href="/blogs" className="inline-flex items-center text-primary hover:text-white transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to blog list
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/blogs" className="inline-flex items-center text-primary hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to blog list
          </Link>
        </div>
        
        <article className="max-w-3xl mx-auto bg-[#1E293B] rounded-xl overflow-hidden shadow-lg border border-gray-800">
          {/* Featured image if available */}
          {blog.imageUrl && (
            <div className="h-72 md:h-96">
              <img 
                src={blog.imageUrl} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Blog content */}
          <div className="p-6 md:p-8">
            {/* Blog header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{blog.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-400 gap-4">
                <div className="flex items-center">
                  <CalendarDays size={16} className="mr-2 text-primary" />
                  {formatDate(blog.createdAt)}
                </div>
                
                {blog.author && (
                  <div className="flex items-center">
                    <User size={16} className="mr-2 text-primary" />
                    {blog.author}
                  </div>
                )}
              </div>
            </div>
            
            {/* Blog content */}
            <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-primary max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;