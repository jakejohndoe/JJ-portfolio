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

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
}

interface Stats {
  visitors: number;
  projectsCompleted: number;
  happyClients: number;
}

// Configuration with enhanced timeout handling
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PREFIX = '/api';
const API_TIMEOUT = 5000; // 5 seconds timeout

/**
 * Enhanced API fetch with timeout and retry
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit, retries = 1): Promise<T> {
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  console.debug(`[API] Calling: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Special handling for 502 errors
      if (response.status === 502 && retries > 0) {
        console.warn(`[API] 502 encountered, retrying... (${retries} left)`);
        return apiFetch<T>(endpoint, options, retries - 1);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[API] Error:', error);
    
    // Return fallback data if backend is down
    if (error.name === 'AbortError' || error.message.includes('Failed to fetch')) {
      return getFallbackData<T>(endpoint);
    }
    
    throw error;
  }
}

/**
 * Provides fallback data when backend is unavailable
 */
function getFallbackData<T>(endpoint: string): T {
  console.warn(`[API] Using fallback data for ${endpoint}`);
  
  // Define your fallback data here
  const fallbacks: Record<string, any> = {
    '/skills': [
      { id: 1, name: 'React', level: 90, category: 'Frontend' },
      { id: 2, name: 'Node.js', level: 85, category: 'Backend' }
    ],
    '/projects': [
      { id: 1, title: 'Portfolio Site', description: 'My personal portfolio', technologies: ['React', 'Tailwind'] }
    ],
    '/stats': {
      visitors: 1000,
      projectsCompleted: 15,
      happyClients: 10
    }
  };

  return fallbacks[endpoint] || null;
}

// Blog API Service
export const blogService = {
  getAllBlogs: async (): Promise<Blog[]> => apiFetch('/blogs'),
  getBlogById: async (id: string | number): Promise<Blog> => apiFetch(`/blogs/${id}`),
  createBlog: async (blog: Omit<Blog, 'id' | 'createdAt'>): Promise<Blog> => 
    apiFetch('/blogs', { method: 'POST', body: JSON.stringify(blog) }),
  updateBlog: async (id: number, blog: Partial<Blog>): Promise<Blog> => 
    apiFetch(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(blog) }),
  deleteBlog: async (id: number): Promise<void> => 
    apiFetch(`/blogs/${id}`, { method: 'DELETE' })
};

// User API Service
export const userService = {
  getAllUsers: async (): Promise<User[]> => apiFetch('/users'),
  getCurrentUser: async (): Promise<User> => apiFetch('/users/me')
};

// Auth API Service
export const authService = {
  login: async (username: string, password: string): Promise<{ user: User }> => 
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: async (): Promise<void> => 
    apiFetch('/auth/logout', { method: 'POST' }),
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/check`, { credentials: 'include' });
      return response.ok;
    } catch {
      return false;
    }
  }
};

// Portfolio API Service (NEW)
export const portfolioService = {
  getSkills: async (): Promise<Skill[]> => apiFetch('/skills'),
  getProjects: async (): Promise<Project[]> => apiFetch('/projects'),
  getStats: async (): Promise<Stats> => apiFetch('/stats')
};

// Debug configuration
console.log('[API] Configuration:', {
  baseUrl: API_BASE_URL || '(using relative paths)',
  prefix: API_PREFIX,
  timeout: `${API_TIMEOUT}ms`,
  fallbacksEnabled: true
});

// Debug API connection
export const debugApi = async () => {
  try {
    console.log('[API] Testing connection to:', `${API_BASE_URL}${API_PREFIX}/debug`);
    
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/debug`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('[API] Debug response:', data);
    return data;
  } catch (error) {
    console.error('[API] Debug error:', error);
    return { error: String(error) };
  }
};

// Call this on application startup
window.addEventListener('load', () => {
  console.log('[API] Attempting to debug API connection on load');
  debugApi().then(result => {
    console.log('[API] Initial connection test:', result.success ? 'SUCCESS' : 'FAILED');
  });
});