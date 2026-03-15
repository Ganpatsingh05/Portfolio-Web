import { api } from '@/lib/api'
import { toast } from '@/app/admin/components/Toast'

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
    
    if (personalInfo.resume_url) {
      window.open(personalInfo.resume_url, '_blank')
      
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
  if (demoUrl === '#' || !demoUrl) {
    toast.info('Demo Coming Soon', 'This project is still in development.')
    return
  }
  window.open(demoUrl, '_blank')
}

export const openProjectCode = (githubUrl: string) => {
  if (githubUrl === '#' || !githubUrl) {
    toast.info('Source Code Coming Soon', 'Source code will be available soon!')
    return
  }
  window.open(githubUrl, '_blank')
}

export const openSocialLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
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

    return { success: true, message: result.message || 'Message sent successfully!' }
  } catch (error) {
    console.warn('Form submission failed:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send message. Please try again.' 
    }
  }
}
