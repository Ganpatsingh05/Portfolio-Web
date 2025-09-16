'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  FaReact, 
  FaNodeJs, 
  FaPython, 
  FaGitAlt, 
  FaDocker, 
  FaAws,
  FaDatabase,
  FaCode,
  FaBrain,
  FaTools,
  FaRocket,
  FaStar,
  FaLightbulb,
  FaUsers,
  FaCogs,
  FaFlask
} from 'react-icons/fa'
import { 
  SiTypescript, 
  SiTailwindcss, 
  SiPostgresql, 
  SiMongodb, 
  SiTensorflow,
  SiNextdotjs,
  SiJavascript
} from 'react-icons/si'

interface Skill {
  id?: string
  name: string
  level: number
  // Allow custom categories coming from admin (e.g., "excel")
  category: string
  icon_name?: string
  sort_order?: number
  is_featured?: boolean
  created_at?: string
  updated_at?: string
}

// Icon mapping for dynamic icons
const iconMap: { [key: string]: React.ReactNode } = {
  FaReact: <FaReact className="text-blue-500" />,
  SiTypescript: <SiTypescript className="text-blue-600" />,
  SiTailwindcss: <SiTailwindcss className="text-cyan-500" />,
  SiJavascript: <SiJavascript className="text-yellow-500" />,
  FaNodeJs: <FaNodeJs className="text-green-500" />,
  FaPython: <FaPython className="text-blue-400" />,
  SiPostgresql: <SiPostgresql className="text-blue-600" />,
  SiMongodb: <SiMongodb className="text-green-500" />,
  FaGitAlt: <FaGitAlt className="text-orange-500" />,
  FaDocker: <FaDocker className="text-blue-500" />,
  FaAws: <FaAws className="text-orange-400" />,
  FaBrain: <FaBrain className="text-purple-500" />,
  SiTensorflow: <SiTensorflow className="text-orange-500" />,
  FaDatabase: <FaDatabase className="text-indigo-500" />,
  FaCode: <FaCode className="text-gray-600" />
}

// Base colors (used by helpers below)
const categoryColors = {
  frontend: 'from-orange-400 to-amber-500',
  backend: 'from-emerald-500 to-green-600',
  tools: 'from-orange-500 to-red-500',
  'ai-ml': 'from-orange-600 to-purple-600',
  other: 'from-cyan-500 to-teal-600',
  custom: 'from-fuchsia-500 to-pink-600',
  default: 'from-violet-500 to-indigo-600'
} as const

const categoryIcons = {
  frontend: <FaCode className="text-orange-500" />,
  backend: <FaDatabase className="text-emerald-500" />,
  tools: <FaTools className="text-orange-500" />,
  'ai-ml': <FaBrain className="text-purple-500" />,
  other: <FaTools className="text-teal-500" />,
  custom: <FaFlask className="text-fuchsia-500" />
}

const categoryNames = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Tools & DevOps',
  'ai-ml': 'AI & ML',
  other: 'Other',
  custom: 'Custom'
}

// Normalize a category string to a known key for colors/icons
const normalizeCategoryKey = (cat?: string) => {
  const key = (cat || '').toLowerCase()
  if (key in categoryColors) return key as keyof typeof categoryColors
  if (key in categoryIcons) return key as keyof typeof categoryIcons
  if (key in categoryNames) return key as keyof typeof categoryNames
  // Treat unknowns as custom for styling; we still display the raw label
  return 'custom' as const
}

const getCategoryGradient = (cat?: string) => {
  const key = normalizeCategoryKey(cat)
  return categoryColors[key] || categoryColors.default
}

