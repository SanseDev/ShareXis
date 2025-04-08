'use client'

import { useState, useEffect } from 'react'
import { Download, FileIcon, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getSharedFilesForRecipient } from '../services/dbService'

interface SharedFile {
  id: number
  file_id: string
  file_name: string
  file_size: number
  sender_id: string
  created_at: string
}

export default function ReceivedFiles() {
  const { deviceId } = useAuth()
  const [files, setFiles] = useState<SharedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)

  useEffect(() => {
    console.log('DeviceId actuel:', deviceId) // Debug
    loadFiles()
  }, [deviceId])

  const loadFiles = async () => {
    if (!deviceId) {
      console.log('Pas de deviceId disponible') // Debug
      return
    }

    try {
      console.log('Chargement des fichiers pour deviceId:', deviceId) // Debug
      const receivedFiles = await getSharedFilesForRecipient(deviceId)
      console.log('Fichiers reçus:', receivedFiles) // Debug
      setFiles(receivedFiles || [])
      console.log('État des fichiers mis à jour:', receivedFiles?.length || 0, 'fichiers') // Debug
    } catch (error) {
      console.error('Erreur détaillée de chargement des fichiers:', error)
      setError('Impossible de charger les fichiers reçus')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (fileId: string) => {
    setDownloadingFile(fileId)
    try {
      const response = await fetch(`/api/download/${fileId}`)
      if (!response.ok) throw new Error('Erreur de téléchargement')

      const blob = await response.blob()
      const file = files.find(f => f.file_id === fileId)
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file?.file_name || 'fichier'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      setError('Impossible de télécharger le fichier')
    } finally {
      setDownloadingFile(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="bg-[#1a1d24] rounded-xl p-8 text-center">
        <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Aucun fichier reçu</h3>
        <p className="text-gray-400">
          Les fichiers partagés avec votre ID apparaîtront ici
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.file_id}
          className="bg-[#1a1d24] rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-[#232730] p-3 rounded-lg">
              <FileIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium mb-1">{file.file_name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>De: {file.sender_id}</span>
                <span>•</span>
                <span>{new Date(file.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDownload(file.file_id)}
            disabled={downloadingFile === file.file_id}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {downloadingFile === file.file_id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
} 