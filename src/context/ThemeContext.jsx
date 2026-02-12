import { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: 'light',
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e'
  })

  useEffect(() => {
    // Load theme from localStorage or school settings
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme))
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme.mode)
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor)
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor)
    
    // Save to localStorage
    localStorage.setItem('theme', JSON.stringify(theme))
  }, [theme])

  const toggleMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }))
  }

  const updateColors = (primaryColor, secondaryColor) => {
    setTheme(prev => ({
      ...prev,
      primaryColor,
      secondaryColor
    }))
  }

  const value = {
    theme,
    toggleMode,
    updateColors
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}