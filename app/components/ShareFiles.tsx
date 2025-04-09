'use client'

import { useState } from 'react'
import { Send, X } from 'lucide-react'
import { shareFiles } from '../services/fileService'
import { useAuth } from '../contexts/AuthContext'

interface ShareFilesProps {
  files: File[]
  onClose: () => void
}

export default function ShareFiles({ files, onClose }: ShareFilesProps) {
  const { deviceId } = useAuth()
  const [recipientId, setRecipientId] = useState('')
  const [error, setError] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  const handleShare = async () => {
    if (!deviceId) {
      setError('Erreur: ID de l\'appareil non disponible')
      return
    }

    if (!recipientId.trim()) {
      setError('Veuillez entrer un ID d\'appareil')
      return
    }

    if (recipientId.length !== 8) {
      setError('L\'ID d\'appareil doit contenir 8 caractères')
      return
    }

    if (recipientId === deviceId) {
      setError('Vous ne pouvez pas partager avec votre propre ID')
      return
    }

    setIsSharing(true)
    setError('')

    try {
      await shareFiles(files, recipientId, deviceId)
      setShowSuccessNotification(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error('Erreur détaillée:', error)
      setError(error.message || 'Une erreur est survenue lors du partage des fichiers')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1d24] rounded-xl p-6 max-w-md w-full relative">
        {showSuccessNotification && (
          <div className="absolute top-0 left-0 right-0 -translate-y-full mb-4 p-4 bg-green-500 text-white rounded-t-xl animate-slide-down">
            Fichiers envoyés avec succès !
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Partager {files.length} fichier{files.length > 1 ? 's' : ''}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">ID de l'appareil destinataire</label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Entrez l'ID à 8 caractères"
              className="w-full px-4 py-2 bg-[#232730] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              maxLength={8}
            />
            {error && (
              <p className="text-red-400 text-sm mt-1 bg-red-400/10 p-2 rounded">
                {error}
              </p>
            )}
          </div>

          <div className="bg-[#232730] rounded-lg p-4">
            <h3 className="text-sm text-gray-400 mb-3">Fichiers à partager</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="text-sm flex justify-between items-center">
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-400 ml-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSharing ? 'Envoi en cours...' : 'Envoyer les fichiers'}
          </button>
        </div>
      </div>
    </div>
  )
} 