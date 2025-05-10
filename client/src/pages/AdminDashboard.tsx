// Modified AdminDashboard.tsx with apiService
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogService, userService } from "@/services/apiService"; // Import services

interface Blog {
  _id: string;
  title: string;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

const AdminDashboard = () => {
  const [location] = useLocation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Use the apiService instead of direct fetch
    Promise.all([
      blogService.getAllBlogs(),
      userService.getAllUsers()
    ])
      .then(([blogData, userData]) => {
        console.log('Fetched blogs:', blogData);
        console.log('Fetched users:', userData);
        setBlogs(blogData);
        setUsers(userData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      });
  }, []);

  const deleteBlog = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        console.error('Error deleting blog:', err);
        setError('Failed to delete blog post');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Wrapper with padding added to prevent overlap with header */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="admin-content-wrapper p-12">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
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
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-background p-4 rounded-md border">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="bg-background p-4 rounded-md border">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-background p-4 rounded-md border">
                        <p className="text-muted-foreground text-sm">Total Blogs</p>
                        <p className="text-2xl font-bold">{blogs.length}</p>
                      </div>
                      <div className="bg-background p-4 rounded-md border">
                        <p className="text-muted-foreground text-sm">Total Users</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-2">Recent Blogs</h3>
                      {blogs.length === 0 ? (
                        <p className="text-muted-foreground">No blogs found. Create your first blog post!</p>
                      ) : (
                        <div className="space-y-2">
                          {blogs.slice(0, 3).map(blog => (
                            <div key={blog._id} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                              <span>{blog.title}</span>
                              <button 
                                onClick={() => deleteBlog(blog._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Link href="/admin/blogs/create">
                        <a className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                          Create New Blog
                        </a>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;