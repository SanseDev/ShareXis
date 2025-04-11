import { NextRequest, NextResponse } from 'next/server'
import { generateEncryptionKey, encrypt, hashRecipientId } from '../../utils/encryption'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { saveFileMetadata } from '../../services/dbService'
import { checkFileSize, checkDailyShares } from '../../utils/limits'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const recipientId = formData.get('recipientId') as string
    const fileId = formData.get('fileId') as string
    const senderId = formData.get('senderId') as string
    const senderName = formData.get('senderName') as string

    if (!file || !recipientId || !fileId || !senderId || !senderName) {
      return NextResponse.json(
        { error: 'Fichier, ID destinataire, ID fichier, ID expéditeur et nom de l\'expéditeur requis' },
        { status: 400 }
      )
    }

    // Vérifier la taille du fichier
    if (!checkFileSize(file.size)) {
      return NextResponse.json(
        { error: 'La taille du fichier dépasse la limite de 100 MB' },
        { status: 400 }
      )
    }

    // Vérifier le nombre de partages quotidiens
    const canShare = await checkDailyShares(senderId)
    if (!canShare) {
      return NextResponse.json(
        { error: 'Vous avez atteint la limite de 5 partages quotidiens' },
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

    // Créer le dossier de stockage s'il n'existe pas
    const uploadDir = join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, `${fileId}.enc`), encryptedBuffer)

    // Sauvegarder les métadonnées dans Supabase
    await saveFileMetadata({
      file_id: fileId,
      file_name: file.name,
      file_size: file.size,
      recipient_id: recipientId,
      encryption_key: encryptionKey,
      sender_id: senderId,
      sender_name: senderName
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