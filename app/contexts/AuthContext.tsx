'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  isAuthenticated: boolean
  deviceId: string | null
  hasSubscription: boolean
  isGoogleLinked: boolean
  googleEmail: string | null
  linkGoogleAccount: () => Promise<void>
  unlinkGoogleAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [isGoogleLinked, setIsGoogleLinked] = useState(false)
  const [googleEmail, setGoogleEmail] = useState<string | null>(null)

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
    setIsAuthenticated(true) // L'utilisateur est toujours authentifié avec son deviceId
    checkSubscription(storedDeviceId)
    checkGoogleLink()
  }, [])

  // Nouvel effet pour écouter les changements d'authentification Google
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setGoogleEmail(session.user.email || null)
        setIsGoogleLinked(true)
        if (deviceId) {
          await checkSubscription(deviceId)
        }
      } else {
        setGoogleEmail(null)
        setIsGoogleLinked(false)
        if (deviceId) {
          await checkSubscription(deviceId)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [deviceId])

  const checkGoogleLink = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setIsGoogleLinked(true)
        setGoogleEmail(session.user.email || null)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la liaison Google:', error)
    }
  }

  const checkSubscription = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || id

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification de l\'abonnement:', error.message)
        return
      }

      setHasSubscription(!!data)
    } catch (error) {
      console.error('Exception lors de la vérification de l\'abonnement:', error)
      setHasSubscription(false)
    }
  }

  const linkGoogleAccount = async () => {
    if (!deviceId) return

    try {
      localStorage.setItem('temp_device_id', deviceId)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Erreur lors de la liaison avec Google:', error)
      }
    } catch (error) {
      console.error('Exception lors de la liaison avec Google:', error)
    }
  }

  const unlinkGoogleAccount = async () => {
    try {
      await supabase.auth.signOut()
      setIsGoogleLinked(false)
      setGoogleEmail(null)
      if (deviceId) {
        await checkSubscription(deviceId)
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion de Google:', error)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        deviceId, 
        hasSubscription,
        isGoogleLinked,
        googleEmail,
        linkGoogleAccount,
        unlinkGoogleAccount
      }}
    >
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