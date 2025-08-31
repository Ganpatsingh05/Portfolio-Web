'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { FaGithub, FaExternalLinkAlt, FaEye, FaStar, FaCode, FaRocket } from 'react-icons/fa'
import { BiGitBranch } from 'react-icons/bi'
import LottieAnimation from '../animations/LottieAnimation'

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  technologies: string[]
  category: 'Web Dev' | 'Data Science' | 'AI' | 'ML'
  github: string
  demo: string
  status: 'completed' | 'in-progress' | 'planning'
  stats: {
    stars: number
    forks: number
    commits: number
  }
  features: string[]
  lottieAnimation: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with modern UI/UX and secure payment integration.",
    longDescription: "A comprehensive e-commerce platform built with React and Node.js, featuring user authentication, product catalog, shopping cart, payment integration with Stripe, order management, and admin dashboard. Includes responsive design and real-time updates.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Socket.io"],
    category: "Web Dev",
    github: "#",
    demo: "#",
    status: "completed",
    stats: { stars: 45, forks: 12, commits: 127 },
    features: ["User Authentication", "Payment Integration", "Real-time Updates", "Admin Dashboard", "Responsive Design"],
    lottieAnimation: "coding"
  },
  {
    id: 2,
    title: "AI Chatbot",
    description: "Intelligent chatbot powered by natural language processing and machine learning.",
    longDescription: "An advanced AI chatbot using cutting-edge NLP techniques and machine learning algorithms. Features context-aware conversations, sentiment analysis, multi-language support, and integration with various platforms.",
    technologies: ["Python", "TensorFlow", "Flask", "NLP", "OpenAI"],
    category: "AI",
    github: "#",
    demo: "#",
    status: "completed",
    stats: { stars: 78, forks: 23, commits: 89 },
    features: ["Natural Language Processing", "Context Awareness", "Multi-language Support", "Sentiment Analysis", "API Integration"],
    lottieAnimation: "ai"
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    description: "Interactive dashboard for visualizing complex datasets with real-time updates.",
    longDescription: "A powerful data analytics dashboard that transforms complex datasets into meaningful insights. Features interactive charts, real-time data processing, custom filters, exportable reports, and collaborative sharing capabilities.",
    technologies: ["Python", "Pandas", "Plotly", "Streamlit", "PostgreSQL"],
    category: "Data Science",
    github: "#",
    demo: "#",
    status: "in-progress",
    stats: { stars: 34, forks: 8, commits: 76 },
    features: ["Interactive Visualizations", "Real-time Processing", "Custom Filters", "Export Reports", "Collaborative Sharing"],
    lottieAnimation: "data"
  },
  {
    id: 4,
    title: "ML Recommendation System",
    description: "ML-powered recommendation engine for personalized content delivery.",
    longDescription: "A sophisticated machine learning recommendation system that analyzes user behavior and preferences to deliver personalized content recommendations. Uses collaborative filtering, content-based filtering, and hybrid approaches.",
    technologies: ["Python", "Scikit-learn", "FastAPI", "Docker", "Redis"],
    category: "ML",
    github: "#",
    demo: "#",
    status: "completed",
    stats: { stars: 56, forks: 15, commits: 103 },
    features: ["Collaborative Filtering", "Content-based Filtering", "Hybrid Approach", "Real-time Recommendations", "Scalable Architecture"],
    lottieAnimation: "rocket"
  },
  {
    id: 5,
    title: "Smart IoT Dashboard",
    description: "IoT device management platform with real-time monitoring and control.",
    longDescription: "A comprehensive IoT platform for managing and monitoring smart devices. Features real-time data visualization, device control, automated alerts, energy optimization, and predictive maintenance capabilities.",
    technologies: ["React", "Node.js", "MQTT", "InfluxDB", "Grafana"],
    category: "Web Dev",
    github: "#",
    demo: "#",
    status: "in-progress",
    stats: { stars: 29, forks: 7, commits: 64 },
    features: ["Real-time Monitoring", "Device Control", "Automated Alerts", "Energy Optimization", "Predictive Maintenance"],
    lottieAnimation: "coding"
  },
  {
    id: 6,
    title: "Computer Vision App",
    description: "Advanced computer vision application for object detection and classification.",
    longDescription: "A cutting-edge computer vision application using deep learning for real-time object detection, classification, and tracking. Supports multiple object types, batch processing, and custom model training.",
    technologies: ["Python", "OpenCV", "TensorFlow", "YOLO", "FastAPI"],
    category: "AI",
    github: "#",
    demo: "#",
    status: "planning",
    stats: { stars: 12, forks: 3, commits: 28 },
    features: ["Object Detection", "Real-time Processing", "Custom Models", "Batch Processing", "API Integration"],
    lottieAnimation: "ai"
  }
]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const categories = ['All', 'Web Dev', 'Data Science', 'AI', 'ML']

  // Fixed filtering logic with proper memoization
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') {
      return projects
    }
    
    const filtered = projects.filter(project => {
      return project.category === activeCategory
    })
    
    return filtered
  }, [activeCategory])

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
    <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden" id="projects">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-orange-100 dark:bg-orange-900 px-6 py-2 rounded-full mb-6"
          >
            <FaRocket className="text-orange-600 dark:text-orange-400" />
            <span className="text-orange-800 dark:text-orange-200 font-semibold">Featured Projects</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6">
            My Digital Creations
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore my portfolio of innovative projects spanning web development, AI, data science, and machine learning.
            Each project represents a unique challenge solved with creativity and technical expertise.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white/20 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30 border border-gray-200/20 dark:border-gray-700/20'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={`project-${project.id}-${activeCategory}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/20 dark:border-gray-700/20"
              >
              {/* Project Animation */}
              <div className="h-48 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 dark:from-orange-600 dark:via-amber-600 dark:to-yellow-700 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <LottieAnimation 
                    fallbackAnimation={project.lottieAnimation}
                    className="w-32 h-32 opacity-90"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg group-hover:scale-105 transition-transform duration-300">
                    {project.title}
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full font-semibold">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      {project.stats.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <BiGitBranch />
                      {project.stats.forks}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.a
                    href={project.github}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    <FaGithub />
                    <span>Code</span>
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all font-medium"
                  >
                    <FaExternalLinkAlt />
                    <span>Demo</span>
                  </motion.a>
                </div>

                {/* View Details Button */}
                <motion.button
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <FaEye />
                  <span>View Details</span>
                </motion.button>
              </div>
            </motion.div>
          ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No projects found for "{activeCategory}" category.
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/20 dark:border-gray-700/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interested in Collaboration?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm always excited to work on new projects and collaborate with fellow developers and innovators.
            </p>
            <motion.button
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
                fallbackAnimation={project.lottieAnimation}
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
              <div className="font-bold text-lg">{project.stats.stars}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <BiGitBranch className="mx-auto mb-2" />
              <div className="font-bold text-lg">{project.stats.forks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forks</div>
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <FaCode className="mx-auto mb-2" />
              <div className="font-bold text-lg">{project.stats.commits}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Commits</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">About This Project</h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.longDescription}</p>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-lg font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Key Features</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.a
              href={project.github}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <FaGithub />
              <span>View Source Code</span>
            </motion.a>
            <motion.a
              href={project.demo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all font-medium"
            >
              <FaExternalLinkAlt />
              <span>Live Demo</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
