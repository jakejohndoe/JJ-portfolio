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

// CONFIG: This will try different methods to connect to the API
// and use whatever works
const API_STRATEGIES = {
  // Strategy 1: Direct call to render backend
  DIRECT_BACKEND: {
    name: 'Direct Backend',
    getUrl: (endpoint: string) => `https://hellojakejohn.onrender.com/api${endpoint}`,
    fetchOptions: {
      credentials: 'include' as RequestCredentials
    },
    enabled: true
  },
  // Strategy 2: Direct local API call (relies on Vercel rewrites/redirects)
  DIRECT_LOCAL: {
    name: 'Direct Local API',
    getUrl: (endpoint: string) => `/api${endpoint}`,
    fetchOptions: {
      credentials: 'include' as RequestCredentials
    },
    enabled: false  // Disabled as it returns 404s
  }
};

const API_TIMEOUT = 8000; // Increased timeout

// Keep track of which strategy worked last
let lastSuccessfulStrategy: typeof API_STRATEGIES[keyof typeof API_STRATEGIES] | null = API_STRATEGIES.DIRECT_BACKEND;

// Debug info
console.log('API Service loaded with direct backend connection and user authentication');

// Helper to get auth token from user info
function getAuthToken() {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    
    if (!userInfo) return null;
    
    // For our backend, we're actually sending the token in a cookie
    // automatically with credentials: 'include', so we just need to 
    // return a signal that the user is authenticated
    
    return 'USER_AUTHENTICATED';
  } catch (e) {
    console.error('Error parsing userInfo from localStorage:', e);
    return null;
  }
}

// Function to get data using multiple strategies
async function apiFetch<T>(endpoint: string, options?: RequestInit, retries = 1): Promise<T> {
  const allErrors = [];
  
  // If we have a last successful strategy, try it first
  if (lastSuccessfulStrategy) {
    try {
      console.debug(`[API] Trying last successful strategy: ${lastSuccessfulStrategy.name}`);
      const data = await tryStrategy<T>(lastSuccessfulStrategy, endpoint, options);
      return data;
    } catch (error) {
      console.debug(`[API] Last successful strategy failed, trying others`);
      allErrors.push(`${lastSuccessfulStrategy.name}: ${(error as Error).message}`);
      lastSuccessfulStrategy = null;
    }
  }
  
  // Try all enabled strategies
  for (const key of Object.keys(API_STRATEGIES)) {
    const strategy = API_STRATEGIES[key as keyof typeof API_STRATEGIES];
    
    if (!strategy.enabled) continue;
    if (strategy === lastSuccessfulStrategy) continue; // Skip if we already tried it
    
    try {
      console.debug(`[API] Trying strategy: ${strategy.name}`);
      const data = await tryStrategy<T>(strategy, endpoint, options);
      lastSuccessfulStrategy = strategy;
      return data;
    } catch (error) {
      console.debug(`[API] Strategy ${strategy.name} failed: ${(error as Error).message}`);
      allErrors.push(`${strategy.name}: ${(error as Error).message}`);
    }
  }
  
  // If all strategies failed and we have retries left, try again
  if (retries > 0) {
    console.warn(`[API] All strategies failed, retrying (${retries} left)`);
    return apiFetch<T>(endpoint, options, retries - 1);
  }
  
  // All strategies failed, use fallback data
  console.error(`[API] All strategies failed: ${allErrors.join(', ')}`);
  return getFallbackData<T>(endpoint);
}

// Try a specific strategy
async function tryStrategy<T>(
  strategy: typeof API_STRATEGIES[keyof typeof API_STRATEGIES],
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = strategy.getUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  console.debug(`[API] ${strategy.name} calling: ${url}`);
  
  try {
    // Include auth token if available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options?.headers as Record<string, string> || {})
    };
    
    // We're using cookie-based authentication so we don't need to add token to headers
    
    const response = await fetch(url, {
      ...options,
      ...strategy.fetchOptions,
      signal: controller.signal,
      headers
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      try {
        // Try to parse error response
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      } catch (jsonError) {
        // If parsing fails, throw generic error
        throw new Error(`API request failed with status ${response.status}`);
      }
    }
    
    // For empty responses (like DELETE operations)
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
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

// Services remain the same but updated return types
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