const getCategoryLabel = (cat?: string) => {
  const key = (cat || '').toLowerCase()
  if (key in categoryNames) return categoryNames[key as keyof typeof categoryNames]
  if (!cat) return 'Custom'
  // Show the exact custom category text (e.g., "Excel")
  return cat
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/skills')
        if (!response.ok) {
          throw new Error('Failed to fetch skills')
        }
        const result = await response.json()
        // Extract the data array from the response wrapper
        const data = result.data || result || []
        // Sort by category (asc), then level desc, then name asc
        const sorted = (data as Skill[]).slice().sort((a, b) => {
          const ca = (a.category || '').toLowerCase()
          const cb = (b.category || '').toLowerCase()
          if (ca < cb) return -1
          if (ca > cb) return 1
          if (a.level !== b.level) return b.level - a.level
          return (a.name || '').localeCompare(b.name || '')
        })
        setSkills(sorted)
      } catch (err) {
        console.error('Error fetching skills:', err)
        setError('Failed to load skills')
        // Fallback to static data
        setSkills([
          { name: 'React/Next.js', level: 90, category: 'frontend', icon_name: 'FaReact' },
          { name: 'TypeScript', level: 85, category: 'frontend', icon_name: 'SiTypescript' },
          { name: 'TailwindCSS', level: 88, category: 'frontend', icon_name: 'SiTailwindcss' },
          { name: 'JavaScript', level: 92, category: 'frontend', icon_name: 'SiJavascript' },
          { name: 'Node.js', level: 80, category: 'backend', icon_name: 'FaNodeJs' },
          { name: 'Python', level: 85, category: 'backend', icon_name: 'FaPython' },
          { name: 'PostgreSQL', level: 75, category: 'backend', icon_name: 'SiPostgresql' },
          { name: 'MongoDB', level: 78, category: 'backend', icon_name: 'SiMongodb' },
          { name: 'Git/GitHub', level: 90, category: 'tools', icon_name: 'FaGitAlt' },
          { name: 'Docker', level: 70, category: 'tools', icon_name: 'FaDocker' },
          { name: 'AWS', level: 65, category: 'tools', icon_name: 'FaAws' },
          { name: 'Machine Learning', level: 75, category: 'ai-ml', icon_name: 'FaBrain' },
          { name: 'TensorFlow', level: 70, category: 'ai-ml', icon_name: 'SiTensorflow' },
          { name: 'Data Analysis', level: 80, category: 'ai-ml', icon_name: 'FaDatabase' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])
  
  const categories = ['all', 'frontend', 'backend', 'tools', 'ai-ml', 'other', 'custom']
  
  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory)

  const skillsStats = {
    total: skills.length,
    frontend: skills.filter(s => s.category === 'frontend').length,
    backend: skills.filter(s => s.category === 'backend').length,
    tools: skills.filter(s => s.category === 'tools').length,
    'ai-ml': skills.filter(s => s.category === 'ai-ml').length,
    avgLevel: skills.length > 0 ? Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length) : 0
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800" id="skills">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading skills...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800" id="skills">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <FaRocket className="text-5xl text-orange-500 mx-auto" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Skills & Expertise
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Technical skills I've mastered through continuous learning and real-world application.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-orange-800">
            <FaStar className="text-3xl text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{skillsStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Skills</div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-orange-800">
            <FaCode className="text-3xl text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{skillsStats.frontend}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Frontend</div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-orange-800">
            <FaDatabase className="text-3xl text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{skillsStats.backend}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Backend</div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-orange-800">
            <FaRocket className="text-3xl text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{skillsStats.avgLevel}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Level</div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600 shadow-md border border-orange-200 dark:border-gray-600'
              }`}
            >
              {category !== 'all' && categoryIcons[category as keyof typeof categoryIcons]}
              {category === 'all' ? 'All Skills' : categoryNames[category as keyof typeof categoryNames]}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200 dark:border-gray-700 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotate: hoveredSkill === skill.name ? 360 : 0,
                      scale: hoveredSkill === skill.name ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                  >
                    {skill.icon_name && iconMap[skill.icon_name] || <FaCode className="text-gray-600" />}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {skill.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{skill.level}%</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">proficiency</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`h-full bg-gradient-to-r ${getCategoryGradient(skill.category)} rounded-full relative overflow-hidden`}
                >
                  <motion.div
                    animate={{ x: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryGradient(skill.category)} text-white font-medium`}>
                  {getCategoryLabel(skill.category)}
                </span>
                <motion.div
                  animate={{ opacity: hoveredSkill === skill.name ? 1 : 0 }}
                  className="text-orange-500"
                >
                  <FaStar className="text-sm" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <FaLightbulb className="text-4xl text-orange-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Additional Expertise
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Soft skills and methodologies that enhance my technical abilities
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Problem Solving', icon: <FaLightbulb /> },
              { name: 'Team Collaboration', icon: <FaUsers /> },
              { name: 'Agile/Scrum', icon: <FaCogs /> },
              { name: 'API Design', icon: <FaCode /> },
              { name: 'Testing', icon: <FaFlask /> },
              { name: 'CI/CD', icon: <FaRocket /> }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-gray-800 text-center p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-200 dark:border-gray-700 group"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="text-2xl text-orange-500 mb-2 group-hover:text-orange-600 transition-colors"
                >
                  {skill.icon}
                </motion.div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
