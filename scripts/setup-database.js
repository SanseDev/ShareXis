// Script principal pour configurer la base de données
require('dotenv').config()
const { execSync } = require('child_process')
const path = require('path')

async function setupDatabase() {
  try {
    console.log('Début de la configuration de la base de données...')
    
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies')
      process.exit(1)
    }
    
    // Exécuter les scripts dans l'ordre
    console.log('1. Création de la fonction RPC exec_sql...')
    execSync('node scripts/setup-exec-sql.js', { stdio: 'inherit' })
    
    console.log('2. Configuration de la table subscriptions...')
    execSync('node scripts/setup-subscriptions.js', { stdio: 'inherit' })
    
    console.log('Configuration de la base de données terminée avec succès!')
  } catch (error) {
    console.error('Erreur lors de la configuration de la base de données:', error)
    process.exit(1)
  }
}

setupDatabase() 