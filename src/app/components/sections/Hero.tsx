'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedin, FaComments, FaTwitter, FaInstagram, FaGlobe, FaEnvelope } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import AdvancedTyping from '../animations/AdvancedTyping'
import LottieAnimation from '../animations/LottieAnimation'
import WebGLErrorBoundary from '../error/WebGLErrorBoundary'
import { scrollToSection, openSocialLink } from '../../utils/actions'
import { useHero } from '@/lib/hooks'

// Dynamic imports to prevent SSR issues with 3D components
const FloatingShape = dynamic(() => import('../3d/FloatingShape'), { ssr: false })

export default function Hero() {
  const { data: heroData, isLoading } = useHero()

  // Helper functions
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, any> = {
      github: FaGithub,
      linkedin: FaLinkedin,
      twitter: FaTwitter,
      email: FaEnvelope,
      instagram: FaInstagram,
      website: FaGlobe,
    };
    return icons[platform] || FaGlobe;
  };

  const formatSocialUrl = (platform: string, value: string) => {
    if (!value) return '';
    
    if (platform === 'email') {
      return value.startsWith('mailto:') ? value : `mailto:${value}`;
    }
    
    return value.startsWith('http') ? value : `https://${value}`;
  };

  // Name parts for animation
  const nameParts = heroData?.name?.split(' ') || ['Ganpat', 'Singh'];
  const firstName = nameParts[0] || 'Ganpat';
  const lastName = nameParts.slice(1).join(' ') || 'Singh';

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-20">
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Name Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3"
            >
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-2"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  👋
                </motion.div>
                <span className="text-xl md:text-2xl text-orange-600 dark:text-orange-400 font-medium">
                  Hello, I'm
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {firstName}
                </motion.span>
                {lastName && (
                  <>
                    <br />
                    <motion.span
                      className="inline-block bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {lastName}
                    </motion.span>
                  </>
                )}
              </motion.h1>
            </motion.div>

            {/* Typing Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-20 flex items-center justify-center lg:justify-start"
            >
              <AdvancedTyping 
                texts={heroData?.typing_texts || ['Full Stack Developer']}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400" 
              />
            </motion.div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {heroData?.quote || 'Creating amazing digital experiences'}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() => scrollToSection('projects')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View My Work
              </motion.button>
              
              <motion.button
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <FaComments className="text-lg" /> Let's Connect
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex justify-center lg:justify-start space-x-6"
            >
              {Object.entries(heroData?.social_links || {})
                .filter(([_, url]) => typeof url === 'string' && url.trim())
                .map(([platform, url], index) => {
                  const IconComponent = getSocialIcon(platform);
                  const finalUrl = formatSocialUrl(platform, url as string);
                  
                  return (
                    <motion.button
                      key={platform}
                      onClick={() => openSocialLink(finalUrl)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-2xl text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300"
                      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                      <IconComponent />
                    </motion.button>
                  );
                })}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="hidden lg:block">
              <WebGLErrorBoundary
                fallback={
                  <div className="w-full h-96 flex items-center justify-center">
                    <LottieAnimation 
                      fallbackAnimation="rocket"
                      className="w-80 h-80"
                    />
                  </div>
                }
              >
                <FloatingShape className="w-full h-96" />
              </WebGLErrorBoundary>
            </div>
            
            <div className="lg:hidden flex justify-center">
              <LottieAnimation 
                fallbackAnimation="rocket"
                className="w-80 h-80"
              />
            </div>
          </motion.div>
        </div>

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl"
        />
      </div>
    </section>
  )
}
