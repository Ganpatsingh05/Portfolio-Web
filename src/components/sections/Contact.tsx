'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGithub, 
  FaDownload,
  FaPaperPlane,
  FaUser,
  FaTag,
  FaComment,
  FaRocket,
  FaHeart,
  FaCode,
  FaCoffee
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Message sent successfully!')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-900 text-white relative overflow-hidden" id="contact">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
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
            className="inline-block mb-6"
          >
            <FaRocket className="text-6xl text-orange-500 mx-auto" />
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-6">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to bring your ideas to life? Let's collaborate and create something amazing together!
          </p>
          
          {/* Fun Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            <div className="flex items-center gap-2 text-orange-400">
              <FaCoffee className="text-xl" />
              <span className="font-semibold">100+ Cups of Coffee</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <FaCode className="text-xl" />
              <span className="font-semibold">50+ Projects Completed</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <FaHeart className="text-xl" />
              <span className="font-semibold">Made with Passion</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-gray-300">I'll get back to you within 24 hours!</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium mb-2 text-orange-300">
                    <FaUser className="text-orange-500" />
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300 group-hover:border-orange-400"
                    placeholder="Your awesome name"
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2 text-orange-300">
                    <FaEnvelope className="text-orange-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300 group-hover:border-orange-400"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium mb-2 text-orange-300">
                  <FaTag className="text-orange-500" />
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300 group-hover:border-orange-400"
                  placeholder="What's your project about?"
                />
              </div>
              
              <div className="group">
                <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium mb-2 text-orange-300">
                  <FaComment className="text-orange-500" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-400 resize-none transition-all duration-300 group-hover:border-orange-400"
                  placeholder="Tell me about your amazing project idea..."
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
              <h3 className="text-3xl font-bold mb-6 text-white">Get In Touch</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm always excited to work on new projects and collaborate with amazing people. 
                Whether you have a specific project in mind or just want to explore possibilities, 
                let's connect and make something incredible together!
              </p>

              <div className="space-y-6">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                    <FaEnvelope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-300 group-hover:text-orange-200 transition-colors">Email</h4>
                    <p className="text-gray-300 group-hover:text-white transition-colors">ganpatsingh.dev@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                    <FaMapMarkerAlt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-300 group-hover:text-orange-200 transition-colors">Location</h4>
                    <p className="text-gray-300 group-hover:text-white transition-colors">Available Worldwide (Remote)</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h4 className="font-semibold mb-6 text-orange-300 text-lg">Connect With Me</h4>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://leetcode.com/u/Ganpat_singh/"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white"
                  >
                    <SiLeetcode className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/ganpat-singh-aabb4a285/"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://github.com/Ganpatsingh05"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-white"
                  >
                    <FaGithub className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>

              {/* Resume Download */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8"
              >
                <a
                  href="#"
                  className="inline-flex items-center space-x-3 bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaDownload className="w-5 h-5" />
                  <span>Download Resume</span>
                </a>
              </motion.div>
            </div>

            {/* Quick Response Promise */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/30 text-center"
            >
              <FaRocket className="text-3xl text-orange-400 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-white mb-2">Quick Response Guaranteed</h4>
              <p className="text-gray-300">I typically respond within 4-6 hours during business days!</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
