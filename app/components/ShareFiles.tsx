'use client'

import { useState, useEffect } from 'react'
import { Send, X, AlertCircle, Lock } from 'lucide-react'
import { shareFiles } from '../services/fileService'
import { useAuth } from '../contexts/AuthContext'
import { FREE_PLAN_LIMITS } from '../utils/limits'
import { getUserLimitsState } from '../utils/userLimits'

interface ShareFilesProps {
  files: File[]
  onClose: () => void
}

export default function ShareFiles({ files, onClose }: ShareFilesProps) {
  const { deviceId } = useAuth()
  const [recipientId, setRecipientId] = useState('')
  const [senderName, setSenderName] = useState('')
  const [error, setError] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [isLimitReached, setIsLimitReached] = useState(false)
  const [isCheckingLimits, setIsCheckingLimits] = useState(true)

  useEffect(() => {
    checkLimits()
  }, [deviceId])

  const checkLimits = async () => {
    if (!deviceId) return
    
    try {
      const limitsState = await getUserLimitsState(deviceId)
      setIsLimitReached(limitsState.isLimitReached)
    } catch (error) {
      console.error('Erreur lors de la vérification des limites:', error)
    } finally {
      setIsCheckingLimits(false)
    }
  }

  const handleShare = async () => {
    if (!deviceId) {
      setError('Erreur: ID de l\'appareil non disponible')
      return
    }

    if (!recipientId.trim()) {
      setError('Veuillez entrer un ID d\'appareil')
      return
    }

    if (!senderName.trim()) {
      setError('Veuillez entrer votre nom')
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

    // Vérifier la taille des fichiers
    const oversizedFiles = files.filter(file => file.size > FREE_PLAN_LIMITS.MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      setError(`Les fichiers suivants dépassent la limite de ${FREE_PLAN_LIMITS.MAX_FILE_SIZE / (1024 * 1024)} MB : ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }

    // Vérifier à nouveau les limites avant l'envoi
    const limitsState = await getUserLimitsState(deviceId)
    if (limitsState.isLimitReached) {
      setIsLimitReached(true)
      setError('Vous avez atteint votre limite quotidienne de partages')
      return
    }

    setIsSharing(true)
    setError('')

    try {
      await shareFiles(files, recipientId, deviceId, senderName)
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

  if (isCheckingLimits) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#1a1d24] rounded-xl p-6 max-w-md w-full relative">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d7cfe]"></div>
          </div>
        </div>
      </div>
    )
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

        {isLimitReached ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 rounded-lg flex items-center gap-3 text-red-400">
              <Lock className="w-5 h-5" />
              <div>
                <p className="font-medium">Limite quotidienne atteinte</p>
                <p className="text-sm">Vous avez atteint votre limite de {FREE_PLAN_LIMITS.DAILY_SHARES} partages pour aujourd'hui</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] px-4 py-2 rounded-lg transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Votre nom</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Entrez votre nom"
                className="w-full px-4 py-2 bg-[#232730] rounded-lg border border-gray-700 focus:border-[#4d7cfe] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">ID de l'appareil destinataire</label>
              <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Entrez l'ID à 8 caractères"
                className="w-full px-4 py-2 bg-[#232730] rounded-lg border border-gray-700 focus:border-[#4d7cfe] focus:outline-none"
                maxLength={8}
              />
            </div>

            <div className="bg-[#232730] p-4 rounded-lg space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Limites du plan gratuit :</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Taille maximale par fichier : {FREE_PLAN_LIMITS.MAX_FILE_SIZE / (1024 * 1024)} MB</li>
                <li>• {FREE_PLAN_LIMITS.DAILY_SHARES} partages par jour</li>
                <li>• Conservation pendant {FREE_PLAN_LIMITS.STORAGE_DAYS} jours</li>
                <li>• Chiffrement {FREE_PLAN_LIMITS.ENCRYPTION_LEVEL}</li>
              </ul>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}

            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              {isSharing ? 'Envoi en cours...' : 'Envoyer les fichiers'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 