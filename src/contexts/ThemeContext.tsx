import React, { createContext, useContext, useEffect, useState } from 'react'
import { useThemeTransition } from '@/hooks/useThemeTransition'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useThemeTransition()
  
  const [theme, setTheme] = useState<Theme>(() => {
    // Vérifier le localStorage d'abord
    const savedTheme = localStorage.getItem('memor-ia-theme') as Theme
    if (savedTheme) {
      return savedTheme
    }
    
    // Sinon vérifier la préférence système
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Supprimer les classes précédentes
    root.classList.remove('light', 'dark')
    
    // Ajouter la nouvelle classe
    root.classList.add(theme)
    
    // Sauvegarder dans localStorage
    localStorage.setItem('memor-ia-theme', theme)
  }, [theme])

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('memor-ia-theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 