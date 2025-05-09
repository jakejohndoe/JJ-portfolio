// src/pages/BlogDetail.tsx
import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { blogService } from "@/services/apiService";

// Updated interface to match MongoDB's document structure
interface Blog {
  _id: string;  // Changed from id: number to _id: string
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
}

const BlogDetail = () => {
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
        console.log('Blog detail data:', data); // For debugging
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
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/blogs" className="text-primary hover:underline">
            ← Back to blog list
          </Link>
        </div>
        
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <h1 className="mb-4">{blog.title}</h1>
          
          <div className="flex items-center text-muted-foreground mb-6">
            <span className="mr-4">{blog.author || "Anonymous"}</span>
            <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
          </div>
          
          {blog.imageUrl && (
            <img 
              src={blog.imageUrl} 
              alt={blog.title}
              className="w-full rounded-lg mb-6 aspect-video object-cover" 
            />
          )}
          
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;