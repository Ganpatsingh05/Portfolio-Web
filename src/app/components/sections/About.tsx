'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { FaRocket, FaTools, FaRobot, FaCloud, FaDownload, FaComments, FaClock } from 'react-icons/fa'
import { BsLightning, BsEmojiSmile } from 'react-icons/bs'
import { BiTargetLock } from 'react-icons/bi'
import { SiReact, SiNodedotjs } from 'react-icons/si'
import { downloadResume, scrollToSection } from '../../utils/actions'
import { api, fallbackData } from '@/lib/api'

const LottieAnimation = dynamic(() => import('../animations/LottieAnimation'), { ssr: false })

interface PersonalInfo {
  id?: string
  name: string
  title: string
  email: string
  location: string
  github_url?: string
  linkedin_url?: string
  leetcode_url?: string
  resume_url?: string
  bio?: string
  journey?: string
  degree?: string
  university?: string
  education_period?: string
}

export default function About() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(fallbackData.personalInfo)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await api.getPersonalInfo()
        setPersonalInfo(data)
      } catch (err) {
        console.error('Error fetching personal info:', err)
        // Keep fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchPersonalInfo()
  }, [])

  const stats = [
    { number: "1", label: "Years Experience", icon: FaClock },
    { number: "15+", label: "Projects Completed", icon: FaRocket },
    { number: "15+", label: "Technologies", icon: BsLightning },
    { number: "100%", label: "Client Satisfaction", icon: BsEmojiSmile }
  ]

  const highlights = [
    { 
      title: "Full Stack Development", 
      description: "Building end-to-end web applications with modern frameworks",
      icon: FaTools,
      tech: ["React", "Node.js", "TypeScript", "Next.js"]
    },
    { 
      title: "AI & Machine Learning", 
      description: "Implementing intelligent solutions and data-driven applications",
      icon: FaRobot,
      tech: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"]
    },
    { 
      title: "Cloud & DevOps", 
      description: "Deploying scalable applications with modern cloud infrastructure",
      icon: FaCloud,
      tech: ["AWS", "Docker", "Kubernetes", "CI/CD"]
    }
  ]

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 relative overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 relative overflow-hidden" id="about">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-900/10 dark:to-amber-900/10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            About Me
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Passionate developer crafting digital solutions that make a difference
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center mb-12 lg:mb-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-5 sm:space-y-6 order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-3 sm:space-y-4"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Hi! I'm {personalInfo.name}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {personalInfo.bio}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3 sm:space-y-4"
            >
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-2 sm:gap-3">
                <BiTargetLock className="text-orange-500 mt-0.5 sm:mt-1 flex-shrink-0 text-base sm:text-lg" />
                {personalInfo.journey}
              </p>
            </motion.div>

            {/* Call-to-action */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
            >
              <motion.button
                onClick={downloadResume}
                whileTap={{ scale: 0.95 }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full font-semibold shadow-lg active:shadow-md transition-all duration-200 flex items-center gap-2 justify-center text-sm sm:text-base touch-manipulation"
              >
                <FaDownload className="text-sm sm:text-base" /> Download Resume
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('contact')}
                whileTap={{ scale: 0.95 }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 rounded-full font-semibold active:bg-orange-600 active:text-white transition-all duration-200 flex items-center gap-2 justify-center text-sm sm:text-base touch-manipulation"
              >
                <FaComments className="text-sm sm:text-base" /> Let's Talk
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center order-1 lg:order-2"
          >
            <div className="relative">
              <LottieAnimation 
                fallbackAnimation="coding"
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
              />
              
              {/* Floating skill badges - Hidden on mobile for cleaner look */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="hidden sm:flex absolute top-10 -left-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg items-center gap-1"
              >
                React <SiReact className="text-blue-500" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="hidden sm:flex absolute top-1/2 -right-5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg items-center gap-1"
              >
                Node.js <SiNodedotjs className="text-green-500" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="hidden sm:flex absolute bottom-20 -left-8 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg items-center gap-1"
              >
                AI/ML <FaRobot className="text-purple-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 lg:mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="text-center p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 rounded-xl shadow-lg border border-orange-100 dark:border-orange-800/30"
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-orange-600 dark:text-orange-400">
                  <IconComponent />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-10 lg:mb-12">
            What I Do Best
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
            {highlights.map((highlight, index) => {
              const IconComponent = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 dark:border-orange-800/30 active:border-orange-200 dark:active:border-orange-700 transition-all duration-200"
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-orange-600 dark:text-orange-400">
                    <IconComponent />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {highlight.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                    {highlight.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {highlight.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
