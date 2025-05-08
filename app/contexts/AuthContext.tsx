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
  userId: string | null
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
  const [userId, setUserId] = useState<string | null>(null)

  // Initialiser le deviceId et vérifier la session
  useEffect(() => {
    const initAuth = async () => {
      // Récupérer ou créer le deviceId
      let storedDeviceId = localStorage.getItem('device_id')
      if (!storedDeviceId) {
        storedDeviceId = uuidv4().slice(0, 8)
        localStorage.setItem('device_id', storedDeviceId)
      } else {
        storedDeviceId = storedDeviceId.slice(0, 8)
      }
      setDeviceId(storedDeviceId)

      try {
        // Vérifier s'il y a une session active
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          console.log('Session Google trouvée:', {
            googleId: session.user.id,
            deviceId: storedDeviceId
          })
          setIsGoogleLinked(true)
          setGoogleEmail(session.user.email || null)
          // Utiliser le deviceId pour garder l'accès aux fichiers
          setUserId(storedDeviceId)
        } else {
          console.log('Pas de session Google, utilisation du deviceId:', storedDeviceId)
          setUserId(storedDeviceId)
        }
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error)
        setUserId(storedDeviceId)
        setIsAuthenticated(true)
      }
    }

    initAuth()
  }, [])

  // Écouter les changements d'authentification
  useEffect(() => {
    if (!deviceId) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Changement d\'état d\'authentification:', {
        event,
        googleId: session?.user?.id,
        deviceId,
        currentUserId: userId
      })
      
      if (session?.user) {
        setIsGoogleLinked(true)
        setGoogleEmail(session.user.email || null)
        // Garder le deviceId comme userId principal
        setUserId(deviceId)
      } else {
        setIsGoogleLinked(false)
        setGoogleEmail(null)
        setUserId(deviceId)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [deviceId, userId])

  const checkSubscription = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || id

      const { data: subscriptionData, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification de l\'abonnement:', error.message)
        return
      }

      setHasSubscription(!!subscriptionData)
    } catch (error) {
      console.error('Exception lors de la vérification de l\'abonnement:', error)
      setHasSubscription(false)
    }
  }

  const linkGoogleAccount = async () => {
    if (!deviceId) return

    try {
      localStorage.setItem('temp_device_id', deviceId)
      
      const { error } = await supabase.auth.signInWithOAuth({
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
        userId, 
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