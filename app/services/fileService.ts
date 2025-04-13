import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'
import { getUserSubscription, getPlanLimits } from '../utils/subscription'
import { FREE_PLAN_LIMITS } from '../utils/limits'

interface UploadResponse {
  fileId: string
  success: boolean
}

export async function uploadFile(file: File, recipientId: string, senderId: string): Promise<UploadResponse> {
  // Créer un ID unique pour le fichier
  const fileId = uuidv4()
  
  // Créer un FormData pour l'upload
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileId', fileId)
  formData.append('recipientId', recipientId)
  formData.append('senderId', senderId)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de l\'upload')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur détaillée d\'upload:', error)
    throw error
  }
}

export const shareFiles = async (files: File[], recipientId: string, senderId: string) => {
  try {
    // Vérifier l'abonnement de l'utilisateur
    const subscription = await getUserSubscription(senderId)
    const planLimits = getPlanLimits(subscription?.plan || 'free')

    // Vérifier la taille des fichiers
    for (const file of files) {
      if (file.size > planLimits.MAX_FILE_SIZE) {
        throw new Error(`Le fichier ${file.name} dépasse la taille maximale autorisée (${planLimits.MAX_FILE_SIZE / (1024 * 1024 * 1024)} GB)`)
      }
    }

    // Si l'utilisateur n'a pas un plan payant, vérifier les limites quotidiennes
    if (!subscription || subscription.plan === 'free') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { count, error } = await supabase
        .from('shared_files')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', senderId)
        .gte('created_at', today.toISOString())

      if (error) {
        console.error('Erreur lors de la vérification des limites quotidiennes:', error)
        throw new Error('Erreur lors de la vérification des limites quotidiennes')
      }

      if ((count || 0) + files.length > FREE_PLAN_LIMITS.DAILY_SHARES) {
        throw new Error(`Vous avez atteint votre limite quotidienne de ${FREE_PLAN_LIMITS.DAILY_SHARES} partages`)
      }
    }

    // Uploader les fichiers
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileId = crypto.randomUUID()
        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(`${fileId}/${file.name}`, file)

        if (uploadError) {
          console.error(`Erreur lors de l'upload du fichier ${file.name}:`, uploadError)
          throw new Error(`Erreur lors de l'upload du fichier ${file.name}`)
        }

        return {
          file_id: fileId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type
        }
      })
    )

    // Créer les entrées dans la base de données
    const { error: dbError } = await supabase
      .from('shared_files')
      .insert(
        uploadedFiles.map(file => ({
          ...file,
          sender_id: senderId,
          recipient_id: recipientId,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + (planLimits.STORAGE_DAYS * 24 * 60 * 60 * 1000)).toISOString()
        }))
      )

    if (dbError) {
      console.error('Erreur lors de l\'enregistrement des fichiers:', dbError)
      throw new Error('Erreur lors de l\'enregistrement des fichiers')
    }

    return uploadedFiles
  } catch (error) {
    console.error('Erreur lors du partage des fichiers:', error)
    throw error
  }
}

export const getSharedFilesForRecipient = async (recipientId: string) => {
  try {
    const { data, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des fichiers:', error)
      throw new Error('Erreur lors de la récupération des fichiers')
    }

    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error)
    throw error
  }
}

export const deleteSharedFile = async (fileId: string, userId: string) => {
  try {
    // Vérifier que l'utilisateur est autorisé à supprimer le fichier
    const { data: file, error: fileError } = await supabase
      .from('shared_files')
      .select('*')
      .eq('file_id', fileId)
      .single()

    if (fileError) {
      console.error('Erreur lors de la récupération du fichier:', fileError)
      throw new Error('Fichier non trouvé')
    }

    if (!file) {
      throw new Error('Fichier non trouvé')
    }

    if (file.sender_id !== userId && file.recipient_id !== userId) {
      throw new Error('Non autorisé')
    }

    // Supprimer le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([`${fileId}/${file.file_name}`])

    if (storageError) {
      console.error('Erreur lors de la suppression du fichier:', storageError)
      throw new Error('Erreur lors de la suppression du fichier')
    }

    // Supprimer l'entrée de la base de données
    const { error: dbError } = await supabase
      .from('shared_files')
      .delete()
      .eq('file_id', fileId)

    if (dbError) {
      console.error('Erreur lors de la suppression de l\'entrée:', dbError)
      throw new Error('Erreur lors de la suppression de l\'entrée')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error)
    throw error
  }
} 