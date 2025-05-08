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

// CONFIG: This will try different methods to connect to the API
// and use whatever works
const API_STRATEGIES = {
  // Strategy 1: Direct local API call (relies on Vercel rewrites/redirects)
  DIRECT_LOCAL: {
    name: 'Direct Local API',
    getUrl: (endpoint: string) => `/api${endpoint}`,
    fetchOptions: {
      credentials: 'include'
    },
    enabled: true
  },
  // Strategy 2: Direct call to render backend (may have CORS issues)
  DIRECT_BACKEND: {
    name: 'Direct Backend',
    getUrl: (endpoint: string) => `https://hellojakejohn.onrender.com/api${endpoint}`,
    fetchOptions: {
      credentials: 'include'
    },
    enabled: true
  },
  // Strategy 3: CORS Proxy - FIXED URL FORMAT
  CORS_PROXY: {
    name: 'CORS Proxy',
    getUrl: (endpoint: string) => `https://corsproxy.io/?url=${encodeURIComponent(`https://hellojakejohn.onrender.com/api${endpoint}`)}`,
    fetchOptions: {
      credentials: 'omit'
    },
    enabled: true
  }
};

const API_TIMEOUT = 5000;

// Keep track of which strategy worked last
let lastSuccessfulStrategy = null;

// Debug info
console.log('API Service loaded with multiple fallback strategies');

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
    const response = await fetch(url, {
      ...options,
      ...strategy.fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options?.headers || {})
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
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
    },
    '/services': [
      { id: 1, title: 'Web Development', description: 'Full-stack web development services' },
      { id: 2, title: 'UI/UX Design', description: 'User interface and experience design' }
    ]
  };

  return fallbacks[endpoint] || null;
}

// Services remain the same
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
  getCurrentUser: async (): Promise<User> => apiFetch('/users/me')
};

export const authService = {
  login: async (username: string, password: string): Promise<{ user: User }> => 
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: async (): Promise<void> => 
    apiFetch('/auth/logout', { method: 'POST' }),
  isAuthenticated: async (): Promise<boolean> => {
    try {
      // Use all strategies
      return await apiFetch('/auth/check')
        .then(() => true)
        .catch(() => false);
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