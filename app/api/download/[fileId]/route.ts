import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { decrypt } from '../../../utils/encryption'
import { supabase } from '../../../lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId

    // Récupérer les métadonnées du fichier depuis Supabase
    const { data: fileData, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('file_id', fileId)
      .single()

    if (error || !fileData) {
      console.error('Erreur de récupération des métadonnées:', error)
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      )
    }

    // Lire le fichier chiffré
    const filePath = join(process.cwd(), 'uploads', `${fileId}.enc`)
    const encryptedBuffer = await readFile(filePath)

    // Déchiffrer le fichier
    const decryptedBuffer = decrypt(encryptedBuffer, fileData.encryption_key)

    // Renvoyer le fichier déchiffré
    return new NextResponse(decryptedBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileData.file_name}"`,
      },
    })
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    )
  }
} 