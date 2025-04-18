import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { decrypt, generateEncryptionKey } from '../../../utils/encryption'
import { readFile, writeFile, mkdir } from 'fs/promises'
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

    // Afficher la clé de chiffrement (partiellement masquée)
    const keyLength = fileData.encryption_key ? fileData.encryption_key.length : 0
    const maskedKey = fileData.encryption_key 
      ? `${fileData.encryption_key.substring(0, 4)}...${fileData.encryption_key.substring(keyLength - 4)}` 
      : 'null'
    console.log('Métadonnées récupérées:', { 
      fileName: fileData.file_name, 
      fileSize: fileData.file_size,
      keyLength,
      maskedKey
    })

    // Vérifier si la clé de chiffrement est manquante
    if (!fileData.encryption_key) {
      console.log('Clé de chiffrement manquante, tentative de récupération du fichier non chiffré...')
      
      try {
        // Essayer de récupérer le fichier depuis Supabase Storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('shared-files')
          .download(`${fileId}/${fileData.file_name}`)
        
        if (storageError) {
          console.error('Erreur lors de la récupération depuis Supabase Storage:', storageError)
          return NextResponse.json({ error: 'Fichier non trouvé et clé de chiffrement manquante' }, { status: 404 })
        }
        
        if (!storageData) {
          return NextResponse.json({ error: 'Aucune donnée reçue de Supabase Storage' }, { status: 404 })
        }
        
        // Convertir le Blob en Buffer
        const arrayBuffer = await storageData.arrayBuffer()
        const fileBuffer = Buffer.from(arrayBuffer)
        
        // Encoder le nom du fichier pour éviter les problèmes de caractères spéciaux
        const encodedFilename = encodeURIComponent(fileData.file_name)
        
        // Renvoyer le fichier non chiffré
        console.log('Envoi du fichier non chiffré au client...')
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
            'Content-Length': fileBuffer.length.toString()
          }
        })
      } catch (error) {
        console.error('Erreur lors de la récupération du fichier non chiffré:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération du fichier' }, { status: 500 })
      }
    }

    try {
      // Lire le fichier chiffré
      const filePath = join(process.cwd(), 'uploads', `${fileId}.enc`)
      console.log('Tentative de lecture du fichier:', filePath)
      
      let encryptedBuffer: Buffer
      try {
        // Essayer d'abord de lire le fichier local
        encryptedBuffer = await readFile(filePath)
        console.log('Fichier chiffré lu avec succès depuis le système de fichiers local')
      } catch (localError) {
        console.log('Fichier non trouvé localement, tentative de récupération depuis Supabase Storage...')
        
        // Si le fichier n'existe pas localement, essayer de le récupérer depuis Supabase Storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('shared-files')
          .download(`${fileId}/${fileData.file_name}`)
        
        if (storageError) {
          console.error('Erreur lors de la récupération depuis Supabase Storage:', storageError)
          throw new Error('Fichier non trouvé localement ni dans le stockage')
        }
        
        if (!storageData) {
          throw new Error('Aucune donnée reçue de Supabase Storage')
        }
        
        // Convertir le Blob en Buffer
        const arrayBuffer = await storageData.arrayBuffer()
        encryptedBuffer = Buffer.from(arrayBuffer)
        
        // Sauvegarder le fichier localement pour les prochaines fois
        const uploadDir = join(process.cwd(), 'uploads')
        await mkdir(uploadDir, { recursive: true })
        await writeFile(filePath, encryptedBuffer)
        console.log('Fichier sauvegardé localement pour les prochaines utilisations')
      }

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