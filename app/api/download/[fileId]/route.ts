import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { decrypt } from '../../../utils/encryption'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Extraire fileId de l'URL
    const url = new URL(request.url)
    const fileId = url.pathname.split('/').pop()
    
    // Vérifier que fileId est disponible
    if (!fileId) {
      return NextResponse.json({ error: 'ID de fichier manquant' }, { status: 400 })
    }

    // Récupérer les métadonnées du fichier depuis Supabase
    const { data: fileData, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('file_id', fileId)
      .single()

    if (error || !fileData) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 })
    }

    try {
      // Lire le fichier chiffré
      const filePath = join(process.cwd(), 'uploads', `${fileId}.enc`)
      const encryptedBuffer = await readFile(filePath)

      // Déchiffrer le fichier
      const decryptedBuffer = decrypt(encryptedBuffer, fileData.encryption_key)

      // Encoder le nom du fichier pour éviter les problèmes de caractères spéciaux
      const encodedFilename = encodeURIComponent(fileData.file_name)

      // Renvoyer le fichier déchiffré
      return new NextResponse(Buffer.from(decryptedBuffer), {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
          'Content-Length': decryptedBuffer.length.toString()
        }
      })
    } catch (fileError) {
      console.error('Erreur de lecture/déchiffrement:', fileError)
      return NextResponse.json(
        { error: 'Erreur lors de la lecture du fichier' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur générale:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    )
  }
} 