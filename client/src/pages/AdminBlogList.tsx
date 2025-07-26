// src/pages/AdminBlogList.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
  const [location] = useLocation();
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
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Wrapper with padding added to prevent overlap with header */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="admin-content-wrapper p-12">
          <h1 className="text-3xl font-bold mb-8">Manage Blogs</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow p-4">
                <nav className="space-y-1">
                  <Link href="/admin">
                    <a className={`block px-4 py-2 rounded-md ${location === '/admin' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/admin/blogs">
                    <a className={`block px-4 py-2 rounded-md ${location === '/admin/blogs' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                      Manage Blogs
                    </a>
                  </Link>
                  <Link href="/admin/users">
                    <a className={`block px-4 py-2 rounded-md ${location === '/admin/users' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                      Manage Users
                    </a>
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Blog Posts</h2>
                  <Link href="/admin/blogs/create">
                    <a className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Plus size={18} className="mr-2" />
                      Create New Blog
                    </a>
                  </Link>
                </div>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                    {error}
                  </div>
                )}
                
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-background rounded-lg p-6 border">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-xl">No blog posts found.</p>
                    <p className="mt-2">Create your first blog post to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogs.map(blog => (
                      <div key={blog._id} className="bg-background rounded-lg p-6 border">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div className="flex-grow">
                            <h3 className="text-lg font-medium mb-2">
                              {blog.title}
                            </h3>
                            <p className="text-muted-foreground mb-3 text-sm">{blog.excerpt}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}