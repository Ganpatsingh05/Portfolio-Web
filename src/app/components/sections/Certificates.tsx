'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaAward, FaExternalLinkAlt, FaCalendarAlt, FaBuilding, FaSearchPlus } from 'react-icons/fa'
import { useCertificates } from '@/lib/hooks'

interface Certificate {
  id?: string
  title: string
  issuer: string
  issue_date?: string
  credential_id?: string
  credential_url?: string
  description?: string
  image_url?: string
  timeline?: string
  visible?: boolean
}

export default function Certificates() {
  const { data: certificates = [], isLoading } = useCertificates()
  const [viewImage, setViewImage] = useState<string | null>(null)

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900" id="certificates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (certificates.length === 0) return null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900" id="certificates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-block mb-3 sm:mb-4"
          >
            <FaAward className="text-4xl sm:text-5xl text-orange-500 mx-auto" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Certificates
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Professional certifications and credentials I've earned
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {certificates.map((cert: Certificate, index: number) => (
            <motion.div
              key={cert.id || index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-md border border-orange-200 dark:border-gray-700 group hover:border-orange-400 dark:hover:border-orange-600 transition-colors overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              {cert.image_url && (
                <div className="relative w-full h-52 sm:h-56 overflow-hidden">
                  <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" loading="lazy" />
                  <button
                    onClick={() => setViewImage(cert.image_url!)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group/overlay"
                    aria-label={`View ${cert.title} certificate`}
                  >
                    <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-900/90 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-lg opacity-0 group-hover/overlay:opacity-100 transition-opacity scale-90 group-hover/overlay:scale-100">
                      <FaSearchPlus className="w-3.5 h-3.5" /> View
                    </span>
                  </button>
                </div>
              )}

              <div className="p-5 sm:p-6 flex flex-col flex-1">
              <div className="flex-1">
                {/* Certificate Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaAward className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                      {cert.title}
                    </h3>
                  </div>
                </div>

                {/* Issuer */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <FaBuilding className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span>{cert.issuer}</span>
                </div>

                {/* Timeline or Issue Date */}
                {(cert.timeline || cert.issue_date) && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <FaCalendarAlt className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    <span>{cert.timeline || formatDate(cert.issue_date)}</span>
                  </div>
                )}

                {/* Description */}
                {cert.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {cert.description}
                  </p>
                )}
              </div>

              {/* Credential ID & Link - Always at bottom */}
              <div className="flex items-center justify-between pt-3 border-t border-orange-200/50 dark:border-gray-700 mt-auto">
                {cert.credential_id && (
                  <span className="text-xs text-gray-500 dark:text-gray-500 truncate mr-2">
                    ID: {cert.credential_id}
                  </span>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors ml-auto"
                  >
                    Verify <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                )}
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Lightbox - rendered via portal */}
      {viewImage && <CertificateLightbox image={viewImage} onClose={() => setViewImage(null)} />}
    </section>
  )
}

function CertificateLightbox({ image, onClose }: { image: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl w-full max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <img src={image} alt="Certificate" className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
