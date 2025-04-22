'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Lock, RefreshCw } from 'lucide-react'
import { getUserLimitsState, UserLimitsState } from '../utils/userLimits'
import { FREE_PLAN_LIMITS } from '../utils/limits'
import { getUserSubscription, getPlanLimits } from '../utils/subscription'

interface UserLimitsDisplayProps {
  userId: string
  onLimitReached?: () => void
}

type PlanType = 'free' | 'pro' | 'enterprise'

interface Subscription {
  plan: PlanType
  status?: string
  expiresAt?: string
}

export default function UserLimitsDisplay({ userId, onLimitReached }: UserLimitsDisplayProps) {
  const [limitsState, setLimitsState] = useState<UserLimitsState | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!userId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const [state, userSubscription] = await Promise.all([
        getUserLimitsState(userId),
        getUserSubscription(userId)
      ])
      
      setLimitsState(state)
      setSubscription(userSubscription as Subscription)
      
      if (state.isLimitReached && onLimitReached) {
        onLimitReached()
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setError('Impossible de charger les informations d\'abonnement')
    } finally {
      setLoading(false)
    }
  }, [userId, onLimitReached])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#232730] p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
        <button 
          onClick={loadData}
          className="mt-2 text-sm text-[#4d7cfe] hover:text-[#3d6df0] transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!limitsState) {
    return null
  }

  const planLimits = getPlanLimits(subscription?.plan || 'free')
  const isPaidPlan = subscription?.plan && subscription.plan !== 'free'

  return (
    <div className="bg-[#232730] p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">
          {isPaidPlan ? `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan` : 'Daily Limits'}
        </h3>
        <button 
          onClick={loadData}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      {isPaidPlan ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#4d7cfe]">
            <Lock className="w-4 h-4" />
            <span>Active premium plan</span>
          </div>
          <div className="text-sm text-gray-400">
            <p>• Maximum file size: {planLimits.MAX_FILE_SIZE / (1024 * 1024 * 1024)} GB</p>
            <p>• Unlimited shares</p>
            <p>• Storage for {planLimits.STORAGE_DAYS === Infinity ? 'unlimited time' : `${planLimits.STORAGE_DAYS} days`}</p>
            <p>• {planLimits.ENCRYPTION_LEVEL} encryption</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Used shares</span>
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
          </div>

          {limitsState.isLimitReached && (
            <div className="mt-4 p-3 bg-red-500/10 rounded-lg flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>Daily limit reached</span>
            </div>
          )}
        </>
      )}
    </div>
  )
} 