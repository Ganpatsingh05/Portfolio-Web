// Centralized admin API client
// Uses backend API base URL from env: NEXT_PUBLIC_BACKEND_URL
// Handles auth token (stored in localStorage under 'adminToken')

// Resolve API base:
// 1. Use explicit NEXT_PUBLIC_API_URL if provided
// 2. Otherwise use relative '' so that Next.js rewrites (/api/*) proxy to backend
// Avoid defaulting to localhost:5000 in the browser when running against a deployed backend
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  : '');

function getToken() {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('adminToken') || undefined;
}

export class ApiError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any || {})
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: 'no-store'
  });

  let payload: any = null;
  const text = await res.text();
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

  if (!res.ok) {
    if (res.status === 401) {
      // Auto logout helper
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
    }
    throw new ApiError(payload?.error || res.statusText, res.status, payload);
  }
  return payload as T;
}

export const adminApi = {
  login: (username: string, password: string) => request<{token: string; user: any; message: string}>(`/api/admin/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  dashboard: () => request<{stats: any; recentMessages: any[]; recentViews: any[]}>(`/api/admin/dashboard`),
  projects: {
    list: () => request<any[]>(`/api/admin/projects`),
    create: (data: any) => request(`/api/admin/projects`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/admin/projects/${id}`, { method: 'DELETE' })
  },
  skills: {
    list: () => request<any[]>(`/api/admin/skills`),
    create: (data: any) => request(`/api/admin/skills`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/admin/skills/${id}`, { method: 'DELETE' })
  },
  experiences: {
    list: () => request<any[]>(`/api/admin/experiences`),
    create: (data: any) => request(`/api/admin/experiences`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/admin/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/admin/experiences/${id}`, { method: 'DELETE' })
  },
  messages: {
    list: () => request<any[]>(`/api/admin/messages`),
    markRead: (id: string) => request(`/api/admin/messages/${id}/read`, { method: 'PUT' })
  },
  personal: {
    get: () => request<any>(`/api/admin/personal-info`),
    update: (data: any) => request(`/api/admin/personal-info`, { method: 'PUT', body: JSON.stringify(data) })
  },
  settings: {
    get: () => request<any>(`/api/admin/settings`),
    update: (data: any) => request(`/api/admin/settings`, { method: 'PUT', body: JSON.stringify(data) })
  },
  upload: {
    resume: async (file: File) => {
      const token = getToken();
      const form = new FormData();
      form.append('resume', file);
      const res = await fetch(`${API_BASE}/api/admin/upload/resume`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        body: form
      });
      if (!res.ok) throw new ApiError('Upload failed', res.status, await res.text());
      return res.json();
    }
  }
};

export function ensureAuthedClient() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('adminToken');
}
