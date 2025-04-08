'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import ReceivedFiles from '../components/ReceivedFiles'

export default function ReceivedPage() {
  const router = useRouter()
  const { isAuthenticated, deviceId } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('État d\'authentification:', { isAuthenticated, deviceId }) // Debug
    
    // Attendre un court instant pour s'assurer que l'état d'authentification est chargé
    const timer = setTimeout(() => {
      if (!deviceId) {
        console.log('Redirection vers la page d\'accueil - Pas de deviceId') // Debug
        router.push('/')
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [deviceId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!deviceId) {
    return null // Évite le flash de contenu pendant la redirection
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Fichiers Reçus</h1>
          </div>
          
          <ReceivedFiles />
        </div>
      </main>
    </div>
  )
} 