'use client'

export const detectWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const canvas = document.createElement('canvas')
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
    
    try {
      gl = canvas.getContext('webgl2', { 
        failIfMajorPerformanceCaveat: true,
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'default'
      }) || 
      canvas.getContext('webgl', { 
        failIfMajorPerformanceCaveat: true,
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'default'
      }) || 
      canvas.getContext('experimental-webgl', { 
        failIfMajorPerformanceCaveat: true 
      }) as WebGLRenderingContext | null
    } catch (contextError) {
      console.warn('WebGL context creation failed:', contextError)
      canvas.remove()
      return false
    }
    
    if (!gl) {
      canvas.remove()
      return false
    }
    
    // Check for problematic renderers
    try {
      const renderer = gl.getParameter(gl.RENDERER) || ''
      const vendor = gl.getParameter(gl.VENDOR) || ''
      
      // Check for SwiftShader or ANGLE issues
      if (renderer.includes('SwiftShader') || 
          renderer.includes('ANGLE') ||
          vendor.includes('Google Inc. (Google)')) {
        console.warn('Detected potentially problematic WebGL renderer:', renderer, vendor)
        
        // Try a simple draw test
        const testSupported = gl.getParameter(gl.VERSION) !== null
        if (!testSupported) {
          canvas.remove()
          return false
        }
      }
    } catch (paramError) {
      console.warn('WebGL parameter check failed:', paramError)
      canvas.remove()
      return false
    }
    
    // Clean up properly
    try {
      const extension = gl.getExtension('WEBGL_lose_context')
      if (extension) {
        extension.loseContext()
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    canvas.remove()
    return true
  } catch (error) {
    console.warn('WebGL detection failed:', error)
    return false
  }
}

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    navigator.maxTouchPoints > 0
  )
}

export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for indicators of low-end device
  const hardwareConcurrency = navigator.hardwareConcurrency || 1
  const deviceMemory = (navigator as any).deviceMemory || 2
  
  return hardwareConcurrency <= 2 || deviceMemory <= 2
}

export const hasProblematicGraphics = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
    
    if (!gl) {
      canvas.remove()
      return true // If we can't create a context, consider it problematic
    }
    
    const renderer = gl.getParameter(gl.RENDERER) || ''
    const vendor = gl.getParameter(gl.VENDOR) || ''
    
    // Clean up
    canvas.remove()
    
    // Check for known problematic configurations
    const problematicIndicators = [
      'SwiftShader',
      'ANGLE',
      'Microsoft Basic Render Driver',
      'Software Rasterizer',
      'llvmpipe',
      'VENDOR = 0xffff',
      'DEVICE = 0xffff'
    ]
    
    const rendererStr = renderer.toLowerCase()
    const vendorStr = vendor.toLowerCase()
    
    return problematicIndicators.some(indicator => 
      rendererStr.includes(indicator.toLowerCase()) || 
      vendorStr.includes(indicator.toLowerCase())
    )
  } catch (error) {
    console.warn('Graphics detection failed:', error)
    return true // Assume problematic if detection fails
  }
}

export const shouldUse3D = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    // Check for mobile devices first
    if (isMobileDevice()) return false
    
    // Check for low-end devices
    if (isLowEndDevice()) return false
    
    // Check for problematic graphics configurations
    if (hasProblematicGraphics()) return false
    
    // Test WebGL support with enhanced detection
    if (!detectWebGLSupport()) return false
    
    // Additional check for problematic browsers
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('chrome') && userAgent.includes('headless')) {
      return false
    }
    
    return true
  } catch (error) {
    console.warn('Error checking 3D support:', error)
    return false
  }
}
