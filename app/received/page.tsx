'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import { Inbox, Download, FileText, AlertCircle, ExternalLink } from 'lucide-react'
import ReceivedFiles from '../components/ReceivedFiles'

export default function ReceivedPage() {
  const router = useRouter()
  const { isAuthenticated, deviceId } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!deviceId) {
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
    return null
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Fichiers Reçus</h1>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10 text-[#4d7cfe] text-sm">
                ID: {deviceId}
              </div>
            </div>
          </div>

          {/* Grille principale */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Zone d'information */}
            <div className="bg-[#1a1d24] rounded-xl p-8 border border-gray-800/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10 rounded-xl flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-[#4d7cfe]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Réception de Fichiers</h2>
                  <p className="text-gray-400">Partagez votre ID pour recevoir des fichiers</p>
                </div>
              </div>

              <div className="bg-[#232730] rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Votre ID de réception</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(deviceId)}
                    className="text-sm px-3 py-1 rounded-lg bg-[#4d7cfe]/10 text-[#4d7cfe] hover:bg-[#4d7cfe]/20 transition-colors"
                  >
                    Copier
                  </button>
                </div>
                <div className="font-mono text-lg text-[#4d7cfe] bg-[#1a1d24] p-3 rounded-lg text-center">
                  {deviceId}
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Les fichiers sont automatiquement supprimés après 7 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Partagez votre ID uniquement avec des personnes de confiance</span>
                </div>
              </div>
            </div>

            {/* Liste des fichiers reçus */}
            <div className="bg-[#1a1d24] rounded-xl p-6 border border-gray-800/30">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-[#4d7cfe]" />
                <h2 className="text-xl font-semibold">Fichiers Disponibles</h2>
              </div>

              <div className="space-y-4">
                <ReceivedFiles />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 