'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a WebGL-related error
    const errorMessage = error.message.toLowerCase()
    const isWebGLError = errorMessage.includes('webgl') || 
                        errorMessage.includes('webglrenderer') ||
                        errorMessage.includes('angle') ||
                        errorMessage.includes('swiftshader') ||
                        errorMessage.includes('gl_vendor') ||
                        errorMessage.includes('bindtocurrentsequence') ||
                        errorMessage.includes('could not create a webgl context') ||
                        errorMessage.includes('vendor = 0xffff') ||
                        errorMessage.includes('device = 0xffff')
    
    if (isWebGLError) {
      console.warn('WebGL Error caught by boundary:', error.message)
      return { hasError: true, error }
    }
    
    // Re-throw non-WebGL errors
    throw error
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('WebGL component failed:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Return the fallback UI or a default fallback
      return this.props.fallback || (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="animate-pulse">
              {/* Simple CSS animation fallback */}
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50"></div>
              <p className="text-sm">3D graphics not available</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default WebGLErrorBoundary
