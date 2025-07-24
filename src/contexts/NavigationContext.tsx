import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface NavigationContextType {
  previousPath: string
  setPreviousPath: (path: string) => void
  getBackPath: () => string
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

const mainTabs = ['/souvenirs', '/nouveau', '/recherche']

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [previousPath, setPreviousPath] = useState('/souvenirs') // Par défaut
  const location = useLocation()

  useEffect(() => {
    // Si on est sur un onglet principal, on le sauvegarde comme précédent
    if (mainTabs.includes(location.pathname)) {
      setPreviousPath(location.pathname)
    }
  }, [location.pathname])

  const getBackPath = () => {
    // Si on est sur Profile ou Settings, retourner à l'onglet précédent
    if (location.pathname === '/profile' || location.pathname === '/settings') {
      return previousPath
    }
    // Sinon retourner à l'accueil par défaut
    return '/'
  }

  const value = {
    previousPath,
    setPreviousPath,
    getBackPath
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
} 