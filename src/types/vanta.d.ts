declare module 'vanta/dist/vanta.waves.min.js' {
  interface VantaWavesOptions {
    el: string | HTMLElement
    THREE: any
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    scale?: number
    scaleMobile?: number
    color?: number
    shininess?: number
    waveHeight?: number
    waveSpeed?: number
    zoom?: number
  }

  interface VantaEffect {
    destroy(): void
  }

  const VANTA: (options: VantaWavesOptions) => VantaEffect
  export default VANTA
}

declare module 'vanta' {
  export * from 'vanta/dist/vanta.waves.min.js'
}
