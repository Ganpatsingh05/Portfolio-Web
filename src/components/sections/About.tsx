'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FaRocket, FaTools, FaRobot, FaCloud, FaDownload, FaComments, FaClock } from 'react-icons/fa'
import { BsLightning, BsEmojiSmile } from 'react-icons/bs'
import { SiReact, SiNodedotjs } from 'react-icons/si'
import { BiTargetLock } from 'react-icons/bi'

// Dynamic import for Lottie animation
const LottieAnimation = dynamic(() => import('../animations/LottieAnimation'), { ssr: false })

export default function About() {
  const stats = [
    { number: "3+", label: "Years Experience", icon: FaClock },
    { number: "50+", label: "Projects Completed", icon: FaRocket },
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

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden" id="about">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-900/10 dark:to-amber-900/10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Passionate developer crafting digital solutions that make a difference
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
            data-aos="fade-right"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Hi! I'm Ganpat Singh
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm a passionate Full Stack Developer with a strong focus on creating innovative 
                digital experiences. My journey in technology started with curiosity and has 
                evolved into a mission to solve real-world problems through code.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-3">
                <BiTargetLock className="text-orange-500 mt-1 flex-shrink-0 text-lg" />
                I specialize in modern web technologies and AI integration, constantly exploring 
                new ways to enhance user experiences and business processes.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-3">
                <FaRocket className="text-orange-500 mt-1 flex-shrink-0 text-lg" />
                When I'm not coding, you'll find me learning about emerging technologies, 
                contributing to open-source projects, or sharing knowledge with the developer community.
              </p>
            </motion.div>

            {/* Call-to-action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(234, 88, 12, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <FaDownload /> Download Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "#ea580c" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border-2 border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 rounded-full font-semibold hover:bg-orange-600 hover:text-white dark:hover:bg-orange-400 dark:hover:text-gray-900 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <FaComments /> Let's Talk
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center"
            data-aos="fade-left"
          >
            <div className="relative">
              <LottieAnimation 
                fallbackAnimation="coding"
                className="w-96 h-96"
              />
              
              {/* Floating skill badges */}
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
                className="absolute top-10 -left-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1"
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
                className="absolute top-1/2 -right-5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1"
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
                className="absolute bottom-20 -left-8 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1"
              >
                AI/ML <FaRobot className="text-purple-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          data-aos="fade-up"
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
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 rounded-xl shadow-lg border border-orange-100 dark:border-orange-800/30"
              >
                <div className="text-3xl mb-2 text-orange-600 dark:text-orange-400">
                  <IconComponent />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          data-aos="fade-up"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What I Do Best
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {highlights.map((highlight, index) => {
              const IconComponent = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 20px 40px rgba(234, 88, 12, 0.15)"
                  }}
                  className="p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-800/30 hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-300"
                >
                  <div className="text-4xl mb-4 text-orange-600 dark:text-orange-400">
                    <IconComponent />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {highlight.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {highlight.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {highlight.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: techIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </motion.span>
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
