// src/pages/UserManagement.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { userService } from "@/services/apiService";

// Updated to match the interface in apiService.ts
interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
}

const UserManagement = () => {
  const [location] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    userService.getAllUsers()
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError('Error loading users. Try again later.');
        setIsLoading(false);
      });
  }, []);
  
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Wrapper with padding added to prevent overlap with header - EXACT SAME AS ADMINDASHBOARD */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="admin-content-wrapper p-12">
          <h1 className="text-3xl font-bold mb-8">User Management</h1>
          
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
                  <h2 className="text-xl font-semibold">Users</h2>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Add New User
                  </button>
                </div>
                
                {isLoading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}
                
                {!isLoading && !error && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left">Username</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.map(user => (
                          <tr key={user._id} className="border-b">
                            <td className="px-4 py-4">{user.username}</td>
                            <td className="px-4 py-4">{user.email}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${user.isAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                                {user.isAdmin ? "Administrator" : "User"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
};

export default UserManagement;