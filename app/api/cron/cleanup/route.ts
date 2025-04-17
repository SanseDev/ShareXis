import { NextResponse } from 'next/server'
import { checkFileExpiration } from '../../../utils/limits'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Vérifier et supprimer les fichiers expirés de la base de données
    await checkFileExpiration()

    // Récupérer la liste des fichiers expirés
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() - 7) // 7 jours

    const { data: expiredFiles, error } = await supabase
      .from('shared_files')
      .select('file_id')
      .lt('created_at', expirationDate.toISOString())

    if (error) {
      console.error('Erreur lors de la récupération des fichiers expirés:', error)
      return NextResponse.json({ error: 'Erreur lors du nettoyage' }, { status: 500 })
    }

    // Supprimer les fichiers physiques
    for (const file of expiredFiles || []) {
      try {
        const filePath = join(process.cwd(), 'uploads', `${file.file_id}.enc`)
        await unlink(filePath)
      } catch (error) {
        console.error(`Erreur lors de la suppression du fichier ${file.file_id}:`, error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error)
    return NextResponse.json({ error: 'Erreur lors du nettoyage' }, { status: 500 })
  }
} 