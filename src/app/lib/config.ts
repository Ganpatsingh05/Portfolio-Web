/**
 * Centralized configuration for the portfolio frontend
 * All environment variables and API endpoints are managed here
 */

// Validate required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

// Optional environment variables with fallbacks
const optionalEnvVars = {
  BACKEND_API_URL: process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required vars in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Application configuration object
 */
export const config = {
  // API Configuration
  api: {
    baseUrl: optionalEnvVars.BACKEND_API_URL,
    timeout: 10000, // 10 seconds
  },

  // Supabase Configuration
  supabase: {
    url: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // Environment
  env: {
    isDevelopment: optionalEnvVars.NODE_ENV === 'development',
    isProduction: optionalEnvVars.NODE_ENV === 'production',
    nodeEnv: optionalEnvVars.NODE_ENV,
  },

  // Feature Flags
  features: {
    enable3D: true,
    enableAnalytics: true,
    enableDarkMode: true,
  },

  // Cache durations (in seconds)
  cache: {
    hero: 300, // 5 minutes
    projects: 300,
    skills: 300,
    experiences: 300,
    personalInfo: 600, // 10 minutes
  },
} as const;

/**
 * API endpoint builder
 */
export const apiEndpoints = {
  hero: `${config.api.baseUrl}/api/hero`,
  projects: `${config.api.baseUrl}/api/projects`,
  skills: `${config.api.baseUrl}/api/skills`,
  experiences: `${config.api.baseUrl}/api/experiences`,
  personalInfo: `${config.api.baseUrl}/api/personal-info`,
  contact: `${config.api.baseUrl}/api/contact`,
  analytics: `${config.api.baseUrl}/api/analytics`,
  settings: `${config.api.baseUrl}/api/settings`,
} as const;

/**
 * Get full API URL for a given path
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.api.baseUrl}${cleanPath}`;
}

/**
 * Check if the application is running in the browser
 */
export const isBrowser = typeof window !== 'undefined';

export default config;
