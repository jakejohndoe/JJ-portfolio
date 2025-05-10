// src/pages/BlogEdit.tsx
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogService } from "@/services/apiService";
import { ArrowLeft, Save } from "lucide-react";

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
}

const BlogEdit = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/blogs/edit/:id");
  const blogId = params?.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BlogFormData>();
  
  // Fetch blog data
  useEffect(() => {
    if (!blogId) {
      setError("Blog ID not found");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    blogService.getBlogById(blogId)
      .then(data => {
        console.log('Blog data for editing:', data);
        // Pre-fill form with existing blog data
        reset({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          imageUrl: data.imageUrl
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blog for editing:", err);
        setError("Error loading blog data. Please try again later.");
        setIsLoading(false);
      });
  }, [blogId, reset]);
  
  const onSubmit = async (data: BlogFormData) => {
    if (!blogId) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Assuming you have an updateBlog method in your service
      // If not, you'll need to add it to your API service
      await blogService.updateBlog(blogId, {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        imageUrl: data.imageUrl
      });
      
      // Redirect to admin blogs page on success
      setLocation('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError('Failed to update blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0F172A]">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setLocation('/admin/blogs')}
            className="inline-flex items-center text-primary hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to blog management
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-white">Edit Blog Post</h1>
        
        <div className="bg-[#1E293B] rounded-lg shadow-md p-6 border border-gray-800">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2 text-white">
                Blog Title *
              </label>
              <input
                id="title"
                type="text"
                className={`w-full px-4 py-2 bg-[#0F172A] text-white border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Enter blog title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-2 text-white">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                rows={2}
                className={`w-full px-4 py-2 bg-[#0F172A] text-white border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${errors.excerpt ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Brief summary of your blog post"
                {...register("excerpt", { required: "Excerpt is required" })}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-400 mt-1">{errors.excerpt.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2 text-white">
                Content *
              </label>
              <textarea
                id="content"
                rows={12}
                className={`w-full px-4 py-2 bg-[#0F172A] text-white border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${errors.content ? 'border-red-500' : 'border-gray-700'}`}
                placeholder="Write your blog post content here. HTML tags are supported."
                {...register("content", { required: "Content is required" })}
              />
              {errors.content && (
                <p className="text-sm text-red-400 mt-1">{errors.content.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                You can use HTML tags to format your content.
              </p>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-2 text-white">
                Featured Image URL
              </label>
              <input
                id="imageUrl"
                type="text"
                className="w-full px-4 py-2 bg-[#0F172A] text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                {...register("imageUrl")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use a default image.
              </p>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => setLocation('/admin/blogs')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Update Blog Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogEdit;