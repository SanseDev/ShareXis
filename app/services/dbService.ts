import { supabase } from '../lib/supabase'

interface FileMetadata {
  id: number
  file_id: string
  file_name: string
  file_size: number
  recipient_id: string
  encryption_key: string
  sender_id: string
  created_at: string
}

export async function saveFileMetadata(metadata: Omit<FileMetadata, 'id' | 'created_at'>) {
  try {
    console.log('Sauvegarde des métadonnées:', metadata) // Debug
    const { data, error } = await supabase
      .from('shared_files')
      .insert([metadata])
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error) // Debug détaillé
      throw error
    }
    return data
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des métadonnées:', error)
    throw error
  }
}

export async function getSharedFilesForRecipient(recipientId: string) {
  try {
    console.log('Recherche des fichiers pour le destinataire:', recipientId) // Debug
    const { data, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error) // Debug détaillé
      throw error
    }
    console.log('Fichiers trouvés:', data) // Debug
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error)
    throw error
  }
}

export async function getSharedFilesBySender(senderId: string) {
  try {
    const { data, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('sender_id', senderId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error)
    throw error
  }
}

export async function deleteSharedFile(fileId: string, senderId: string) {
  try {
    const { error } = await supabase
      .from('shared_files')
      .delete()
      .match({ file_id: fileId, sender_id: senderId })

    if (error) throw error
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error)
    throw error
  }
} 