'use client'

import { motion } from 'framer-motion'
import { 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaHeart, 
  FaCode, 
  FaRocket,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { openSocialLink, scrollToSection, openEmail } from '../../utils/actions'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <motion.div 
              className="mb-6 flex items-center gap-4 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="relative"
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              >
                <img 
                  src="/gslogo.png" 
                  alt="GS Logo"
                  className="h-16 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]"
                />
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 bg-orange-400/30 rounded-full blur-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    opacity: 1, 
                    scale: 1.3,
                    rotate: 360
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              <div>
                <motion.h3 
                  className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                  whileHover={{ 
                    x: 5,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Ganpat Singh
                </motion.h3>
                <p className="text-orange-300 font-medium">Full Stack Developer</p>
              </div>
            </motion.div>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Passionate about creating innovative web solutions and exploring the latest 
              in AI and modern web technologies. Always excited to work on challenging projects 
              that make a difference.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {[
                { icon: SiLeetcode, href: "https://leetcode.com/u/Ganpat_singh/", color: "hover:text-orange-400" },
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/ganpat-singh-aabb4a285/", color: "hover:text-blue-600" },
                { icon: FaGithub, href: "https://github.com/Ganpatsingh05", color: "hover:text-gray-400" }
              ].map((social, index) => (
                <motion.button
                  key={index}
                  onClick={() => openSocialLink(social.href)}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 border border-orange-500/20 hover:border-orange-400/40 hover:shadow-lg hover:shadow-orange-500/25`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <button 
                onClick={() => openEmail('ganpatsingh.dev@gmail.com')}
                className="flex items-center gap-3 text-gray-300 hover:text-orange-300 transition-colors cursor-pointer"
              >
                <FaEnvelope className="text-orange-500" />
                <span>ganpatsingh.dev@gmail.com</span>
              </button>
              <div className="flex items-center gap-3 text-gray-300 hover:text-orange-300 transition-colors">
                <FaMapMarkerAlt className="text-orange-500" />
                <span>Available Worldwide (Remote)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-orange-300">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Experience", href: "#experience" },
                { name: "Skills", href: "#skills" },
                { name: "Contact", href: "#contact" }
              ].map((link) => (
                <li key={link.name}>
                  <motion.button 
                    onClick={() => scrollToSection(link.href)}
                    whileHover={{ x: 5 }}
                    className="text-gray-300 hover:text-orange-300 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-orange-500 rounded-full group-hover:w-2 transition-all duration-300"></div>
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Tech */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-orange-300">Services</h4>
            <ul className="space-y-3">
              {[
                "Web Development",
                "UI/UX Design", 
                "API Development",
                "Database Design",
                "DevOps Solutions"
              ].map((service) => (
                <li key={service}>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="text-gray-300 hover:text-orange-300 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-orange-500 rounded-full group-hover:w-2 transition-all duration-300"></div>
                    {service}
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <span>© {currentYear} Ganpat Singh. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FaHeart className="text-red-500" />
            </motion.div>
            <span>using</span>
            <FaCode className="text-orange-500" />
            <span>Next.js & TailwindCSS</span>
          </div>
          
          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-2 group"
          >
            <FaArrowUp className="group-hover:-translate-y-1 transition-transform duration-300" />
            <span className="hidden md:inline">Back to Top</span>
          </motion.button>
        </div>

        {/* Tech Stack Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-orange-500/20">
            <FaRocket className="text-orange-500" />
            <span className="text-gray-300 text-sm">Built for the future of web development</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
