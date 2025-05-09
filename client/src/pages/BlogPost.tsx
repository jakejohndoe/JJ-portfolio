// src/pages/BlogPost.tsx
import React, { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogService } from "@/services/apiService";

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
        console.log('Blog data:', data); // For debugging
        setBlog(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blog:", err);
        setError("Error loading blog post. Please try again later.");
        setIsLoading(false);
      });
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
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
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || "Error loading blog post. Please try again later."}
          </div>
          <div className="mt-4">
            {/* Fixed Link component usage */}
            <Link href="/blogs" className="text-primary hover:underline">
              ← Back to blog list
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <article className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md my-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{blog.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By {blog.author} · {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-4 text-gray-800 dark:text-gray-200 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPost;