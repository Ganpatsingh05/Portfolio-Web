// Centralized admin API client
// Uses backend API base URL from env: NEXT_PUBLIC_BACKEND_URL
// Handles auth token (stored in localStorage under 'adminToken')

// Resolve API base:
// 1. Use explicit NEXT_PUBLIC_API_URL if provided
// 2. Otherwise use the backend URL from NEXT_PUBLIC_BACKEND_URL
// 3. Fallback to relative '' for Next.js rewrites
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  "https://portfolio-web-gsr.onrender.com"
);

function getToken() {
  if (typeof window === 'undefined') return undefined;
  const token = localStorage.getItem('adminToken');
  return token || undefined;
}

function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
}

export class ApiError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any || {})
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      cache: 'no-store'
    });

    let payload: any = null;
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        payload = await res.json();
      } catch (e) {
        console.warn('Failed to parse JSON response:', e);
        payload = null;
      }
    } else {
      const text = await res.text();
      payload = text || null;
    }

    if (!res.ok) {
      // Handle authentication errors
      if (res.status === 401) {
        console.warn('Authentication failed, clearing token');
        clearToken();
        // Optionally redirect to login page
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
      
      const errorMessage = payload?.error || payload?.message || res.statusText || 'Request failed';
      throw new ApiError(errorMessage, res.status, payload);
    }
    
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    console.error('Network error:', error);
    throw new ApiError(
      'Network error - please check your connection',
      0,
      { originalError: error }
    );
  }
}

// Helper function for file uploads
async function uploadRequest<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: formData,
      cache: 'no-store'
    });

    let payload: any = null;
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      payload = await res.json();
    } else {
      payload = await res.text();
    }

    if (!res.ok) {
      if (res.status === 401) {
        console.warn('Authentication failed during upload, clearing token');
        clearToken();
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
      
      const errorMessage = payload?.error || payload?.message || res.statusText || 'Upload failed';
      throw new ApiError(errorMessage, res.status, payload);
    }
    
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Upload error:', error);
    throw new ApiError(
      'Upload failed - please check your connection',
      0,
      { originalError: error }
    );
  }
}

export const adminApi = {
  // Authentication
  login: (username: string, password: string) => 
    request<{token: string; user: any; message: string}>(`/api/admin/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  // Dashboard
  dashboard: () => 
    request<{stats: any; recentMessages: any[]; recentViews: any[]}>(`/api/admin/dashboard`),

  // Projects
  projects: {
    list: () => request<any[]>(`/api/admin/projects`),
    create: (data: any) => request(`/api/admin/projects`, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => request(`/api/admin/projects/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: string) => request(`/api/admin/projects/${id}`, { 
      method: 'DELETE' 
    })
  },

  // Skills
  skills: {
    list: () => request<any[]>(`/api/admin/skills`),
    create: (data: any) => request(`/api/admin/skills`, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => request(`/api/admin/skills/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: string) => request(`/api/admin/skills/${id}`, { 
      method: 'DELETE' 
    })
  },

  // Experiences
  experiences: {
    list: () => request<any[]>(`/api/admin/experiences`),
    create: (data: any) => request(`/api/admin/experiences`, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => request(`/api/admin/experiences/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: string) => request(`/api/admin/experiences/${id}`, { 
      method: 'DELETE' 
    })
  },

  // Messages
  messages: {
    list: () => request<any[]>(`/api/admin/messages`),
    markRead: (id: string) => request(`/api/admin/messages/${id}/read`, { 
      method: 'PUT' 
    })
  },

  // Personal Info
  personal: {
    get: () => request<any>(`/api/admin/personal-info`),
    update: (data: any) => request(`/api/admin/personal-info`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    })
  },

  // Settings
  settings: {
    get: () => request<any>(`/api/admin/settings`),
    update: (data: any) => request(`/api/admin/settings`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    })
  },

  // File uploads
  upload: {
    // Resume upload - now using Supabase Storage via admin endpoint
    resume: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const result = await uploadRequest<any>(`/api/admin/upload/resume`, formData);
      return result;
    },
    
    // Image upload using new Supabase Storage endpoint
    image: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return uploadRequest<any>(`/api/uploads/image`, formData);
    },

    // Direct uploads (public endpoints - no auth required)
    direct: {
      resume: async (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);
        return uploadRequest<any>(`/api/uploads/resume`, formData);
      },
      
      image: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return uploadRequest<any>(`/api/uploads/image`, formData);
      }
    }
  },

  // File management
  files: {
    delete: (fileName: string) => request(`/api/admin/upload/file/${encodeURIComponent(fileName)}`, {
      method: 'DELETE'
    }),
    list: (folder?: string) => request<{files: any[]}>(`/api/admin/upload/files${folder ? `/${folder}` : ''}`),
    getInfo: (fileName: string) => request<any>(`/api/admin/upload/file/${encodeURIComponent(fileName)}`)
  }
};

// Utility functions
export function ensureAuthedClient(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('adminToken');
  return !!token;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
  }
}

export function clearAuthToken(): void {
  clearToken();
}

// Token validation helper
export function isTokenValid(token?: string): boolean {
  const authToken = token || getToken();
  if (!authToken) return false;
  
  try {
    // Basic JWT structure check (header.payload.signature)
    const parts = authToken.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < now) {
      clearToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Invalid token format:', error);
    clearToken();
    return false;
  }
}