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
    
    console.log('Tentative de téléchargement pour le fichier:', fileId)
    
    // Vérifier que fileId est disponible
    if (!fileId) {
      console.error('ID de fichier manquant dans la requête')
      return NextResponse.json({ error: 'ID de fichier manquant' }, { status: 400 })
    }

    // Récupérer les métadonnées du fichier depuis Supabase
    console.log('Récupération des métadonnées depuis Supabase...')
    const { data: fileData, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('file_id', fileId)
      .single()

    if (error) {
      console.error('Erreur Supabase lors de la récupération des métadonnées:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des métadonnées du fichier' }, { status: 500 })
    }

    if (!fileData) {
      console.error('Fichier non trouvé dans la base de données')
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 })
    }

    console.log('Métadonnées récupérées:', { fileName: fileData.file_name, fileSize: fileData.file_size })

    try {
      // Lire le fichier chiffré
      const filePath = join(process.cwd(), 'uploads', `${fileId}.enc`)
      console.log('Tentative de lecture du fichier:', filePath)
      
      const encryptedBuffer = await readFile(filePath)
      console.log('Fichier chiffré lu avec succès, taille:', encryptedBuffer.length)

      // Déchiffrer le fichier
      console.log('Début du déchiffrement...')
      const decryptedBuffer = decrypt(encryptedBuffer, fileData.encryption_key)
      console.log('Fichier déchiffré avec succès, taille:', decryptedBuffer.length)

      // Encoder le nom du fichier pour éviter les problèmes de caractères spéciaux
      const encodedFilename = encodeURIComponent(fileData.file_name)

      // Renvoyer le fichier déchiffré
      console.log('Envoi du fichier au client...')
      return new NextResponse(Buffer.from(decryptedBuffer), {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
          'Content-Length': decryptedBuffer.length.toString()
        }
      })
    } catch (fileError) {
      console.error('Erreur détaillée lors du traitement du fichier:', fileError)
      return NextResponse.json(
        { error: 'Erreur lors du traitement du fichier: ' + (fileError as Error).message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur générale:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 