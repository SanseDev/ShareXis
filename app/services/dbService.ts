import { supabase } from '../lib/supabase'

interface FileMetadata {
  fileId: string
  fileName: string
  fileSize: number
  recipientId: string
  encryptionKey: string
  senderId: string
  createdAt: string
}

export async function saveFileMetadata(metadata: Omit<FileMetadata, 'createdAt'>) {
  try {
    const { data, error } = await supabase
      .from('shared_files')
      .insert([{
        ...metadata,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des métadonnées:', error)
    throw error
  }
}

export async function getSharedFilesForRecipient(recipientId: string) {
  try {
    const { data, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('recipientId', recipientId)
      .order('created_at', { ascending: false })

    if (error) throw error
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
      .eq('senderId', senderId)
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
      .match({ fileId, senderId })

    if (error) throw error
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error)
    throw error
  }
} 