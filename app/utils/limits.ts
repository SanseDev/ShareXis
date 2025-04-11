import { supabase } from '../lib/supabase'

// Limites pour le plan gratuit
export const FREE_PLAN_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB en octets
  DAILY_SHARES: 5,
  STORAGE_DAYS: 7,
  ENCRYPTION_LEVEL: 'basic'
}

// Vérifier la taille du fichier
export const checkFileSize = (fileSize: number): boolean => {
  return fileSize <= FREE_PLAN_LIMITS.MAX_FILE_SIZE
}

// Vérifier le nombre de partages quotidiens
export const checkDailyShares = async (userId: string): Promise<boolean> => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from('shared_files')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', userId)
    .gte('created_at', today.toISOString())

  if (error) {
    console.error('Erreur lors de la vérification des partages quotidiens:', error)
    return false
  }

  return (count || 0) < FREE_PLAN_LIMITS.DAILY_SHARES
}

// Vérifier la date d'expiration des fichiers
export const checkFileExpiration = async (): Promise<void> => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() - FREE_PLAN_LIMITS.STORAGE_DAYS)

  const { data: expiredFiles, error } = await supabase
    .from('shared_files')
    .select('file_id')
    .lt('created_at', expirationDate.toISOString())

  if (error) {
    console.error('Erreur lors de la vérification des fichiers expirés:', error)
    return
  }

  // Supprimer les fichiers expirés
  for (const file of expiredFiles || []) {
    await supabase
      .from('shared_files')
      .delete()
      .eq('file_id', file.file_id)
  }
} 