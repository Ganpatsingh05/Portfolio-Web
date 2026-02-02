'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  setAccentColor: (color: string) => void
  applyThemeFromSettings: (theme: Theme, accentColor?: string) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  setAccentColor: () => null,
  applyThemeFromSettings: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    }
    
    // Load stored accent color on mount
    const storedAccentColor = localStorage.getItem('portfolio-accent-color')
    if (storedAccentColor) {
      const root = window.document.documentElement
      root.style.setProperty('--accent-color', storedAccentColor)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const resolvedTheme = theme === 'system' ? systemTheme : theme

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)

    // Update the CSS variable for smoother transitions
    if (resolvedTheme === 'dark') {
      root.style.setProperty('--background', '#0a0a0a')
      root.style.setProperty('--foreground', '#ededed')
    } else {
      root.style.setProperty('--background', '#ffffff')
      root.style.setProperty('--foreground', '#171717')
    }
  }, [theme, mounted])

  const setAccentColor = (color: string) => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      root.style.setProperty('--accent-color', color)
      localStorage.setItem('portfolio-accent-color', color)
    }
  }

  // Apply theme from settings without overwriting user's manual choice
  const applyThemeFromSettings = (settingsTheme: Theme, accentColor?: string) => {
    // Only apply settings theme if user hasn't manually set a preference
    const userTheme = localStorage.getItem(storageKey) as Theme
    if (!userTheme) {
      setTheme(settingsTheme)
      localStorage.setItem(storageKey, settingsTheme)
    }
    
    // Always apply accent color from settings
    if (accentColor) {
      setAccentColor(accentColor)
    }
  }

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    setAccentColor,
    applyThemeFromSettings,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
