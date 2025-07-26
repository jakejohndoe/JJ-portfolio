// client/src/services/apiService.ts

interface Blog {
  _id: string;
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

// Set base URL for backend with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:3000/api';

// API timeout value (8 seconds)
const API_TIMEOUT = 8000;

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
        }
      } catch (jsonError) {
        // Error parsing response
      }
      
      throw new Error(errorMessage);
    }
    
    // For empty responses (like DELETE operations)
    if (response.status === 204) {
      return {} as T;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
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

type FallbackItem = Blog | User | Skill | Project | Stats | any[];

function getFallbackData<T>(endpoint: string): T {
  
  const fallbacks: Record<string, FallbackItem> = {
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
      { id: 1, title: 'StretchSmart', description: 'A smart stretching app that targets body parts using AI.', tech: ['React', 'Three.js', 'MongoDB'], imageUrl: 'https://plus.unsplash.com/premium_photo-1665673312770-f80cac75b319?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: 'https://v0-stretch-app.vercel.app/' },
      { id: 2, title: 'ReWork', description: 'Rework your resume for any job in one click.', tech: ['React', 'Express', 'OpenAI API'], imageUrl: 'https://images.pexels.com/photos/4560150/pexels-photo-4560150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: 'https://www.rework.solutions' },
      { id: 3, title: 'PackPerfect', description: 'PackPerfect finds the best moving services for your space and belongings, with personalized cost breakdowns for a seamless move.', tech: ['React', 'TypeScript', 'Tailwind CSS'], imageUrl: 'https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: 'https://github.com/jakejohndoe' }
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
      const item = items.find((item: User) => item._id === idStr);
      return (item || null) as T;
    } else {
      const item = items.find((item: Skill | Project) => item.id === id);
      return (item || null) as T;
    }
  }

  return (fallbacks[endpoint] || null) as T;
}

// Service definitions with simplified logic
export const blogService = {
  getAllBlogs: async (): Promise<Blog[]> => apiFetch('/blogs'),
  getBlogById: async (id: string | number): Promise<Blog> => apiFetch(`/blogs/${id}`),
  createBlog: async (blog: Omit<Blog, '_id' | 'createdAt'>): Promise<Blog> => 
    apiFetch('/blogs', { method: 'POST', body: JSON.stringify(blog) }),
  updateBlog: async (id: string, blog: Partial<Blog>): Promise<Blog> => 
    apiFetch(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(blog) }),
  deleteBlog: async (id: string): Promise<void> => 
    apiFetch(`/blogs/${id}`, { method: 'DELETE' })
};

export const userService = {
  getAllUsers: async (): Promise<User[]> => apiFetch('/users'),
  getCurrentUser: async (): Promise<User> => apiFetch('/auth/profile'),
  // Add these new methods:
  getUserById: async (id: string): Promise<User> => apiFetch(`/users/${id}`),
  createUser: async (userData: {username: string, email: string, password: string, isAdmin: boolean}): Promise<User> => 
    apiFetch('/users', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => 
    apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  deleteUser: async (id: string): Promise<void> => 
    apiFetch(`/users/${id}`, { method: 'DELETE' })
};

interface LoginResponse {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => 
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

interface Service {
  id: number;
  title: string;
  description: string;
}

export const portfolioService = {
  getSkills: async (): Promise<Skill[]> => apiFetch('/skills'),
  getProjects: async (): Promise<Project[]> => apiFetch('/projects'),
  getStats: async (): Promise<Stats> => apiFetch('/stats'),
  getServices: async (): Promise<Service[]> => apiFetch('/services')
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