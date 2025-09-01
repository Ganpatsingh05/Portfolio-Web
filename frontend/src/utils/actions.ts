// Utility functions for button actions

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId.replace('#', ''))
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

export const openEmail = (email: string = 'ganpatsingh.dev@gmail.com', subject?: string, body?: string) => {
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
    // First, try to get the dynamic resume URL from personal info
    const response = await fetch('/api/personal-info')
    if (response.ok) {
      const result = await response.json()
      const personalInfo = result.data || result
      
      if (personalInfo.resume_url) {
        // Use dynamic resume URL from database
        const link = document.createElement('a')
        link.href = personalInfo.resume_url
        link.download = `${personalInfo.name || 'Ganpat_Singh'}_Resume.pdf`
        link.target = '_blank'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Track analytics
        try {
          await fetch('/api/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event_type: 'resume_download',
              event_data: { source: 'dynamic', filename: `${personalInfo.name || 'Ganpat_Singh'}_Resume.pdf` },
            }),
          })
        } catch (analyticsError) {
          console.error('Analytics tracking failed:', analyticsError)
        }
        
        return
      }
    }
  } catch (error) {
    console.error('Error fetching dynamic resume:', error)
  }
  
  // Fallback to static resume
  const resumeUrl = '/resume/Ganpat_Singh_Resume.pdf'
  
  const link = document.createElement('a')
  link.href = resumeUrl
  link.download = 'Ganpat_Singh_Resume.pdf'
  link.target = '_blank'
  
  // Fallback: if file doesn't exist, open a placeholder or show message
  link.onerror = () => {
    alert('Resume will be available soon! Please contact me directly for now.')
  }
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Track analytics for fallback
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'resume_download',
        event_data: { source: 'static', filename: 'Ganpat_Singh_Resume.pdf' },
      }),
    })
  } catch (analyticsError) {
    console.error('Analytics tracking failed:', analyticsError)
  }
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
    console.log('Submitting form:', formData)
    
    // Submit to backend API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send message')
    }

    // Track analytics
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'contact_form',
        event_data: { subject: formData.subject },
      }),
    })

    return { success: true, message: 'Message sent successfully!' }
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
