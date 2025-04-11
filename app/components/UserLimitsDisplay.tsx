'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Lock, RefreshCw } from 'lucide-react'
import { getUserLimitsState, UserLimitsState } from '../utils/userLimits'
import { FREE_PLAN_LIMITS } from '../utils/limits'

interface UserLimitsDisplayProps {
  userId: string
  onLimitReached?: () => void
}

export default function UserLimitsDisplay({ userId, onLimitReached }: UserLimitsDisplayProps) {
  const [limitsState, setLimitsState] = useState<UserLimitsState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLimitsState()
  }, [userId])

  const loadLimitsState = async () => {
    if (!userId) return
    
    try {
      const state = await getUserLimitsState(userId)
      setLimitsState(state)
      
      if (state.isLimitReached && onLimitReached) {
        onLimitReached()
      }
    } catch (error) {
      console.error('Erreur lors du chargement des limites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (!limitsState) {
    return null
  }

  return (
    <div className="bg-[#232730] p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">Limites quotidiennes</h3>
        <button 
          onClick={loadLimitsState}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Partages utilisés</span>
          <span className="text-sm font-medium">
            {limitsState.dailySharesUsed} / {FREE_PLAN_LIMITS.DAILY_SHARES}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              limitsState.isLimitReached 
                ? 'bg-red-500' 
                : limitsState.dailySharesRemaining <= 1 
                  ? 'bg-yellow-500' 
                  : 'bg-[#4d7cfe]'
            }`}
            style={{ width: `${(limitsState.dailySharesUsed / FREE_PLAN_LIMITS.DAILY_SHARES) * 100}%` }}
          />
        </div>
        
        {limitsState.isLimitReached ? (
          <div className="mt-2 p-2 bg-red-500/10 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <Lock className="w-4 h-4" />
            <span>Vous avez atteint votre limite quotidienne de partages</span>
          </div>
        ) : limitsState.dailySharesRemaining <= 1 ? (
          <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Il vous reste {limitsState.dailySharesRemaining} partage aujourd'hui</span>
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-400">
            Il vous reste {limitsState.dailySharesRemaining} partages aujourd'hui
          </div>
        )}
      </div>
    </div>
  )
} 