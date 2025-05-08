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

// Configuration
const API_BASE_URL = 'https://hellojakejohn.onrender.com';
const API_PREFIX = '/api';
const API_TIMEOUT = 5000;
const USE_CORS_PROXY = true;
const CORS_PROXY_URL = 'https://corsproxy.io/?';

// Debugging the API connection
console.log('API Service loaded with the following configuration:');
console.log('[API Config]', {
  currentHostname: window.location.hostname,
  apiBaseUrl: API_BASE_URL,
  apiPrefix: API_PREFIX,
  useCorsProxy: USE_CORS_PROXY,
  corsProxyUrl: CORS_PROXY_URL,
  fullExampleUrl: getFullUrl('/projects')
});

// Function to get the full URL for an endpoint
function getFullUrl(endpoint: string): string {
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  return USE_CORS_PROXY ? `${CORS_PROXY_URL}${url}` : url;
}

async function apiFetch<T>(endpoint: string, options?: RequestInit, retries = 1): Promise<T> {
  const url = getFullUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  console.debug(`[API] Calling: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Don't include credentials when using CORS proxy
      credentials: USE_CORS_PROXY ? 'omit' : 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options?.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
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
    
    if (error instanceof Error && 
        (error.name === 'AbortError' || error.message.includes('Failed to fetch'))) {
      return getFallbackData<T>(endpoint);
    }
    
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
      const response = await fetch(getFullUrl('/auth/check'), { 
        credentials: USE_CORS_PROXY ? 'omit' : 'include'
      });
      return response.ok;
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
    const url = getFullUrl('/test');
    console.log('Debugging API connection to:', url);
    
    const response = await fetch(url, {
      credentials: USE_CORS_PROXY ? 'omit' : 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Debug response status:', response.status);
    
    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Debug API error:', error);
    return { error: String(error) };
  }
};