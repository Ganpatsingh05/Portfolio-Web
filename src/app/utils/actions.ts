import { api } from '@/lib/api'

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
    alert('Demo coming soon! This project is still in development.')
    return
  }
  window.open(demoUrl, '_blank')
}

export const openProjectCode = (githubUrl: string) => {
  if (githubUrl === '#' || !githubUrl) {
    alert('Source code will be available soon!')
    return
  }
  window.open(githubUrl, '_blank')
}

export const openSocialLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export const showComingSoon = (feature: string) => {
  alert(`${feature} feature is coming soon! Stay tuned for updates.`)
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

export const sharePortfolio = async () => {
  const url = window.location.href
  const title = 'Check out Ganpat Singh\'s Portfolio'
  const text = 'Amazing web developer and AI enthusiast!'
  
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
    } catch (err) {
      // Fallback to copying URL
      const copied = await copyToClipboard(url)
      if (copied) {
        alert('Portfolio URL copied to clipboard!')
      }
    }
  } else {
    // Fallback to copying URL
    const copied = await copyToClipboard(url)
    if (copied) {
      alert('Portfolio URL copied to clipboard!')
    }
  }
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
    api.trackEvent('contact_form', { subject: formData.subject })

    return { success: true, message: result.message || 'Message sent successfully!' }
  } catch (error) {
    console.error('Form submission error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send message. Please try again.' 
    }
  }
}

// Project URLs - Updated with actual project URLs
export const projectUrls = {
  ecommerce: {
    demo: 'https://ecommerce-demo-ganpat.vercel.app',
    github: 'https://github.com/Ganpatsingh05/ecommerce-platform'
  },
  aiChatbot: {
    demo: 'https://ai-chatbot-ganpat.vercel.app',
    github: 'https://github.com/Ganpatsingh05/ai-chatbot'
  },
  dataAnalytics: {
    demo: 'https://analytics-dashboard-ganpat.vercel.app',
    github: 'https://github.com/Ganpatsingh05/data-analytics-dashboard'
  },
  mlRecommendation: {
    demo: 'https://recommendation-system-ganpat.vercel.app',
    github: 'https://github.com/Ganpatsingh05/ml-recommendation-system'
  },
  iotDashboard: {
    demo: 'https://iot-dashboard-ganpat.vercel.app',
    github: 'https://github.com/Ganpatsingh05/smart-iot-dashboard'
  },
  computerVision: {
    demo: 'https://computer-vision-ganpat.vercel.app',
    github: 'https://github.com/Ganpatsingh05/computer-vision-app'
  }
}
