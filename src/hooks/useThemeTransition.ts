import { useEffect } from 'react'

export function useThemeTransition() {
  useEffect(() => {
    // Désactiver les transitions pendant le changement initial de thème
    const css = document.createElement('style')
    css.type = 'text/css'
    css.appendChild(document.createTextNode(
      '* { transition: none !important; }'
    ))
    document.head.appendChild(css)

    // Réactiver les transitions après un délai
    const timer = setTimeout(() => {
      document.head.removeChild(css)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (document.head.contains(css)) {
        document.head.removeChild(css)
      }
    }
  }, [])
} 