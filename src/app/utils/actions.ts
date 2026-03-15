import { api } from '@/lib/api'
import { toast } from '@/app/components/ui/Toast'

const URL_SCHEME_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*:/

export const normalizeExternalUrl = (url?: string | null): string | null => {
  if (!url) return null

  const trimmed = url.trim()
  if (!trimmed || trimmed === '#') return null

  const withScheme = URL_SCHEME_REGEX.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const parsed = new URL(withScheme)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed.toString()
  } catch {
    return null
  }
}

export const isSafeExternalUrl = (url?: string | null): boolean => normalizeExternalUrl(url) !== null

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId.replace('#', ''))
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

export const openEmail = (email: string = 'ask.gsinghr@gmail.com', subject?: string, body?: string) => {
  let mailtoLink = `mailto:${email}`
  const params = new URLSearchParams()
  
  if (subject) params.append('subject', subject)
  if (body) params.append('body', body)
  
  if (params.toString()) {
    mailtoLink += `?${params.toString()}`
  }
  
  window.open(mailtoLink, '_blank')
}

export const downloadResume = async () => {
  try {
    // Get resume URL from personal info
    const personalInfo = await api.getPersonalInfo()
    
    const safeResumeUrl = normalizeExternalUrl(personalInfo.resume_url)
    if (safeResumeUrl) {
      window.open(safeResumeUrl, '_blank', 'noopener,noreferrer')
      
      // Track analytics
      api.trackEvent('resume_download', { 
        source: 'dynamic', 
        filename: `${personalInfo.name}_Resume.pdf` 
      })
      return
    }
  } catch (error) {
    console.error('Error fetching resume:', error)
  }
  
  // Fallback: Try static resume from public folder
  const link = document.createElement('a')
  link.href = '/resume/Ganpat_Singh_Resume.pdf'
  link.download = 'Ganpat_Singh_Resume.pdf'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Track fallback
  api.trackEvent('resume_download', { source: 'static' })
}

export const openProjectDemo = (demoUrl: string) => {
  const safeDemoUrl = normalizeExternalUrl(demoUrl)
  if (!safeDemoUrl) {
    toast.info('Demo Coming Soon', 'This project is still in development.')
    return
  }
  window.open(safeDemoUrl, '_blank', 'noopener,noreferrer')
}

export const openProjectCode = (githubUrl: string) => {
  const safeGithubUrl = normalizeExternalUrl(githubUrl)
  if (!safeGithubUrl) {
    toast.info('Source Code Coming Soon', 'Source code will be available soon!')
    return
  }
  window.open(safeGithubUrl, '_blank', 'noopener,noreferrer')
}

export const openSocialLink = (url: string) => {
  const safeUrl = normalizeExternalUrl(url)
  if (!safeUrl) return
  window.open(safeUrl, '_blank', 'noopener,noreferrer')
}


// Contact form submission
export const submitContactForm = async (formData: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  try {
    // Submit to backend API using centralized api client
    const result = await api.submitContact(formData)
    
    // Track analytics
    void api.trackEvent('contact_form', { subject: formData.subject })

    return {
      success: true,
      message: result.message || 'Message sent successfully!',
      emailSent: result.email_sent !== false,
    }
  } catch (error) {
    console.warn('Form submission failed:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      emailSent: false,
    }
  }
}
