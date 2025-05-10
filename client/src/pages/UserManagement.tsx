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

// User form interface
interface UserFormData {
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
}

const UserManagement = () => {
  const [location] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    isAdmin: false
  });
  
  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Function to load/reload users
  const loadUsers = () => {
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
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Open add user modal
  const openAddUserModal = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      isAdmin: false
    });
    setModalMode('add');
    setShowModal(true);
  };
  
  // Open edit user modal
  const openEditUserModal = (user: User) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Leave password empty when editing
      isAdmin: user.isAdmin
    });
    setModalMode('edit');
    setShowModal(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        // Call API to create user (use a mock implementation for now)
        // TODO: Implement actual API call once endpoint is available
        const newUser = {
          _id: Date.now().toString(), // Mock ID for now
          ...formData,
          createdAt: new Date().toISOString()
        };
        setUsers([...users, newUser]);
        alert('User created successfully!');
      } else if (modalMode === 'edit' && currentUser) {
        // Call API to update user (use a mock implementation for now)
        // TODO: Implement actual API call once endpoint is available
        const updatedUsers = users.map(user => 
          user._id === currentUser._id 
            ? { ...user, username: formData.username, email: formData.email, isAdmin: formData.isAdmin }
            : user
        );
        setUsers(updatedUsers);
        alert('User updated successfully!');
      }
      
      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user. Please try again.');
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Call API to delete user (use a mock implementation for now)
        // TODO: Implement actual API call once endpoint is available
        const filteredUsers = users.filter(user => user._id !== userId);
        setUsers(filteredUsers);
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Wrapper with padding added to prevent overlap with header */}
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
                  <button 
                    onClick={openAddUserModal}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Add New User
                  </button>
                </div>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                    {error}
                  </div>
                )}
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
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
                              <button 
                                onClick={() => openEditUserModal(user)}
                                className="text-blue-500 hover:text-blue-700 mr-3"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
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
      
      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {modalMode === 'add' ? 'Add New User' : 'Edit User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  />
                </div>
                
                {modalMode === 'add' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      required={modalMode === 'add'}
                    />
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-sm">
                    Administrator Role
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {modalMode === 'add' ? 'Add User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default UserManagement;