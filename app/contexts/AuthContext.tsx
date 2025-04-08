'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface AuthContextType {
  isAuthenticated: boolean
  deviceId: string | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [deviceId, setDeviceId] = useState<string | null>(null)

  useEffect(() => {
    // Vérifier si un ID d'appareil existe déjà
    let storedDeviceId = localStorage.getItem('device_id')
    
    if (!storedDeviceId) {
      // Générer un nouvel ID si aucun n'existe et prendre les 8 premiers caractères
      storedDeviceId = uuidv4().slice(0, 8)
      localStorage.setItem('device_id', storedDeviceId)
    } else {
      // S'assurer que l'ID existant est au bon format
      storedDeviceId = storedDeviceId.slice(0, 8)
    }
    
    setDeviceId(storedDeviceId)
    setIsAuthenticated(true)
  }, [])

  const login = () => {
    if (deviceId) {
      setIsAuthenticated(true)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, deviceId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
} 