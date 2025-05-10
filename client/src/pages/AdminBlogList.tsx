// src/pages/AdminBlogList.tsx
import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogService } from '@/services/apiService';
import { Edit, Trash, Plus } from 'lucide-react';

// Updated interface to match MongoDB's document structure
interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  author?: string;
  createdAt: string;
  imageUrl?: string;
}

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    blogService.getAllBlogs()
      .then(data => {
        console.log('API blog data:', data);
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  const handleDeleteBlog = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        console.error('Error deleting blog:', err);
        setError('Failed to delete blog post.');
      }
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Blogs</h1>
          <Link href="/admin/blogs/create">
            <a className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Plus size={18} className="mr-2" />
              Create New Blog
            </a>
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1E293B] rounded-lg p-6 border border-gray-800">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl">No blog posts found.</p>
            <p className="mt-2">Create your first blog post to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map(blog => (
              <div key={blog._id} className="bg-[#1E293B] rounded-lg p-6 border border-gray-800">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-400 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Published: {formatDate(blog.createdAt)}</span>
                      {blog.author && (
                        <span className="ml-4">By: {blog.author}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link href={`/admin/blogs/edit/${blog._id}`}>
                      <a className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        <Edit size={16} className="mr-2" />
                        Edit
                      </a>
                    </Link>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}