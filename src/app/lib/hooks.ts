import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, fallbackData } from './api'

// Query keys for consistent caching
export const queryKeys = {
  hero: ['hero'] as const,
  projects: ['projects'] as const,
  skills: ['skills'] as const,
  experiences: ['experiences'] as const,
  personalInfo: ['personalInfo'] as const,
}

// Hook: Fetch hero data
export function useHero() {
  return useQuery({
    queryKey: queryKeys.hero,
    queryFn: async () => {
      try {
        const data = await api.getHero()
        return data && Object.keys(data).length > 0 ? data : fallbackData.hero
      } catch {
        return fallbackData.hero
      }
    },
  })
}

// Hook: Fetch projects
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: async () => {
      try {
        const data = await api.getProjects()
        return data.length > 0 ? data : fallbackData.projects
      } catch {
        return fallbackData.projects
      }
    },
  })
}

// Hook: Fetch skills
export function useSkills() {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: async () => {
      try {
        const data = await api.getSkills()
        return data.length > 0 ? data : fallbackData.skills
      } catch {
        return fallbackData.skills
      }
    },
  })
}

// Hook: Fetch experiences
export function useExperiences() {
  return useQuery({
    queryKey: queryKeys.experiences,
    queryFn: async () => {
      try {
        const data = await api.getExperiences()
        return data.length > 0 ? data : fallbackData.experiences
      } catch {
        return fallbackData.experiences
      }
    },
  })
}

// Hook: Fetch personal info
export function usePersonalInfo() {
  return useQuery({
    queryKey: queryKeys.personalInfo,
    queryFn: async () => {
      try {
        const data = await api.getPersonalInfo()
        return data && Object.keys(data).length > 0 ? data : fallbackData.personalInfo
      } catch {
        return fallbackData.personalInfo
      }
    },
  })
}

// Hook: Submit contact form
export function useContactForm() {
  return useMutation({
    mutationFn: api.submitContact,
    onSuccess: () => {
      api.trackEvent('contact_form_success', {})
    },
    onError: () => {
      api.trackEvent('contact_form_error', {})
    },
  })
}

// Hook: Track analytics
export function useAnalytics() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ eventType, eventData }: { eventType: string; eventData: Record<string, unknown> }) =>
      api.trackEvent(eventType, eventData),
  })
}
