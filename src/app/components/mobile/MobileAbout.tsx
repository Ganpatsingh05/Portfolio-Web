'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FaRocket, FaRobot, FaDownload, FaComments, FaClock } from 'react-icons/fa'
import { BsLightning, BsEmojiSmile } from 'react-icons/bs'
import { BiTargetLock } from 'react-icons/bi'
import { SiReact, SiNodedotjs } from 'react-icons/si'
import { HiOutlineHand } from 'react-icons/hi'
import { downloadResume, scrollToSection } from '../../utils/actions'
import { usePersonalInfo } from '@/lib/hooks'

// Dynamic import for Lottie animation
const LottieAnimation = dynamic(() => import('../animations/LottieAnimation'), { ssr: false })

interface PersonalInfo {
  name?: string
  bio?: string
  journey?: string
}

const defaultPersonalInfo: PersonalInfo = {
  name: 'Ganpat Singh',
  bio: "I'm a passionate developer who loves creating innovative solutions and bringing ideas to life through code.",
  journey: "With a strong foundation in computer science and a passion for emerging technologies, I've been developing web applications and exploring AI/ML.",
}

export default function MobileAbout() {
  const { data: personalInfo = defaultPersonalInfo, isLoading: loading } = usePersonalInfo()

  const stats = [
    { number: "1", label: "Years Experience", icon: FaClock },
    { number: "15+", label: "Projects Completed", icon: FaRocket },
    { number: "15+", label: "Technologies", icon: BsLightning },
    { number: "100%", label: "Client Satisfaction", icon: BsEmojiSmile }
  ]

  if (loading) {
    return (
      <section className="py-12 bg-white dark:bg-gray-900 relative overflow-hidden" id="about">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-36 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56 mx-auto"></div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900 relative overflow-hidden" id="about">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-900/10 dark:to-amber-900/10"></div>
      
      <div className="relative z-10 max-w-md mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            About Me
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Passionate developer crafting digital solutions
          </p>
        </motion.div>

        {/* Animation Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <LottieAnimation 
              fallbackAnimation="coding"
              className="w-64 h-64"
            />
            
            {/* Floating skill badges - Mobile positioned */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-8 -left-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1"
            >
              React <SiReact className="text-blue-500 text-sm" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, 8, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-1/2 -right-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1"
            >
              Node.js <SiNodedotjs className="text-green-500 text-sm" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-16 -left-4 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1"
            >
              AI/ML <FaRobot className="text-purple-500 text-sm" />
            </motion.div>
          </div>
        </motion.div>

        {/* Introduction Text - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            Hi! I'm {personalInfo.name || defaultPersonalInfo.name} <HiOutlineHand className="text-yellow-500" />
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
            {personalInfo.bio || defaultPersonalInfo.bio}
          </p>
        </motion.div>

        {/* Key Points - Mobile Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-3 mb-8"
        >
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BiTargetLock className="text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {personalInfo.journey || defaultPersonalInfo.journey}
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FaRocket className="text-blue-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              When I'm not coding, you'll find me learning about emerging technologies 
              and contributing to open-source projects.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons - Mobile Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col gap-3 mb-8"
        >
          <motion.button
            onClick={downloadResume}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-500 dark:to-amber-500 text-white rounded-xl font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <FaDownload /> Download Resume
          </motion.button>
          <motion.button
            onClick={() => scrollToSection('#contact')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 border-2 border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400 rounded-xl font-semibold hover:bg-orange-600 hover:text-white dark:hover:bg-orange-400 dark:hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <FaComments /> Let's Talk
          </motion.button>
        </motion.div>

        {/* Stats Section - Mobile Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="text-center p-4 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 rounded-xl shadow-lg border border-orange-100 dark:border-orange-800/30"
              >
                <div className="text-2xl mb-2 text-orange-600 dark:text-orange-400 flex justify-center">
                  <IconComponent />
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}