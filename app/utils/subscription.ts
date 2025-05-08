import { supabase } from '../lib/supabase'

export interface Subscription {
  user_id: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'expired'
  stripe_subscription_id?: string
  created_at: string
  expires_at: string
}

// Récupérer l'abonnement d'un utilisateur
export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    // D'abord, essayer de récupérer l'abonnement existant
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()

    // Si aucun abonnement n'existe, en créer un gratuit
    if (!existingSubscription && (!fetchError || fetchError.code === 'PGRST116')) {
      console.log('Création d\'un abonnement gratuit pour:', userId)
      const freePlanLimits = getPlanLimits('free')
      const { data: newSubscription, error: createError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan: 'free',
          status: 'active',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString(), // 1 an par défaut
          max_file_size: freePlanLimits.MAX_FILE_SIZE,
          daily_shares: freePlanLimits.DAILY_SHARES,
          storage_days: freePlanLimits.STORAGE_DAYS,
          encryption_level: freePlanLimits.ENCRYPTION_LEVEL
        })
        .select()
        .single()

      if (createError) {
        console.error('Erreur lors de la création de l\'abonnement gratuit:', createError)
        return null
      }

      return newSubscription
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Erreur lors de la récupération de l\'abonnement:', fetchError)
      return null
    }

    return existingSubscription
  } catch (error) {
    console.error('Exception lors de la récupération de l\'abonnement:', error)
    return null
  }
}

// Créer un nouvel abonnement
export const createSubscription = async (
  userId: string,
  plan: 'free' | 'pro' | 'enterprise',
  stripeSubscriptionId?: string
): Promise<Subscription | null> => {
  try {
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setMonth(expiresAt.getMonth() + 1) // Par défaut, 1 mois

    const planLimits = getPlanLimits(plan)

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan,
        status: 'active',
        stripe_subscription_id: stripeSubscriptionId,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        max_file_size: planLimits.MAX_FILE_SIZE,
        daily_shares: planLimits.DAILY_SHARES === Infinity ? -1 : planLimits.DAILY_SHARES,
        storage_days: planLimits.STORAGE_DAYS === Infinity ? -1 : planLimits.STORAGE_DAYS,
        encryption_level: planLimits.ENCRYPTION_LEVEL
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception lors de la création de l\'abonnement:', error)
    return null
  }
}

// Mettre à jour le statut d'un abonnement
export const updateSubscriptionStatus = async (
  userId: string,
  status: 'active' | 'canceled' | 'expired'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status })
      .eq('user_id', userId)

    if (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'abonnement:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception lors de la mise à jour du statut de l\'abonnement:', error)
    return false
  }
}

// Vérifier si un utilisateur a un abonnement actif
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription(userId)
    return subscription !== null && subscription.status === 'active'
  } catch (error) {
    console.error('Exception lors de la vérification de l\'abonnement actif:', error)
    return false
  }
}

// Obtenir les limites en fonction du plan
export const getPlanLimits = (plan: 'free' | 'pro' | 'enterprise') => {
  switch (plan) {
    case 'pro':
      return {
        MAX_FILE_SIZE: 5 * 1024 * 1024 * 1024, // 5 GB
        DAILY_SHARES: Infinity,
        STORAGE_DAYS: 30,
        ENCRYPTION_LEVEL: 'advanced'
      }
    case 'enterprise':
      return {
        MAX_FILE_SIZE: 20 * 1024 * 1024 * 1024, // 20 GB
        DAILY_SHARES: Infinity,
        STORAGE_DAYS: Infinity,
        ENCRYPTION_LEVEL: 'military'
      }
    default:
      return {
        MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB
        DAILY_SHARES: 5,
        STORAGE_DAYS: 7,
        ENCRYPTION_LEVEL: 'basic'
      }
  }
} 