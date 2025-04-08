import { v4 as uuidv4 } from 'uuid'

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

export async function shareFiles(files: File[], recipientId: string, senderId: string): Promise<string[]> {
  try {
    // Upload chaque fichier et obtenir les URLs sécurisées
    const uploadPromises = files.map(file => uploadFile(file, recipientId, senderId))
    const results = await Promise.all(uploadPromises)

    // Retourner les IDs des fichiers partagés
    return results.map(result => result.fileId)
  } catch (error) {
    console.error('Erreur de partage:', error)
    throw error
  }
} 