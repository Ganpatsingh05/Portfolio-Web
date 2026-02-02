'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { FaGithub, FaExternalLinkAlt, FaRocket, FaStar, FaEye, FaCode } from 'react-icons/fa'
import { BiGitBranch } from 'react-icons/bi'
import LottieAnimation from '../animations/LottieAnimation'
import { openProjectDemo, openProjectCode } from '../../utils/actions'
import { useProjects } from '@/lib/hooks'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  category: string
  github_url?: string
  demo_url?: string
  status: 'completed' | 'in-progress' | 'planning'
  featured?: boolean
  image_url?: string
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { data: projects = [], isLoading, error } = useProjects()
  
  const categories = ['All', 'Web Dev', 'Data Science', 'AI', 'ML']

  const getProjectAnimation = (category: string, index: number) => {
    const key = (category || '').toLowerCase()
    if (key.includes('web')) return 'web'
    if (key.includes('data')) return 'data'
    if (key === 'ai' || key === 'ml' || key.includes('ai')) return 'ai'
    const pool = ['rocket', 'mobile', 'coding', 'web'] as const
    return pool[index % pool.length]
  }

  // Fixed filtering logic with proper memoization
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') {
      return projects
    }
    
    const filtered = projects.filter((project: Project) => {
      return project.category === activeCategory
    })
    
    return filtered
  }, [activeCategory, projects])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden" id="projects">
      {/* Background decoration - Simplified for mobile */}
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-96 h-48 sm:h-96 bg-amber-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-orange-100 dark:bg-orange-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6"
          >
            <FaRocket className="text-orange-600 dark:text-orange-400 text-sm sm:text-base" />
            <span className="text-orange-800 dark:text-orange-200 font-semibold text-sm sm:text-base">Featured Projects</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            My Digital Creations
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Explore my portfolio of innovative projects spanning web development, AI, data science, and machine learning.
          </p>
        </motion.div>

        {/* Category Filter - Scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex gap-2 sm:gap-4 mb-10 sm:mb-12 lg:mb-16 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              whileTap={{ scale: 0.95 }}
              className={`px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full font-medium sm:font-semibold transition-all duration-200 backdrop-blur-sm whitespace-nowrap text-sm sm:text-base flex-shrink-0 touch-manipulation ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 active:bg-white/70 dark:active:bg-gray-700/70 border border-gray-200/30 dark:border-gray-700/30'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {isLoading ? (
            // Loading skeleton - Mobile optimized
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl animate-pulse">
                <div className="h-36 sm:h-44 lg:h-48 bg-gray-300 dark:bg-gray-600 rounded-t-xl sm:rounded-t-2xl"></div>
                <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={`project-${project.id}-${activeCategory}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl active:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200/20 dark:border-gray-700/20"
              >
              {/* Project Animation */}
              <div className="h-36 sm:h-44 lg:h-48 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 dark:from-orange-600 dark:via-amber-600 dark:to-yellow-700 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <LottieAnimation 
                    fallbackAnimation={getProjectAnimation(project.category, index)}
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 opacity-90"
                  />
                </div>
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <h3 className="text-white font-bold text-base sm:text-lg">
                    {project.title}
                  </h3>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 lg:p-6">
                {/* Category Badge */}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 text-orange-800 dark:text-orange-200 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <FaStar className="text-yellow-500" />
                      {project.featured ? '★' : '☆'}
                    </span>
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <BiGitBranch />
                      {project.sort_order || 0}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-medium"
                    >
                      {tech}
                    </span>
                  )) || []}
                  {project.technologies && project.technologies.length > 3 && (
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 px-1.5 sm:px-2 py-0.5 sm:py-1">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  <motion.button
                    onClick={() => openProjectCode(project.github_url || '#')}
                    whileTap={{ scale: 0.95 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    <FaGithub className="text-xs sm:text-sm" />
                    <span className="text-xs sm:text-sm">Code</span>
                  </motion.button>
                  <motion.button
                    onClick={() => openProjectDemo(project.demo_url || '#')}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl active:from-orange-700 active:to-amber-700 transition-all font-medium touch-manipulation"
                  >
                    <FaExternalLinkAlt className="text-xs sm:text-sm" />
                    <span className="text-xs sm:text-sm">Demo</span>
                  </motion.button>
                </div>

                {/* View Details Button */}
                <motion.button
                  onClick={() => setSelectedProject(project)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 py-2 sm:py-2.5 rounded-lg sm:rounded-xl active:bg-gray-100 dark:active:bg-gray-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                >
                  <FaEye />
                  <span>View Details</span>
                </motion.button>
              </div>
            </motion.div>
          ))
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12">
              {error ? (
                <div className="text-red-500 dark:text-red-400">
                  <p className="text-base sm:text-lg mb-2">{error}</p>
                  <p className="text-xs sm:text-sm">Showing fallback projects</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                  No projects found for "{activeCategory}" category.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12 lg:mt-16"
        >
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/20 dark:border-gray-700/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interested in Collaboration?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm always excited to work on new projects and collaborate with fellow developers and innovators.
            </p>
            <motion.button
              onClick={() => scrollToSection('contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <FaRocket />
                Let's Build Something Amazing
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  )
}

// Project Detail Modal Component
function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <LottieAnimation 
                fallbackAnimation={(project.category ? ((cat => {
                  const k = cat.toLowerCase()
                  if (k.includes('web')) return 'web'
                  if (k.includes('data')) return 'data'
                  if (k === 'ai' || k === 'ml' || k.includes('ai')) return 'ai'
                  return 'rocket'
                })(project.category)) : 'rocket')}
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <FaStar className="text-yellow-500 mx-auto mb-2" />
              <div className="font-bold text-lg">{project.featured ? 'Featured' : 'Project'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <BiGitBranch className="mx-auto mb-2" />
              <div className="font-bold text-lg">{project.sort_order || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Order</div>
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <FaCode className="mx-auto mb-2" />
              <div className="font-bold text-lg">{project.technologies?.length || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">About This Project</h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.description}</p>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-lg font-medium"
                >
                  {tech}
                </span>
              )) || []}
            </div>
          </div>

          {/* Project Timeline */}
          {(project.start_date || project.end_date) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Project Timeline</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {project.start_date && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Started: {new Date(project.start_date).toLocaleDateString()}</span>
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Completed: {new Date(project.end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={() => openProjectCode(project.github_url || '#')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <FaGithub />
              <span>View Source Code</span>
            </motion.button>
            <motion.button
              onClick={() => openProjectDemo(project.demo_url || '#')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all font-medium"
            >
              <FaExternalLinkAlt />
              <span>Live Demo</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
