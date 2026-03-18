/**
 * Centralized configuration for the portfolio frontend
 * All environment variables and API endpoints are managed here
 */

// Environment variables with fallbacks
const envVars = {
  BACKEND_API_URL: process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-web-gsr.onrender.com',
  FALLBACK_API_URL: 'https://portfolio-web-gsr.onrender.com',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

/**
 * Application configuration object
 */
export const config = {
  // API Configuration
  api: {
    baseUrl: envVars.BACKEND_API_URL,
    fallbackBaseUrl: envVars.FALLBACK_API_URL,
    timeout: 45000, // 45 seconds - increased for better cold start handling
  },

  // Environment
  env: {
    isDevelopment: envVars.NODE_ENV === 'development',
    isProduction: envVars.NODE_ENV === 'production',
    nodeEnv: envVars.NODE_ENV,
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
    softSkills: 300,
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
  softSkills: `${config.api.baseUrl}/api/soft-skills`,
  experiences: `${config.api.baseUrl}/api/experiences`,
  certificates: `${config.api.baseUrl}/api/certificates`,
  personalInfo: `${config.api.baseUrl}/api/personal-info`,
  contact: `${config.api.baseUrl}/api/contact`,
  analytics: `${config.api.baseUrl}/api/analytics`,
  settings: `${config.api.baseUrl}/api/settings`,
} as const;

export default config;
