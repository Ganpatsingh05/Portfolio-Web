'use client'

import { motion } from 'framer-motion'
import { FaEnvelope, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import AdvancedTyping from '../animations/AdvancedTyping'
import { openSocialLink, scrollToSection } from '../../utils/actions'
import { useHero } from '@/lib/hooks'

export default function MobileHero() {
  const { data: heroData } = useHero()

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      github: FaGithub,
      linkedin: FaLinkedin,
      twitter: FaTwitter,
      email: FaEnvelope,
      instagram: FaInstagram,
      website: FaGlobe,
      leetcode: SiLeetcode,
    }
    return icons[platform] || FaGlobe
  }

  const formatSocialUrl = (platform: string, value: string) => {
    if (!value) return ''
    if (platform === 'email') return value.startsWith('mailto:') ? value : `mailto:${value}`
    return value.startsWith('http') ? value : `https://${value}`
  }

  const fallbackSocials = {
    github: 'https://github.com/Ganpatsingh05',
    linkedin: 'https://linkedin.com/in/ganpatsingh05',
    leetcode: 'https://leetcode.com/ganpatsingh05',
  }

  const socialLinks = Object.entries(heroData?.social_links || fallbackSocials)
    .filter(([_, url]) => typeof url === 'string' && url.trim())
    .map(([platform, url]) => ({
      href: formatSocialUrl(platform, url as string),
      icon: getSocialIcon(platform),
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }))

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-20 h-20 bg-orange-200/40 dark:bg-orange-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-amber-200/40 dark:bg-amber-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-6 w-16 h-16 bg-yellow-200/40 dark:bg-yellow-500/20 rounded-full blur-lg"
        />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto w-32 h-32 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-2xl p-4 relative group cursor-pointer"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated ring around logo */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-orange-400/30"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-400/20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Logo with interactive effects */}
          <motion.img 
            src="/gslogo.png" 
            alt="GS Logo"
            className="w-full h-full object-contain relative z-10"
            whileHover={{ 
              rotate: 360,
              filter: "brightness(1.2)"
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut" 
            }}
          />
          
          {/* Sparkle effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + (i * 60 / 6)}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-orange-600 dark:text-orange-400 font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {heroData?.greeting || "Hello, I'm"}
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-4xl font-bold text-gray-900 dark:text-white pb-4 overflow-visible relative z-10"
          style={{ lineHeight: '1.3' }}
        >
          {heroData?.name || 'Ganpat Singh'}
        </motion.h1>

        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          <AdvancedTyping texts={heroData?.typing_texts || ['Full Stack Developer']} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto"
        >
          {heroData?.quote || 'I create amazing digital experiences with cutting-edge technology.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col gap-4"
        >
          <motion.button
            onClick={() => scrollToSection('#projects')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-500 dark:to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            View My Work
          </motion.button>
          
          <motion.button
            onClick={() => scrollToSection('#contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 border-2 border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400 rounded-xl font-semibold hover:bg-orange-600 hover:text-white dark:hover:bg-orange-400 dark:hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Let's Chat
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex justify-center space-x-4 pt-4"
        >
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <motion.button
                key={social.label}
                onClick={() => openSocialLink(social.href)}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300"
                aria-label={social.label}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            )
          })}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 dark:text-gray-500"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}