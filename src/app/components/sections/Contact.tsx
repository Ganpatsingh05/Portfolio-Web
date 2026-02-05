'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGithub, 
  FaDownload,
  FaPaperPlane,
  FaUser,
  FaTag,
  FaComment,
  FaRocket,
  FaHeart,
  FaCode,
  FaCoffee
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { submitContactForm, downloadResume, openSocialLink, openEmail } from '../../utils/actions'
import { api, fallbackData } from '@/lib/api'

interface PersonalInfo {
  email?: string
  location?: string
  github_url?: string
  linkedin_url?: string
  leetcode_url?: string
  resume_url?: string
}

export default function Contact() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailValid, setEmailValid] = useState(false)

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await api.getPersonalInfo()
        setPersonalInfo(data)
      } catch (err) {
        console.error('Error fetching personal info:', err)
      }
    }
    fetchPersonalInfo()
  }, [])

  // List of common disposable/temporary email domains to block
  const disposableEmailDomains = [
    '10minutemail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'getnada.com', 'maildrop.cc', 'yopmail.com', 'mohmal.com', 'sharklasers.com',
    'bugmenot.com', 'dispostable.com', 'spamgourmet.com', 'mintemail.com'
  ]

  const validateEmail = (email: string) => {
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      setEmailValid(false)
      return false
    }

    // Advanced format check (more strict)
    const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!strictEmailRegex.test(email)) {
      setEmailError('Email format appears invalid')
      setEmailValid(false)
      return false
    }

    // Check for disposable email domains
    const domain = email.split('@')[1]?.toLowerCase()
    if (domain && disposableEmailDomains.includes(domain)) {
      setEmailError('Disposable email addresses are not allowed')
      setEmailValid(false)
      return false
    }

    // Check for suspicious patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      setEmailError('Email format appears invalid')
      setEmailValid(false)
      return false
    }

    setEmailError('')
    setEmailValid(true)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await submitContactForm(formData)
      
      if (result.success) {
        alert(result.message)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Failed to send message. Please try again or contact me directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time email validation
    if (name === 'email' && value) {
      validateEmail(value)
    } else if (name === 'email' && !value) {
      setEmailError('')
      setEmailValid(false)
    }
  }

  return (
    <section
      className="py-14 sm:py-16 md:py-20 relative overflow-hidden overflow-x-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-orange-900/20 dark:to-gray-900 text-gray-900 dark:text-white"
      id="contact"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>
      
  <div className="max-w-7xl mx-auto px-4 relative overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-block mb-4 sm:mb-6"
          >
            <FaRocket className="text-4xl sm:text-5xl lg:text-6xl text-orange-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6 leading-normal pb-2">
            Let's Work Together
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 dark:text-white max-w-3xl mx-auto leading-relaxed px-2">
            Ready to bring your ideas to life? Let's collaborate and create something amazing together!
          </p>
          
          {/* Fun Stats - Scrollable on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-5 sm:mt-6 lg:mt-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 dark:text-orange-300 whitespace-nowrap flex-shrink-0">
              <FaCoffee className="text-lg sm:text-xl" />
              <span className="font-semibold text-xs sm:text-sm md:text-base">100+ Cups of Coffee</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 dark:text-orange-300 whitespace-nowrap flex-shrink-0">
              <FaCode className="text-lg sm:text-xl" />
              <span className="font-semibold text-xs sm:text-sm md:text-base">15+ Projects Completed</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 dark:text-orange-300 whitespace-nowrap flex-shrink-0">
              <FaHeart className="text-lg sm:text-xl" />
              <span className="font-semibold text-xs sm:text-sm md:text-base">Made with Passion</span>
            </div>
          </motion.div>
        </motion.div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border backdrop-blur-sm bg-white/90 dark:bg-white/5 border-orange-200 dark:border-orange-500/20"
          >
            <div className="text-center mb-5 sm:mb-6 lg:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Send a Message</h3>
              <p className="text-gray-800 dark:text-white text-xs sm:text-sm md:text-base">I'll get back to you within 24 hours!</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div className="group">
                  <label htmlFor="name" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-orange-700 dark:text-orange-300">
                    <FaUser className="text-orange-600 dark:text-orange-500" />
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-orange-700 dark:text-orange-300">
                    <FaEnvelope className="text-orange-600 dark:text-orange-500" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 rounded-lg focus:ring-2 transition-all duration-200 bg-white dark:bg-gray-800/50 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base ${
                        emailError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 
                        emailValid ? 'border-green-500 focus:ring-green-500 focus:border-green-500' :
                        'border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {formData.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailValid && (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {emailError && (
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {emailError && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {emailError}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="subject" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-orange-700 dark:text-orange-300">
                  <FaTag className="text-orange-600 dark:text-orange-500" />
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                  placeholder="What's your project about?"
                />
              </div>
              
              <div className="group">
                <label htmlFor="message" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-orange-700 dark:text-orange-300">
                  <FaComment className="text-orange-600 dark:text-orange-500" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all duration-200 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                  placeholder="Tell me about your project idea..."
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="w-full text-white py-2.5 sm:py-3 lg:py-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:shadow-md touch-manipulation text-sm sm:text-base"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm sm:text-base" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border backdrop-blur-sm bg-white/90 dark:bg-white/5 border-orange-200 dark:border-orange-500/20">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-900 dark:text-gray-900 drop-shadow-sm">Get In Touch</h3>
              <p className="text-gray-800 dark:text-gray-800 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-xs sm:text-sm lg:text-base drop-shadow-sm">
                I'm always excited to work on new projects and collaborate with amazing people. 
                Let's connect and make something incredible together!
              </p>

              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 sm:space-x-4 group cursor-pointer touch-manipulation p-2 -m-2 rounded-lg active:bg-orange-50 dark:active:bg-orange-900/20"
                  onClick={() => openEmail(personalInfo.email || 'ganpatsingh.tech@gmail.com')}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-orange-700 dark:text-orange-800 text-xs sm:text-sm lg:text-base drop-shadow-sm">Email</h4>
                    <p className="text-gray-800 dark:text-gray-900 text-xs sm:text-sm lg:text-base drop-shadow-sm truncate">{personalInfo.email || 'ganpatsingh.tech@gmail.com'}</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                    <FaMapMarkerAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-800 group-hover:text-orange-600 dark:group-hover:text-orange-700 transition-colors text-sm sm:text-base drop-shadow-sm">Location</h4>
                    <p className="text-gray-800 dark:text-gray-900 group-hover:text-gray-900 dark:group-hover:text-black transition-colors text-sm sm:text-base drop-shadow-sm">{personalInfo.location || 'Available Worldwide (Remote)'}</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4 sm:mb-6 text-orange-700 dark:text-orange-800 text-base sm:text-lg drop-shadow-sm">Connect With Me</h4>
                <div className="flex space-x-3 sm:space-x-4">
                  {personalInfo.leetcode_url && (
                    <motion.button
                      onClick={() => openSocialLink(personalInfo.leetcode_url!)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white"
                    >
                      <SiLeetcode className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  )}
                  {personalInfo.linkedin_url && (
                    <motion.button
                      onClick={() => openSocialLink(personalInfo.linkedin_url!)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white"
                    >
                      <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  )}
                  {personalInfo.github_url && (
                    <motion.button
                      onClick={() => openSocialLink(personalInfo.github_url!)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white"
                    >
                      <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Resume Download */}
        <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 sm:mt-8"
              >
                <button
                  onClick={downloadResume}
          className="inline-flex items-center space-x-3 bg-white text-gray-900 px-5 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                >
                  <FaDownload className="w-5 h-5" />
                  <span>Download Resume</span>
                </button>
              </motion.div>
            </div>

            {/* Quick Response Promise */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="backdrop-blur-sm rounded-2xl p-5 sm:p-6 border text-center bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-500/20 dark:to-amber-500/20 border-orange-200 dark:border-orange-400/30 text-gray-900 dark:text-white"
            >
              <FaRocket className="text-2xl sm:text-3xl text-orange-500 dark:text-orange-400 mx-auto mb-2 sm:mb-3" />
              <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Quick Response Guaranteed</h4>
              <p className="text-gray-800 dark:text-white text-sm sm:text-base">I typically respond within 4-6 hours during business days!</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
