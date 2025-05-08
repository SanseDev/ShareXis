'use client'

import { useState, useEffect, useCallback } from 'react'
import { Send, X, AlertCircle, Lock } from 'lucide-react'
import { shareFiles } from '../services/fileService'
import { useAuth } from '../contexts/AuthContext'
import { FREE_PLAN_LIMITS } from '../utils/limits'
import { getUserLimitsState } from '../utils/userLimits'
import { getUserSubscription, getPlanLimits } from '../utils/subscription'

interface ShareFilesProps {
  files: File[]
  onClose: () => void
}

interface ShareError extends Error {
  message: string
}

interface Subscription {
  plan: 'free' | 'pro' | 'enterprise'
  status: string
  expires_at: string
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
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [planLimits, setPlanLimits] = useState(FREE_PLAN_LIMITS)

  const checkLimits = useCallback(async () => {
    if (!deviceId) return
    
    try {
      const [limitsState, userSubscription] = await Promise.all([
        getUserLimitsState(deviceId),
        getUserSubscription(deviceId)
      ])

      setSubscription(userSubscription)
      setPlanLimits(getPlanLimits(userSubscription?.plan || 'free'))
      setIsLimitReached(limitsState.isLimitReached)
    } catch (error) {
      console.error('Error checking limits:', error)
    } finally {
      setIsCheckingLimits(false)
    }
  }, [deviceId])

  useEffect(() => {
    checkLimits()
  }, [checkLimits])

  const handleShare = async () => {
    if (!deviceId) {
      setError('Error: Device ID not available')
      return
    }

    if (!recipientId.trim()) {
      setError('Please enter a device ID')
      return
    }

    if (!senderName.trim()) {
      setError('Please enter your name')
      return
    }

    if (recipientId.length !== 8) {
      setError('Device ID must be 8 characters long')
      return
    }

    if (recipientId === deviceId) {
      setError('You cannot share with your own ID')
      return
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > planLimits.MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      setError(`The following files exceed the ${planLimits.MAX_FILE_SIZE / (1024 * 1024)} MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }

    // Check limits again before sending if user doesn't have a paid subscription
    if (!subscription || subscription.plan === 'free') {
      const limitsState = await getUserLimitsState(deviceId)
      if (limitsState.isLimitReached) {
        setIsLimitReached(true)
        setError('You have reached your daily sharing limit')
        return
      }
    }

    setIsSharing(true)
    setError('')

    try {
      await shareFiles(files, recipientId, deviceId, senderName)
      setShowSuccessNotification(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      const shareError = error as ShareError
      console.error('Detailed error:', shareError)
      setError(shareError.message || 'An error occurred while sharing files')
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

  const isPaidPlan = subscription?.plan && subscription.plan !== 'free'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1d24] rounded-xl p-6 max-w-md w-full relative">
        {showSuccessNotification && (
          <div className="absolute top-0 left-0 right-0 -translate-y-full mb-4 p-4 bg-green-500 text-white rounded-t-xl animate-slide-down">
            Files shared successfully!
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Share {files.length} file{files.length > 1 ? 's' : ''}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLimitReached && !isPaidPlan ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 rounded-lg flex items-center gap-3 text-red-400">
              <Lock className="w-5 h-5" />
              <div>
                <p className="font-medium">Daily limit reached</p>
                <p className="text-sm">You have reached your limit of {planLimits.DAILY_SHARES} shares for today</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] px-4 py-2 rounded-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-[#232730] rounded-lg border border-gray-700 focus:border-[#4d7cfe] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Recipient device ID</label>
              <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter 8-character ID"
                className="w-full px-4 py-2 bg-[#232730] rounded-lg border border-gray-700 focus:border-[#4d7cfe] focus:outline-none"
                maxLength={8}
              />
            </div>

            <div className="bg-[#232730] p-4 rounded-lg space-y-2">
              <h3 className="text-sm font-medium text-gray-400">
                {isPaidPlan ? `${subscription.plan} plan limits` : 'Free plan limits'}:
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Maximum file size: {planLimits.MAX_FILE_SIZE / (1024 * 1024)} MB</li>
                <li>• {planLimits.DAILY_SHARES === Infinity ? 'Unlimited shares' : `${planLimits.DAILY_SHARES} shares per day`}</li>
                <li>• Storage for {planLimits.STORAGE_DAYS === Infinity ? 'unlimited time' : `${planLimits.STORAGE_DAYS} days`}</li>
                <li>• {planLimits.ENCRYPTION_LEVEL} encryption</li>
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
              {isSharing ? 'Sending...' : 'Send files'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 