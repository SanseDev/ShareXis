'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import { Inbox, Download, FileText, AlertCircle, ExternalLink, User, Clock } from 'lucide-react'
import { getSharedFilesForRecipient } from '../services/fileService'

interface SharedFile {
  id: string
  file_id: string
  file_name: string
  file_size: number
  created_at: string
  sender_name?: string
}

export default function ReceivedPage() {
  const router = useRouter()
  const { deviceId } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<SharedFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadFiles = useCallback(async () => {
    if (!deviceId) return
    try {
      const receivedFiles = await getSharedFilesForRecipient(deviceId)
      console.log('Fichiers reçus (détails):', JSON.stringify(receivedFiles, null, 2))
      setFiles(receivedFiles || [])
    } catch (error) {
      setError('Impossible de charger les fichiers reçus')
      console.error('Erreur de chargement:', error)
    }
  }, [deviceId])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!deviceId) {
        router.push('/')
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [deviceId, router])

  useEffect(() => {
    if (deviceId) {
      loadFiles()
    }
  }, [deviceId, loadFiles])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'À l\'instant'
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} minutes`
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} heures`
    return `Il y a ${Math.floor(seconds / 86400)} jours`
  }

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

              {error ? (
                <div className="text-center py-12 text-red-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{error}</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun fichier reçu pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-[#232730] p-4 rounded-xl group hover:bg-[#282d36] transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#4d7cfe]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">{file.file_name}</p>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeAgo(file.created_at)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-[#4d7cfe]" />
                              <span className="text-[#4d7cfe]">Expéditeur : {file.sender_name || 'Anonyme'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-400">
                                {formatFileSize(file.file_size)}
                              </p>
                              <a
                                href={`/api/download/${file.file_id}`}
                                className="flex items-center gap-2 text-sm text-[#4d7cfe] hover:text-[#3d6df0] transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Télécharger
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 