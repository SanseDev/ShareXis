import { NextRequest, NextResponse } from 'next/server'
import { generateEncryptionKey, encrypt, hashRecipientId } from '../../utils/encryption'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { saveFileMetadata } from '../../services/dbService'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const recipientId = formData.get('recipientId') as string
    const fileId = formData.get('fileId') as string
    const senderId = formData.get('senderId') as string

    if (!file || !recipientId || !fileId || !senderId) {
      return NextResponse.json(
        { error: 'Fichier, ID destinataire, ID fichier et ID expéditeur requis' },
        { status: 400 }
      )
    }

    // Générer une clé de chiffrement unique pour ce partage
    const encryptionKey = generateEncryptionKey()

    // Lire le contenu du fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Chiffrer le contenu
    const encryptedBuffer = encrypt(buffer, encryptionKey)

    // Créer un hash de l'ID du destinataire pour la vérification
    const hashedRecipientId = hashRecipientId(recipientId)

    // Créer le dossier de stockage s'il n'existe pas
    const uploadDir = join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, `${fileId}.enc`), encryptedBuffer)

    // Sauvegarder les métadonnées dans Supabase
    await saveFileMetadata({
      fileId,
      fileName: file.name,
      fileSize: file.size,
      recipientId: hashedRecipientId,
      encryptionKey,
      senderId
    })

    return NextResponse.json({
      fileId,
      success: true
    })
  } catch (error) {
    console.error('Erreur d\'upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du fichier' },
      { status: 500 }
    )
  }
} 