'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaGithub, FaExternalLinkAlt, FaEye, FaStar, FaCode, FaRocket } from 'react-icons/fa'
import { BiGitBranch } from 'react-icons/bi'
import LottieAnimation from '../animations/LottieAnimation'

interface Project {
  id: number
  title: string
  description: string
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
  lottieAnimation: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with modern UI/UX and secure payment integration.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    category: "Web Dev",
    github: "#",
    demo: "#",
    status: "completed",
    stats: { stars: 45, forks: 12, commits: 127 },
    lottieAnimation: "coding"
  },
  {
    id: 2,
    title: "AI Chatbot",
    description: "Intelligent chatbot powered by natural language processing and machine learning.",
    technologies: ["Python", "TensorFlow", "Flask", "NLP"],
    category: "AI",
    github: "#",
    demo: "#",
    status: "completed",
    stats: { stars: 78, forks: 23, commits: 89 },
    lottieAnimation: "ai"
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    description: "Interactive dashboard for visualizing complex datasets with real-time updates.",
    technologies: ["Python", "Pandas", "Plotly", "Streamlit"],
    category: "Data Science",
    github: "#",
    demo: "#",
    status: "in-progress",
    stats: { stars: 34, forks: 8, commits: 76 },
    lottieAnimation: "data"
  },
  {
    id: 4,
    title: "ML Recommendation System",
    description: "ML-powered recommendation engine for personalized content delivery.",
    technologies: ["Python", "Scikit-learn", "FastAPI", "Docker"],
    category: "ML",
    github: "#",
    demo: "#",
    status: "completed",
    stats: { stars: 56, forks: 15, commits: 103 },
    lottieAnimation: "rocket"
  }
]

export default function MobileProjects() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const categories = ['All', 'Web Dev', 'Data Science', 'AI', 'ML']

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" id="projects">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-full mb-4"
          >
            <FaRocket className="text-orange-600 dark:text-orange-400 text-sm" />
            <span className="text-orange-800 dark:text-orange-200 font-semibold text-sm">Projects</span>
          </motion.div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            My Work
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Innovative projects spanning web development, AI, and data science.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                  : 'bg-white/30 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects List */}
        <div className="space-y-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/20 dark:border-gray-700/20"
            >
              {/* Header with Animation */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LottieAnimation 
                      fallbackAnimation={project.lottieAnimation}
                      className="w-12 h-12"
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg">{project.title}</h3>
                      <span className="text-blue-100 text-sm">{project.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Stats */}
                <div className="flex justify-between items-center mb-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {project.stats.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <BiGitBranch />
                    {project.stats.forks}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCode />
                    {project.stats.commits}
                  </span>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.a
                    href={project.github}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white py-2 rounded-xl text-sm font-medium"
                  >
                    <FaGithub />
                    <span>Code</span>
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-2 rounded-xl text-sm font-medium"
                  >
                    <FaExternalLinkAlt />
                    <span>Demo</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Like what you see?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Let's collaborate on your next project!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-full font-semibold text-sm"
            >
              Get In Touch
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
