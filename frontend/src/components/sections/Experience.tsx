'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { FaRocket, FaCode, FaStar, FaBriefcase, FaGraduationCap } from 'react-icons/fa'

// Dynamic import for Lottie animation
const LottieAnimation = dynamic(() => import('../animations/LottieAnimation'), { ssr: false })

interface ExperienceItem {
  id?: string
  title: string
  company: string
  period: string
  description: string[]
  type: 'experience' | 'education'
  skills?: string[]
  location?: string
  company_url?: string
  sort_order?: number
  is_current?: boolean
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/experiences')
        if (!response.ok) {
          throw new Error('Failed to fetch experiences')
        }
        const result = await response.json()
        // Extract the data array from the response wrapper
        const data = result.data || result || []
        setExperiences(data)
      } catch (err) {
        console.error('Error fetching experiences:', err)
        setError('Failed to load experiences')
        // Fallback to static data
        setExperiences([
          {
            title: "Frontend Developer Intern",
            company: "Tech Innovators Pvt Ltd",
            period: "Jun 2024 - Aug 2024",
            description: [
              "Developed responsive web applications using React and TypeScript",
              "Collaborated with design team to implement pixel-perfect UI components",
              "Optimized application performance resulting in 30% faster load times"
            ],
            skills: ["React", "TypeScript", "CSS", "JavaScript", "Git"],
            type: "experience"
          },
          {
            title: "Bachelor of Computer Science",
            company: "Lovely Professional University, Jalandhar",
            period: "2023 - 2027",
            description: [
              "Relevant Coursework: Data Structures, Algorithms, Machine Learning, Database Systems",
              "Current CGPA: 8.5/10",
              "Member of Computer Science Club and AI Research Group"
            ],
            skills: ["Python", "Java", "Machine Learning", "Data Structures", "Algorithms"],
            type: "education"
          },
          {
            title: "Freelance Web Developer",
            company: "Self-Employed",
            period: "Jan 2023 - Present",
            description: [
              "Built custom websites for small businesses using modern web technologies",
              "Managed full project lifecycle from requirements gathering to deployment",
              "Delivered 8+ projects with 100% client satisfaction rate"
            ],
            skills: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "AWS"],
            type: "experience"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden" id="experience">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading experiences...</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden" id="experience">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-amber-100/30 dark:from-orange-900/10 dark:to-amber-900/10"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header Section with Lottie */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Experience & Education
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              My journey through education and professional experiences that shaped my skills and expertise.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-1">
                  <FaRocket className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">3+</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Learning</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-1">
                  <FaCode className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">10+</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-1">
                  <FaStar className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">100%</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <LottieAnimation 
                fallbackAnimation="data"
                className="w-80 h-80 lg:w-96 lg:h-96"
              />
              
              {/* Floating badges */}
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
                className="absolute top-10 -left-5 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
              >
                💼 Work
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
                className="absolute top-1/2 -right-5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
              >
                🎓 Education
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
                className="absolute bottom-20 -left-8 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
              >
                🚀 Growth
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-300 via-amber-300 to-yellow-300 dark:from-orange-600 dark:via-amber-600 dark:to-yellow-600 rounded-full shadow-lg"></div>

          {experiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative mb-16 ${
                index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
              }`}
            >
              {/* Timeline Dot with Icon */}
              <motion.div 
                className={`absolute top-6 ${
                  index % 2 === 0 
                    ? 'left-0 md:left-auto md:right-0 md:transform md:translate-x-1/2' 
                    : 'left-0 md:left-0 md:transform md:-translate-x-1/2'
                } flex items-center justify-center`}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border-4 border-orange-400 dark:border-orange-500 flex items-center justify-center">
                  {item.type === 'experience' ? (
                    <FaBriefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <FaGraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
              </motion.div>

              <motion.div 
                className={`ml-16 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-16' : 'md:ml-16'
                }`}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100 dark:border-orange-800/30">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <motion.span 
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        item.type === 'experience' 
                          ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200' 
                          : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.type === 'experience' ? '💼 Work Experience' : '🎓 Education'}
                    </motion.span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.period}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-semibold mb-4 text-lg">{item.company}</p>
                  
                  {/* Description */}
                  <ul className="space-y-3 mb-4">
                    {item.description.map((desc, descIndex) => (
                      <motion.li 
                        key={descIndex} 
                        className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex items-start gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: descIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-orange-500 mt-1 text-xs">▶</span>
                        {desc}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Skills */}
                  {item.skills && (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: skillIndex * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium border border-orange-200 dark:border-orange-700"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
