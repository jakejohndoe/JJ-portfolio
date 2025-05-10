// src/pages/UserManagement.tsx
import { useState, useEffect } from "react";
import { Link } from "wouter";
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
    <div className="flex flex-col min-h-screen bg-[#0F172A]">
      <Navbar />
      
      {/* Add a spacer div to push content below fixed navbar */}
      <div className="h-24"></div>
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#1E293B] rounded-lg shadow p-4 border border-gray-800">
              <nav className="space-y-1">
                <Link href="/admin">
                  <a className="block px-4 py-2 rounded-md text-white hover:bg-[#334155] transition-colors">
                    Dashboard
                  </a>
                </Link>
                <Link href="/admin/blogs">
                  <a className="block px-4 py-2 rounded-md text-white hover:bg-[#334155] transition-colors">
                    Manage Blogs
                  </a>
                </Link>
                <Link href="/admin/users">
                  <a className="block px-4 py-2 rounded-md bg-primary text-white">
                    Manage Users
                  </a>
                </Link>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-[#1E293B] rounded-lg shadow p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Users</h2>
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  Add New User
                </button>
              </div>
              
              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              {!isLoading && !error && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-white">Username</th>
                        <th className="px-4 py-3 text-left text-white">Email</th>
                        <th className="px-4 py-3 text-left text-white">Role</th>
                        <th className="px-4 py-3 text-left text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map(user => (
                        <tr key={user._id} className="border-b border-gray-700">
                          <td className="px-4 py-4 text-white">{user.username}</td>
                          <td className="px-4 py-4 text-white">{user.email}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${user.isAdmin ? "bg-blue-500/20 text-blue-300" : "bg-gray-500/20 text-gray-300"}`}>
                              {user.isAdmin ? "Administrator" : "User"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                            <button className="text-red-400 hover:text-red-300">Delete</button>
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
      
      <Footer />
    </div>
  );
};

export default UserManagement;