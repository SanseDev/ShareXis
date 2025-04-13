// Script pour créer la fonction RPC exec_sql dans Supabase
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

async function setupExecSql() {
  try {
    console.log('Début de la création de la fonction RPC exec_sql...')
    
    // Lire le fichier SQL
    const sqlFilePath = path.join(__dirname, 'create_exec_sql_function.sql')
    const sql = fs.readFileSync(sqlFilePath, 'utf8')
    
    // Exécuter le SQL directement via l'API REST de Supabase
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql })
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('Erreur lors de l\'exécution du SQL:', error)
      process.exit(1)
    }
    
    console.log('Fonction RPC exec_sql créée avec succès!')
  } catch (error) {
    console.error('Erreur lors de la création de la fonction RPC:', error)
    process.exit(1)
  }
}

setupExecSql() 