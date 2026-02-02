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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-16 sm:pt-20">
        <div className="animate-pulse space-y-6 px-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-36"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-36"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-16 sm:pt-20 pb-8">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Name Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2 sm:space-y-3"
            >
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center justify-center lg:justify-start gap-2"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-xl sm:text-2xl"
                >
                  👋
                </motion.div>
                <span className="text-lg sm:text-xl md:text-2xl font-medium" style={{ color: 'var(--accent-color)' }}>
                  {heroData?.greeting || "Hello, I'm"}
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                <span className="inline-block">{firstName}</span>
                {lastName && (
                  <>
                    <br />
                    <span
                      className="inline-block bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent"
                    >
                      {lastName}
                    </span>
                  </>
                )}
              </motion.h1>
            </motion.div>

            {/* Typing Animation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-14 sm:h-16 md:h-20 flex items-center justify-center lg:justify-start"
            >
              <AdvancedTyping 
                texts={heroData?.typing_texts || ['Full Stack Developer']}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400" 
              />
            </motion.div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed mx-auto lg:mx-0"
            >
              {heroData?.quote || 'Creating amazing digital experiences'}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() => scrollToSection('projects')}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-full shadow-lg active:shadow-md transition-all duration-200 text-sm sm:text-base touch-manipulation"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                View My Work
              </motion.button>
              
              <motion.button
                onClick={() => scrollToSection('contact')}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:border-[var(--accent-color)] active:border-[var(--accent-color)] transition-all duration-200 flex items-center gap-2 justify-center text-sm sm:text-base touch-manipulation"
              >
                <FaComments className="text-base sm:text-lg" /> Let's Connect
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex justify-center lg:justify-start space-x-4 sm:space-x-6"
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 transition-colors duration-200 active:text-[var(--accent-color)] touch-manipulation p-2 -m-2"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative order-first lg:order-last"
          >
            {/* Show Lottie on mobile/tablet for better performance */}
            <div className="flex justify-center">
              <div className="lg:hidden">
                <LottieAnimation 
                  fallbackAnimation="rocket"
                  className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80"
                />
              </div>
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
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Hidden on mobile for cleaner look */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-400 dark:text-gray-500"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decorative elements - Simplified for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-orange-400/10 sm:from-orange-400/20 to-amber-400/10 sm:to-amber-400/20 rounded-full blur-2xl sm:blur-3xl" />
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-amber-400/10 sm:from-amber-400/20 to-yellow-400/10 sm:to-yellow-400/20 rounded-full blur-2xl sm:blur-3xl" />
      </div>
    </section>
  )
}
