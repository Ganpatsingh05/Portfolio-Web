/**
 * Centralized API client for fetching data from backend
 * Handles errors, loading states, retries, and provides consistent interface
 */

import { config, apiEndpoints } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Wait for specified milliseconds (for retry delays)
 */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s
  return Math.min(1000 * 2 ** attempt, 4000);
}

/**
 * Generic fetch wrapper with error handling and automatic retries
 */
async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  allowFallback = true
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Don't retry on 4xx errors (client errors) except 408 (timeout) and 429 (rate limit)
        if (response.status >= 400 && response.status < 500 && 
            response.status !== 408 && response.status !== 429) {
          throw new ApiError(
            errorData.error || errorData.message || `Request failed with status ${response.status}`,
            response.status,
            errorData
          );
        }
        
        // For 5xx errors, throw but allow retry
        throw new ApiError(
          errorData.error || errorData.message || `Server error: ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      
      // Handle nested data structure from backend (data.data or raw data)
      return (data.data !== undefined ? data.data : data) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;
      
      // Don't retry on ApiError with 4xx status (except specific cases)
      if (error instanceof ApiError && error.status && 
          error.status >= 400 && error.status < 500 &&
          error.status !== 408 && error.status !== 429) {
        throw error;
      }

      // If this is not the last attempt, wait and retry
      if (attempt < retries) {
        const delay = getRetryDelay(attempt);
        console.warn(
          `Request to ${url} failed (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delay}ms...`,
          error instanceof Error ? error.message : error
        );
        await wait(delay);
        continue;
      }

      // Last attempt failed, throw the error
      if (error instanceof ApiError) {
        throw error;
      }

      const fallbackBaseUrl = config.api.fallbackBaseUrl;
      const canTryFallback =
        allowFallback &&
        Boolean(fallbackBaseUrl) &&
        fallbackBaseUrl !== config.api.baseUrl &&
        url.startsWith(config.api.baseUrl);

      if (canTryFallback) {
        const fallbackUrl = url.replace(config.api.baseUrl, fallbackBaseUrl);
        console.warn(`Primary API unavailable. Retrying with fallback API: ${fallbackUrl}`);
        return fetchApi<T>(fallbackUrl, options, 1, false);
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout - server may be starting up', 408);
        }
        const isLocalApi = config.api.baseUrl.includes('localhost');
        const message = isLocalApi
          ? 'Unable to reach the local backend at http://localhost:5000. Start the backend server or update NEXT_PUBLIC_API_URL.'
          : 'Unable to reach the API server. Please try again in a moment.';
        throw new ApiError(message, 503);
      }

      throw new ApiError('Unknown error occurred');
    }
  }

  // Should never reach here, but just in case
  throw lastError || new ApiError('Request failed after retries');
}

/**
 * API client methods
 */
export const api = {
  // Hero section
  async getHero() {
    return fetchApi<{
      greeting?: string;
      name: string;
      typing_texts: string[];
      quote?: string;
      social_links: Record<string, string>;
    }>(apiEndpoints.hero);
  },

  // Projects
  async getProjects() {
    return fetchApi<Array<{
      id: string;
      title: string;
      description: string;
      technologies: string[];
      category: string;
      github_url?: string;
      demo_url?: string;
      status: 'completed' | 'in-progress' | 'planning';
      featured?: boolean;
      image_url?: string;
      sort_order?: number;
      start_date?: string;
      end_date?: string;
    }>>(apiEndpoints.projects);
  },

  // Skills
  async getSkills() {
    return fetchApi<Array<{
      id?: string;
      name: string;
      level: number;
      category: string;
      icon_name?: string;
      sort_order?: number;
      is_featured?: boolean;
    }>>(apiEndpoints.skills);
  },

  // Experiences
  async getExperiences() {
    return fetchApi<Array<{
      id?: string;
      title: string;
      company: string;
      period: string;
      description?: string | string[];
      type: 'experience' | 'education';
      location?: string;
      start_date?: string;
      end_date?: string;
    }>>(apiEndpoints.experiences);
  },

  // Certificates
  async getCertificates() {
    return fetchApi<Array<{
      id?: string;
      title: string;
      issuer: string;
      issue_date?: string;
      credential_id?: string;
      credential_url?: string;
      description?: string;
      image_url?: string;
      sort_order?: number;
    }>>(apiEndpoints.certificates);
  },

  // Personal info
  async getPersonalInfo() {
    return fetchApi<{
      id?: string;
      name: string;
      title: string;
      email: string;
      location: string;
      github_url?: string;
      linkedin_url?: string;
      leetcode_url?: string;
      resume_url?: string;
      bio?: string;
      journey?: string;
      degree?: string;
      university?: string;
      education_period?: string;
    }>(apiEndpoints.personalInfo);
  },

  // Contact form submission
  async submitContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
  }) {
    return fetchApi<{ message: string; id: string }>(apiEndpoints.contact, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Analytics
  async trackEvent(eventType: string, eventData: any = {}) {
    // Fire and forget - don't throw errors for analytics
    try {
      await fetchApi(apiEndpoints.analytics, {
        method: 'POST',
        body: JSON.stringify({
          event_type: eventType,
          event_data: eventData,
        }),
      });
    } catch (error) {
      if (config.env.isDevelopment) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  },

  // Site settings
  async getSettings() {
    return fetchApi<{
      maintenance_mode: boolean;
      maintenance_message: string;
      visible_sections: string[];
      show_footer: boolean;
      show_navigation: boolean;
      enable_animations: boolean;
      contact_form_enabled: boolean;
      show_social_links: boolean;
      show_resume_button: boolean;
      default_theme: 'light' | 'dark' | 'system';
      accent_color: string;
    }>(apiEndpoints.settings);
  },
};

/**
 * Fallback data for when API fails
 */
export const fallbackData = {
  hero: {
    greeting: "Hello, I'm",
    name: 'Ganpat Singh',
    typing_texts: ['Full Stack Developer', 'AI Enthusiast', 'Problem Solver', 'Tech Innovator'],
    quote: 'Creating amazing digital experiences with cutting-edge technology',
    social_links: {
      github: 'https://github.com/Ganpatsingh05',
      linkedin: 'https://www.linkedin.com/in/ganpat-singh-aabb4a285/',
      email: 'ask.gsinghr@gmail.com',
    },
  },
  personalInfo: {
    name: 'Ganpat Singh',
    title: 'Full Stack Developer & AI Enthusiast',
    email: 'ask.gsinghr@gmail.com',
    location: 'Jodhpur, Rajasthan (India)',
    github_url: 'https://github.com/Ganpatsingh05',
    linkedin_url: 'https://linkedin.com/in/ganpatsingh05',
    leetcode_url: 'https://leetcode.com/ganpatsingh05',
    bio: "I'm a passionate developer who loves creating innovative solutions and bringing ideas to life through code.",
    journey: "With a strong foundation in computer science and a passion for emerging technologies, I've been developing web applications and exploring AI/ML.",
    degree: "Bachelor's in Computer Science",
    university: "Lovely Professional University, Jalandhar (Punjab)",
    education_period: "2023-2027",
  },
  projects: [
    {
      id: '1',
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with modern UI/UX and secure payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Web Dev",
      status: "completed" as const,
      featured: true,
      sort_order: 1,
      github_url: "https://github.com/example/project",
      demo_url: "https://example.com",
      image_url: undefined,
      start_date: undefined,
      end_date: undefined,
    },
  ],
  skills: [
    { id: '1', name: 'React', level: 90, category: 'frontend', icon_name: 'FaReact', sort_order: 1, is_featured: true },
    { id: '2', name: 'TypeScript', level: 85, category: 'frontend', icon_name: 'SiTypescript', sort_order: 2, is_featured: true },
    { id: '3', name: 'Node.js', level: 80, category: 'backend', icon_name: 'FaNodeJs', sort_order: 3, is_featured: true },
    { id: '4', name: 'Python', level: 75, category: 'backend', icon_name: 'FaPython', sort_order: 4, is_featured: false },
    { id: '5', name: 'PostgreSQL', level: 70, category: 'backend', icon_name: 'SiPostgresql', sort_order: 5, is_featured: false },
    { id: '6', name: 'Docker', level: 65, category: 'tools', icon_name: 'FaDocker', sort_order: 6, is_featured: false },
  ],
  experiences: [
    {
      id: '1',
      title: "Frontend Developer Intern",
      company: "Tech Innovators Pvt Ltd",
      period: "Jun 2024 - Aug 2024",
      description: ["Developed responsive web applications", "Collaborated with design team"],
      type: "experience" as const,
      skills: ["React", "TypeScript", "CSS"],
    },
    {
      id: '2',
      title: "Bachelor of Computer Science",
      company: "Lovely Professional University",
      period: "2023 - 2027",
      description: ["Relevant Coursework: Data Structures, Algorithms, ML", "Current CGPA: 8.5/10"],
      type: "education" as const,
      skills: ["Python", "Java", "Data Structures"],
    },
  ],
};

export default api;
