import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const UserManagement = () => {
  // Fetch users from API
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // For demonstration purposes - in a real app you'd connect this to your API
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow p-4">
              <nav className="space-y-1">
                <Link href="/admin">
                  <a className="block px-4 py-2 rounded-md hover:bg-muted">
                    Dashboard
                  </a>
                </Link>
                <Link href="/admin/blogs">
                  <a className="block px-4 py-2 rounded-md hover:bg-muted">
                    Manage Blogs
                  </a>
                </Link>
                <Link href="/admin/users">
                  <a className="block px-4 py-2 rounded-md bg-primary text-primary-foreground">
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
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  Error loading users. Please try again later.
                </div>
              )}
              
              {/* Sample user data - in a real app this would come from your API */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          onChange={() => {/* bulk select logic */}}
                        />
                      </th>
                      <th className="px-3 py-3 text-left font-medium text-muted-foreground">Username</th>
                      <th className="px-3 py-3 text-left font-medium text-muted-foreground">Email</th>
                      <th className="px-3 py-3 text-left font-medium text-muted-foreground">Role</th>
                      <th className="px-3 py-3 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample data - replace with actual data from your API */}
                    {[
                      { id: 1, username: "admin", email: "admin@example.com", role: "Administrator", createdAt: "2023-04-15" },
                      { id: 2, username: "editor", email: "editor@example.com", role: "Editor", createdAt: "2023-05-20" },
                      { id: 3, username: "user1", email: "user1@example.com", role: "User", createdAt: "2023-06-10" }
                    ].map(user => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="px-3 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                          />
                        </td>
                        <td className="px-3 py-4">{user.username}</td>
                        <td className="px-3 py-4">{user.email}</td>
                        <td className="px-3 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            user.role === "Administrator" ? "bg-blue-100 text-blue-800" : 
                            user.role === "Editor" ? "bg-green-100 text-green-800" : 
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">Edit</button>
                            <button className="text-red-500 hover:text-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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