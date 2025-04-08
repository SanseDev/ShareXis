'use client'

import { useState } from 'react'
import { Send, X } from 'lucide-react'
import { shareFiles } from '../services/fileService'

interface ShareFilesProps {
  files: File[]
  onClose: () => void
}

export default function ShareFiles({ files, onClose }: ShareFilesProps) {
  const [recipientId, setRecipientId] = useState('')
  const [error, setError] = useState('')
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (!recipientId.trim()) {
      setError('Veuillez entrer un ID d&apos;appareil')
      return
    }

    if (recipientId.length !== 8) {
      setError('L&apos;ID d&apos;appareil doit contenir 8 caractères')
      return
    }

    setIsSharing(true)
    setError('')

    try {
      // Partager les fichiers
      await shareFiles(files, recipientId)
      onClose()
    } catch (error) {
      console.error('Erreur de partage:', error)
      setError('Une erreur est survenue lors du partage des fichiers')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#1a1d24] rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Partager {files.length} fichier{files.length > 1 ? 's' : ''}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#232730] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">ID de l&apos;appareil destinataire</label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Entrez l&apos;ID à 8 caractères"
              className="w-full px-4 py-2 bg-[#232730] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              maxLength={8}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
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