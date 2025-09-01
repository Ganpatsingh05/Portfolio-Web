'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaRobot } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-9xl mb-8 text-purple-600 dark:text-purple-400 flex justify-center"
        >
          <FaRobot />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-4"
        >
          404
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto"
        >
          Oops! The page you're looking for seems to have vanished into the digital void.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-4"
        >
          <Link
            href="/"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Return Home
          </Link>
          
          <p className="text-gray-500 dark:text-gray-400">
            Or explore my portfolio sections below
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {['About', 'Projects', 'Experience', 'Skills', 'Contact'].map((section) => (
              <Link
                key={section}
                href={`/#${section.toLowerCase()}`}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                {section}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
