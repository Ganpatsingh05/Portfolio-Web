'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'

interface GlobalLoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
  loadingProgress: 0,
  setLoadingProgress: () => {},
})

export function useGlobalLoading() {
  return useContext(GlobalLoadingContext)
}

interface GlobalLoadingProviderProps {
  children: ReactNode
}

export function GlobalLoadingProvider({ children }: GlobalLoadingProviderProps) {
  // Loader is OFF by default — only shown when explicitly triggered
  const [isLoading, setIsLoadingRaw] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [dots, setDots] = useState('')
  const startTime = useRef(Date.now())

  const loadingMessage = loadingProgress < 20
    ? 'Initializing'
    : loadingProgress < 50
    ? 'Connecting to server'
    : loadingProgress < 80
    ? 'Loading content'
    : 'Almost there'

  const handleSetLoading = useCallback((loading: boolean) => {
    if (loading) {
      startTime.current = Date.now()
      setLoadingProgress(0)
      setIsLoadingRaw(true)
      setIsVisible(true)
    } else {
      // Fade out over 400ms, then fully remove
      setIsVisible(false)
      setTimeout(() => setIsLoadingRaw(false), 400)
    }
  }, [])

  // Animate dots & safety timeout only while loading
  useEffect(() => {
    if (!isLoading) return

    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)

    // Safety: force dismiss after 30s
    const safetyTimeout = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => setIsLoadingRaw(false), 400)
    }, 30000)

    return () => {
      clearInterval(dotsInterval)
      clearTimeout(safetyTimeout)
    }
  }, [isLoading])

  return (
    <GlobalLoadingContext.Provider
      value={{ isLoading, setIsLoading: handleSetLoading, loadingProgress, setLoadingProgress }}
    >
      {/* Always render children so page loads behind the overlay */}
      {children}
      
      {/* Loader overlay - fades out when done */}
      {isLoading && (
        <div 
          className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center"
          style={{ 
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 400ms ease-out',
            pointerEvents: isVisible ? 'auto' : 'none'
          }}
        >
          <div className="flex flex-col items-center gap-6 px-4">
            {/* Animated Logo */}
            <div className="relative w-40 h-40">
              {/* Outer rotating arc - orange segment */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 50 50"
                      to="360 50 50"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#fb923c" strokeWidth="4"
                            strokeDasharray="70 230" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
                
                {/* Middle counter-rotating arc - yellow segment */}
                <div className="absolute inset-3">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="360 50 50"
                        to="0 50 50"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <circle cx="50" cy="50" r="46" fill="none" stroke="#fbbf24" strokeWidth="4"
                              strokeDasharray="80 220" strokeLinecap="round" />
                    </g>
                  </svg>
                </div>
                
                {/* Inner fast rotating arc */}
                <div className="absolute inset-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <circle cx="50" cy="50" r="46" fill="none" stroke="#f97316" strokeWidth="3"
                              strokeDasharray="50 250" strokeLinecap="round" opacity="0.8" />
                    </g>
                  </svg>
                </div>
                
                {/* Pulsing glow effect */}
                <div className="absolute inset-12 rounded-full glow-pulse">
                  <div style={{ 
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-color, #f97316)', 
                    opacity: 0.15,
                    filter: 'blur(25px)'
                  }}></div>
                </div>
                
                {/* Logo with breathing animation */}
                <div className="absolute inset-14 flex items-center justify-center logo-scale">
                  <img
                    src="/gslogo.png"
                    alt="Logo"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

            {/* Loading text with animated dots */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-700 dark:text-gray-300 text-xl font-medium">
                {loadingMessage}{dots}
              </p>
            </div>

            {/* Progress bar with percentage */}
            <div className="w-72 space-y-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: 'var(--accent-color, #f97316)',
                    width: `${loadingProgress}%`,
                    transition: 'width 300ms ease-out'
                  }}
                ></div>
              </div>
            </div>

            {/* Tip only after 8 seconds */}
            {Date.now() - startTime.current > 8000 && loadingProgress < 90 && (
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-600 text-center max-w-md">
                Server is waking up, this may take a moment
              </div>
            )}
          </div>
        </div>
      )}
    </GlobalLoadingContext.Provider>
  )
}
