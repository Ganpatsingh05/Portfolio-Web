'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaHeart, 
  FaCode, 
  FaRocket,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { openSocialLink, scrollToSection, openEmail } from '../../utils/actions'
import { api } from '@/lib/api'

interface PersonalInfo {
  name?: string
  title?: string
  email?: string
  location?: string
  bio?: string
  footer_bio?: string
  github_url?: string
  linkedin_url?: string
  leetcode_url?: string
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({})

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-10 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Background Elements - Simplified for mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand & Description */}
          <div className="sm:col-span-2">
            <motion.div 
              className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 group"
              whileTap={{ scale: 0.98 }}
            >
              <motion.div className="relative">
                <img 
                  src="/gslogo.png" 
                  alt="GS Logo"
                  className="h-12 sm:h-14 lg:h-16 w-auto"
                />
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 bg-orange-400/30 rounded-full blur-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    opacity: 1, 
                    scale: 1.3,
                    rotate: 360
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              <div>
                <motion.h3 
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                  whileHover={{ 
                    x: 5,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {personalInfo.name || 'Ganpat Singh'}
                </motion.h3>
                <p className="text-orange-300 font-medium">{personalInfo.title || 'Full Stack Developer'}</p>
              </div>
            </motion.div>
            
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed max-w-md">
              {personalInfo.footer_bio || 'Passionate about creating innovative web solutions and exploring the latest in AI and modern web technologies.'}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              {[
                { icon: SiLeetcode, href: personalInfo.leetcode_url, color: "active:text-orange-400" },
                { icon: FaLinkedin, href: personalInfo.linkedin_url, color: "active:text-blue-600" },
                { icon: FaGithub, href: personalInfo.github_url, color: "active:text-gray-400" }
              ].filter(social => social.href).map((social, index) => (
                <motion.button
                  key={index}
                  onClick={() => openSocialLink(social.href!)}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center ${social.color} transition-all duration-200 border border-orange-500/20 touch-manipulation`}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <button 
                onClick={() => openEmail(personalInfo.email || 'ganpatsingh.tech@gmail.com')}
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300 active:text-orange-300 transition-colors cursor-pointer touch-manipulation"
              >
                <FaEnvelope className="text-orange-500 flex-shrink-0" />
                <span className="truncate">{personalInfo.email || 'ganpatsingh.tech@gmail.com'}</span>
              </button>
              <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
                <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                <span>{personalInfo.location || 'Available Worldwide'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-orange-300">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Experience", href: "#experience" },
                { name: "Skills", href: "#skills" },
                { name: "Contact", href: "#contact" }
              ].map((link) => (
                <li key={link.name}>
                  <motion.button 
                    onClick={() => scrollToSection(link.href)}
                    whileTap={{ x: 3 }}
                    className="text-sm sm:text-base text-gray-300 active:text-orange-300 transition-all duration-200 flex items-center gap-2 group touch-manipulation py-1"
                  >
                    <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Tech */}
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-orange-300">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Web Development",
                "UI/UX Design", 
                "API Development",
                "Database Design",
                "DevOps Solutions"
              ].map((service) => (
                <li key={service}>
                  <div className="text-sm sm:text-base text-gray-300 flex items-center gap-2 group py-1">
                    <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                    {service}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-6 sm:my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-gray-300 text-xs sm:text-sm">
            <span>© {currentYear} {personalInfo.name || 'Ganpat Singh'}.</span>
            <span className="flex items-center gap-1.5">
              Made with
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FaHeart className="text-red-500" />
              </motion.div>
            </span>
            <span className="hidden sm:inline">using Next.js & TailwindCSS</span>
          </div>
          
          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl active:shadow-md transition-all duration-200 flex items-center gap-2 touch-manipulation"
          >
            <FaArrowUp className="text-sm sm:text-base" />
            <span className="hidden sm:inline text-sm">Back to Top</span>
          </motion.button>
        </div>

        {/* Tech Stack Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-6 sm:mt-8"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-orange-500/20">
            <FaRocket className="text-orange-500 text-sm sm:text-base" />
            <span className="text-gray-300 text-xs sm:text-sm">Built for the future of web</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
