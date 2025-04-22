// client/src/services/apiService.ts

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    createdAt: string;
    imageUrl?: string;
  }
  
  interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  }
  
  // Base API URL
  const API_URL = '';  // Empty string for relative URLs in same domain
  
  // Blog API calls
  export const blogService = {
    // Get all blogs
    getAllBlogs: async (): Promise<Blog[]> => {
      const response = await fetch(`${API_URL}/api/blogs`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      return response.json();
    },
    
    // Get single blog by ID
    getBlogById: async (id: string | number): Promise<Blog> => {
      const response = await fetch(`${API_URL}/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }
      return response.json();
    },
    
    // Create new blog
    createBlog: async (blog: Omit<Blog, 'id' | 'createdAt'>): Promise<Blog> => {
      const response = await fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
        credentials: 'include', // Include cookies for authentication
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blog');
      }
      
      return response.json();
    },
    
    // Update blog
    updateBlog: async (id: number, blog: Partial<Blog>): Promise<Blog> => {
      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update blog');
      }
      
      return response.json();
    },
    
    // Delete blog
    deleteBlog: async (id: number): Promise<void> => {
      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
    }
  };
  
  // User API calls
  export const userService = {
    // Get all users (admin only)
    getAllUsers: async (): Promise<User[]> => {
      const response = await fetch(`${API_URL}/api/users`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return response.json();
    },
    
    // Get current user
    getCurrentUser: async (): Promise<User> => {
      const response = await fetch(`${API_URL}/api/users/me`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
      
      return response.json();
    }
  };
  
  // Auth API calls
  export const authService = {
    // Login
    login: async (username: string, password: string): Promise<{ user: User }> => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    
    // Logout
    logout: async (): Promise<void> => {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
    
    // Check if user is authenticated
    isAuthenticated: async (): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/auth/check`, {
          credentials: 'include',
        });
        
        return response.ok;
      } catch (error) {
        return false;
      }
    }
  };