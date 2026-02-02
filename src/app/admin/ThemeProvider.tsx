"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  accentColor: string;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage keys - admin-specific
const THEME_KEY = 'admin-theme';
const ACCENT_KEY = 'admin-accent-color';

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [accentColor, setAccentColorState] = useState<string>('#3B82F6');
  const [mounted, setMounted] = useState(false);
  const initializedRef = useRef(false);

  // Helper to resolve theme value
  const resolveThemeValue = useCallback((t: Theme): 'light' | 'dark' => {
    if (t === 'system') {
      if (typeof window === 'undefined') return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return t;
  }, []);

  // Apply theme to DOM - this is the critical function
  const applyThemeToDOM = useCallback((resolved: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the resolved theme class
    root.classList.add(resolved);
    
    // Also update CSS variables for background/foreground
    if (resolved === 'dark') {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
    }
  }, []);

  // Initialize on mount - use layout effect to avoid flash
  useIsomorphicLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Get stored theme
    const storedTheme = (localStorage.getItem(THEME_KEY) as Theme) || 'light';
    const resolved = resolveThemeValue(storedTheme);
    
    // Get stored accent color
    const storedAccent = localStorage.getItem(ACCENT_KEY) || '#3B82F6';
    
    // Apply to DOM immediately (before paint)
    applyThemeToDOM(resolved);
    document.documentElement.style.setProperty('--accent-color', storedAccent);
    
    // Update state
    setThemeState(storedTheme);
    setResolvedTheme(resolved);
    setAccentColorState(storedAccent);
    
    setMounted(true);
  }, [resolveThemeValue, applyThemeToDOM]);

  // Sync theme on route changes - re-apply on every navigation
  useEffect(() => {
    if (!mounted) return;

    // Re-apply theme on every render to handle navigation
    const storedTheme = (localStorage.getItem(THEME_KEY) as Theme) || 'light';
    const resolved = resolveThemeValue(storedTheme);
    
    // Always apply to DOM
    applyThemeToDOM(resolved);
    
    // Update state if needed
    if (theme !== storedTheme) {
      setThemeState(storedTheme);
    }
    if (resolvedTheme !== resolved) {
      setResolvedTheme(resolved);
    }
  });

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY) {
        const newTheme = (e.newValue as Theme) || 'light';
        const resolved = resolveThemeValue(newTheme);
        setThemeState(newTheme);
        setResolvedTheme(resolved);
        applyThemeToDOM(resolved);
      }
      if (e.key === ACCENT_KEY && e.newValue) {
        setAccentColorState(e.newValue);
        document.documentElement.style.setProperty('--accent-color', e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [resolveThemeValue, applyThemeToDOM]);

  // Listen for system theme changes when using 'system' theme
  useEffect(() => {
    if (theme !== 'system' || !mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      applyThemeToDOM(newResolved);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    // Get fresh value from localStorage to avoid stale state
    const currentStored = (localStorage.getItem(THEME_KEY) as Theme) || 'light';
    const currentResolved = resolveThemeValue(currentStored);
    const newTheme: Theme = currentResolved === 'light' ? 'dark' : 'light';
    
    // Save to storage first
    localStorage.setItem(THEME_KEY, newTheme);
    
    // Apply to DOM immediately
    applyThemeToDOM(newTheme);
    
    // Update state
    setThemeState(newTheme);
    setResolvedTheme(newTheme);
  }, [resolveThemeValue, applyThemeToDOM]);

  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = resolveThemeValue(newTheme);
    
    // Save to storage
    localStorage.setItem(THEME_KEY, newTheme);
    
    // Apply to DOM
    applyThemeToDOM(resolved);
    
    // Update state
    setThemeState(newTheme);
    setResolvedTheme(resolved);
  }, [resolveThemeValue, applyThemeToDOM]);

  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    localStorage.setItem(ACCENT_KEY, color);
    document.documentElement.style.setProperty('--accent-color', color);
  }, []);

  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
    setAccentColor,
    accentColor,
    mounted
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
}

// Admin theme script component - prevents flash of wrong theme
export function AdminThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('admin-theme') || 'light';
              var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              var resolvedTheme = theme === 'system' ? systemTheme : theme;
              
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(resolvedTheme);
              
              if (resolvedTheme === 'dark') {
                document.documentElement.style.setProperty('--background', '#0a0a0a');
                document.documentElement.style.setProperty('--foreground', '#ededed');
              } else {
                document.documentElement.style.setProperty('--background', '#ffffff');
                document.documentElement.style.setProperty('--foreground', '#171717');
              }
              
              var accent = localStorage.getItem('admin-accent-color');
              if (accent) {
                document.documentElement.style.setProperty('--accent-color', accent);
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}