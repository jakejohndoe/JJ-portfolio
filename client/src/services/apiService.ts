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
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
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

// Set base URL for backend
const API_BASE_URL = 'https://hellojakejohn.onrender.com/api';

// API timeout value (8 seconds)
const API_TIMEOUT = 8000;

// Debug info
console.log('[API Service] Configured with API URL:', API_BASE_URL);

// Helper to get auth token from user info
function getAuthToken() {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    
    if (!userInfo) return null;
    
    if (userInfo.token) {
      return userInfo.token;
    }
    
    return 'USER_AUTHENTICATED';
  } catch (e) {
    console.error('Error parsing userInfo from localStorage:', e);
    return null;
  }
}

// Direct API fetch function with better error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  console.debug(`[API] Fetching from: ${url}`);
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options?.headers as Record<string, string> || {})
    };
    
    // Add Authorization token if available
    const token = getAuthToken();
    if (token && token !== 'USER_AUTHENTICATED') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      signal: controller.signal,
      headers
    });
    
    clearTimeout(timeoutId);
    
    // Log the response for debugging
    console.debug(`[API] Response for ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        // Try to parse error response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          // If not JSON, try to get text
          const textResponse = await response.text();
          console.debug('[API] Non-JSON error response:', textResponse);
        }
      } catch (jsonError) {
        console.debug('[API] Error parsing error response:', jsonError);
      }
      
      throw new Error(errorMessage);
    }
    
    // For empty responses (like DELETE operations)
    if (response.status === 204) {
      return {} as T;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('[API] Response not JSON:', await response.text());
      return {} as T;
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`[API] Error fetching ${endpoint}:`, error);
    
    // Fall back to mock data
    return getFallbackData<T>(endpoint);
  }
}

function getFallbackData<T>(endpoint: string): T {
  console.warn(`[API] Using fallback data for ${endpoint}`);
  
  const fallbacks: Record<string, any> = {
    '/blogs': [
      { id: 1, title: 'Getting Started with React', excerpt: 'Learn the basics of React', content: 'This is a sample blog post about React.', author: 'Jakob Johnson', createdAt: '2023-05-01T12:00:00Z' },
      { id: 2, title: 'Advanced TypeScript Techniques', excerpt: 'Take your TypeScript to the next level', content: 'This is a sample blog post about TypeScript.', author: 'Jakob Johnson', createdAt: '2023-05-15T12:00:00Z' }
    ],
    '/users': [
      { _id: "1", username: 'admin', email: 'admin@example.com', isAdmin: true, createdAt: '2023-01-01T12:00:00Z' },
      { _id: "2", username: 'editor', email: 'editor@example.com', isAdmin: false, createdAt: '2023-02-01T12:00:00Z' }
    ],
    '/skills': [
      { id: 1, name: 'React', level: 90, category: 'Frontend' },
      { id: 2, name: 'Node.js', level: 85, category: 'Backend' },
      { id: 3, name: 'TypeScript', level: 80, category: 'Language' },
      { id: 4, name: 'MongoDB', level: 75, category: 'Database' }
    ],
    '/projects': [
      { id: 1, title: 'Portfolio Website', description: 'A modern portfolio website built with React and TypeScript', technologies: ['React', 'TypeScript', 'Tailwind CSS'] },
      { id: 2, title: 'E-commerce Platform', description: 'A full-stack e-commerce platform with secure payments', technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'] }
    ],
    '/stats': {
      visitors: 1200,
      projectsCompleted: 15,
      happyClients: 10
    },
    '/services': [
      { id: 1, title: 'Web Development', description: 'Full-stack web development services using modern technologies.' },
      { id: 2, title: 'UI/UX Design', description: 'User-centered design with a focus on usability and aesthetics.' },
      { id: 3, title: 'API Development', description: 'RESTful and GraphQL API development for your applications.' }
    ]
  };

  // Check if the endpoint is a specific item request like /blogs/1
  const matches = endpoint.match(/^\/(\w+)\/(\d+)$/);
  if (matches) {
    const [, collection, idStr] = matches;
    const id = parseInt(idStr, 10);
    const items = fallbacks[`/${collection}`] || [];
    
    // Handle different ID field names based on collection
    if (collection === 'users') {
      const item = items.find((item: any) => item._id === idStr);
      return (item || null) as T;
    } else {
      const item = items.find((item: any) => item.id === id);
      return (item || null) as T;
    }
  }

  return (fallbacks[endpoint] || null) as T;
}

// Service definitions with simplified logic
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

export const userService = {
  getAllUsers: async (): Promise<User[]> => apiFetch('/users'),
  getCurrentUser: async (): Promise<User> => apiFetch('/auth/profile')
};

export const authService = {
  login: async (email: string, password: string): Promise<any> => 
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: async (): Promise<void> => 
    apiFetch('/auth/logout', { method: 'POST' }),
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const authToken = getAuthToken();
      return authToken !== null;
    } catch {
      return false;
    }
  }
};

export const portfolioService = {
  getSkills: async (): Promise<Skill[]> => apiFetch('/skills'),
  getProjects: async (): Promise<Project[]> => apiFetch('/projects'),
  getStats: async (): Promise<Stats> => apiFetch('/stats'),
  getServices: async (): Promise<any[]> => apiFetch('/services')
};

// Add this debug function to test the API connection
export const debugApi = async () => {
  try {
    return await apiFetch('/test');
  } catch (error) {
    console.error('Debug API error:', error);
    return { error: String(error) };
  }
};