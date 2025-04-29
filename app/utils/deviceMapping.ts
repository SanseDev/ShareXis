import { supabase } from '../lib/supabase'

export interface DeviceMapping {
  id: string
  device_id: string
  google_id: string
  is_primary: boolean
  created_at: string
}

export interface AuthorizedDevice {
  id: string
  subscription_id: string
  device_id: string
  is_primary: boolean
  last_used_at: string
  created_at: string
}

// Lier un appareil à un compte Google
export const linkDeviceToGoogle = async (
  deviceId: string,
  googleId: string,
  isPrimary: boolean = false
): Promise<DeviceMapping | null> => {
  try {
    const { data, error } = await supabase
      .from('device_user_mapping')
      .insert({
        device_id: deviceId,
        google_id: googleId,
        is_primary: isPrimary
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la liaison de l\'appareil:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception lors de la liaison de l\'appareil:', error)
    return null
  }
}

// Récupérer tous les appareils d'un utilisateur Google
export const getDevicesByGoogleId = async (googleId: string): Promise<DeviceMapping[]> => {
  try {
    const { data, error } = await supabase
      .from('device_user_mapping')
      .select('*')
      .eq('google_id', googleId)

    if (error) {
      console.error('Erreur lors de la récupération des appareils:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception lors de la récupération des appareils:', error)
    return []
  }
}

// Ajouter un appareil autorisé à un abonnement
export const addAuthorizedDevice = async (
  subscriptionId: string,
  deviceId: string,
  isPrimary: boolean = false
): Promise<AuthorizedDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('authorized_devices')
      .insert({
        subscription_id: subscriptionId,
        device_id: deviceId,
        is_primary: isPrimary
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de l\'ajout de l\'appareil autorisé:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception lors de l\'ajout de l\'appareil autorisé:', error)
    return null
  }
}

// Récupérer tous les appareils autorisés pour un abonnement
export const getAuthorizedDevices = async (subscriptionId: string): Promise<AuthorizedDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('authorized_devices')
      .select('*')
      .eq('subscription_id', subscriptionId)

    if (error) {
      console.error('Erreur lors de la récupération des appareils autorisés:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception lors de la récupération des appareils autorisés:', error)
    return []
  }
}

// Mettre à jour la date de dernière utilisation d'un appareil
export const updateDeviceLastUsed = async (deviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('authorized_devices')
      .update({ last_used_at: new Date().toISOString() })
      .eq('device_id', deviceId)

    if (error) {
      console.error('Erreur lors de la mise à jour de la dernière utilisation:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception lors de la mise à jour de la dernière utilisation:', error)
    return false
  }
}

// Supprimer un appareil autorisé
export const removeAuthorizedDevice = async (deviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('authorized_devices')
      .delete()
      .eq('device_id', deviceId)

    if (error) {
      console.error('Erreur lors de la suppression de l\'appareil:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception lors de la suppression de l\'appareil:', error)
    return false
  }
} 