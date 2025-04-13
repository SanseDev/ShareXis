// Script pour configurer la table subscriptions dans Supabase
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Vérifier que les variables d'environnement sont définies
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies')
  process.exit(1)
}

// Créer un client Supabase avec la clé de service (qui a des privilèges d'administration)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupSubscriptions() {
  try {
    console.log('Début de la configuration de la table subscriptions...')
    
    // Lire le fichier SQL
    const sqlFilePath = path.join(__dirname, 'create_subscriptions_table.sql')
    const sql = fs.readFileSync(sqlFilePath, 'utf8')
    
    // Exécuter le SQL
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('Erreur lors de l\'exécution du SQL:', error)
      process.exit(1)
    }
    
    console.log('Table subscriptions configurée avec succès!')
  } catch (error) {
    console.error('Erreur lors de la configuration:', error)
    process.exit(1)
  }
}

setupSubscriptions() 