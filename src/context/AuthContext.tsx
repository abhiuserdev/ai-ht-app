import { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const DUMMY_USERS = [
  { email: 'user@healthai.com', password: 'password123', name: 'Alex Johnson' },
  { email: 'demo@healthai.com', password: 'demo123', name: 'Demo User' },
  { email: 'admin@healthai.com', password: 'admin123', name: 'Admin User' },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('healthai_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setIsAuthenticated(true)
        setUser(parsed)
      } catch {
        localStorage.removeItem('healthai_auth')
      }
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const found = DUMMY_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    )
    if (found) {
      const userData = { name: found.name, email: found.email }
      setIsAuthenticated(true)
      setUser(userData)
      localStorage.setItem('healthai_auth', JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('healthai_auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
