'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Download, FileText, AlertCircle, Clock, User } from 'lucide-react'
import { getSharedFilesForRecipient } from '../services/fileService'

export default function ReceivedFiles() {
  const { deviceId } = useAuth()
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFiles()
  }, [deviceId])

  const loadFiles = async () => {
    if (!deviceId) return
    
    try {
      const receivedFiles = await getSharedFilesForRecipient(deviceId)
      setFiles(receivedFiles || [])
    } catch (error) {
      setError('Impossible de charger les fichiers reçus')
      console.error('Erreur de chargement:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d7cfe]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{error}</p>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Aucun fichier reçu pour le moment</p>
      </div>
    )
  }

  return (
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
                {file.sender_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-[#4d7cfe]" />
                    <span className="text-[#4d7cfe]">Expéditeur : {file.sender_name}</span>
                  </div>
                )}
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
  )
} 