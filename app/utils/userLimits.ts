import { supabase } from '../lib/supabase'
import { FREE_PLAN_LIMITS } from './limits'

export interface UserLimitsState {
  dailySharesUsed: number
  dailySharesRemaining: number
  isLimitReached: boolean
}

// Récupérer l'état des limites de l'utilisateur
export const getUserLimitsState = async (userId: string): Promise<UserLimitsState> => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from('shared_files')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', userId)
    .gte('created_at', today.toISOString())

  if (error) {
    console.error('Erreur lors de la vérification des partages quotidiens:', error)
    return {
      dailySharesUsed: 0,
      dailySharesRemaining: FREE_PLAN_LIMITS.DAILY_SHARES,
      isLimitReached: false
    }
  }

  const dailySharesUsed = count || 0
  const dailySharesRemaining = Math.max(0, FREE_PLAN_LIMITS.DAILY_SHARES - dailySharesUsed)
  const isLimitReached = dailySharesUsed >= FREE_PLAN_LIMITS.DAILY_SHARES

  return {
    dailySharesUsed,
    dailySharesRemaining,
    isLimitReached
  }
} 