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

// Safe API configuration - will fall back to relative paths if env var not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PREFIX = '/api';

/**
 * Safe wrapper for fetch API
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  
  // Debugging - remove in production if desired
  console.debug(`[API] Calling: ${url}`, options);

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('[API] Error:', error);
    throw error;
  }
}

// Blog API Service
export const blogService = {
  getAllBlogs: async (): Promise<Blog[]> => {
    return apiFetch('/blogs');
  },

  getBlogById: async (id: string | number): Promise<Blog> => {
    return apiFetch(`/blogs/${id}`);
  },

  createBlog: async (blog: Omit<Blog, 'id' | 'createdAt'>): Promise<Blog> => {
    return apiFetch('/blogs', {
      method: 'POST',
      body: JSON.stringify(blog)
    });
  },

  updateBlog: async (id: number, blog: Partial<Blog>): Promise<Blog> => {
    return apiFetch(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blog)
    });
  },

  deleteBlog: async (id: number): Promise<void> => {
    await apiFetch(`/blogs/${id}`, {
      method: 'DELETE'
    });
  }
};

// User API Service
export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return apiFetch('/users');
  },

  getCurrentUser: async (): Promise<User> => {
    return apiFetch('/users/me');
  }
};

// Auth API Service
export const authService = {
  login: async (username: string, password: string): Promise<{ user: User }> => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  logout: async (): Promise<void> => {
    await apiFetch('/auth/logout', {
      method: 'POST'
    });
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/check`, {
        credentials: 'include'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

// Debug helper - shows current API config
console.log('[API] Configuration:', {
  baseUrl: API_BASE_URL || '(using relative paths)',
  prefix: API_PREFIX
});