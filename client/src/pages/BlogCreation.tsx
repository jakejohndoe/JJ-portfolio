// src/pages/BlogCreation.tsx
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogService } from "@/services/apiService";

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
}

const BlogCreation = () => {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<BlogFormData>();
  
  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use the blogService to create a new blog post
      await blogService.createBlog({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: 'Jakob Johnson', // You might want to get this from user info
        imageUrl: data.imageUrl
      });
      
      // Redirect to admin blogs page on success
      setLocation('/admin/blogs');
    } catch (error) {
      console.error('Error creating blog post:', error);
      setError('Failed to create blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create Blog Post</h1>
        
        <div className="bg-card rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Blog Title *
              </label>
              <input
                id="title"
                type="text"
                className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-input'}`}
                placeholder="Enter blog title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                rows={2}
                className={`w-full px-3 py-2 border rounded-md ${errors.excerpt ? 'border-red-500' : 'border-input'}`}
                placeholder="Brief summary of your blog post"
                {...register("excerpt", { required: "Excerpt is required" })}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-500 mt-1">{errors.excerpt.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content *
              </label>
              <textarea
                id="content"
                rows={8}
                className={`w-full px-3 py-2 border rounded-md ${errors.content ? 'border-red-500' : 'border-input'}`}
                placeholder="Write your blog post content here"
                {...register("content", { required: "Content is required" })}
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                Featured Image URL
              </label>
              <input
                id="imageUrl"
                type="text"
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="https://example.com/image.jpg"
                {...register("imageUrl")}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
                onClick={() => setLocation('/admin/blogs')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Blog Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogCreation;