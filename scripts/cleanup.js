const https = require('https')

// URL de l'endpoint de nettoyage
const CLEANUP_URL = process.env.CLEANUP_URL || 'http://localhost:3000/api/cron/cleanup'

// Fonction pour exécuter le nettoyage
async function runCleanup() {
  return new Promise((resolve, reject) => {
    https.get(CLEANUP_URL, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('Nettoyage effectué avec succès')
          resolve(data)
        } else {
          console.error('Erreur lors du nettoyage:', res.statusCode)
          reject(new Error(`Erreur HTTP: ${res.statusCode}`))
        }
      })
    }).on('error', (err) => {
      console.error('Erreur lors de la requête:', err)
      reject(err)
    })
  })
}

// Exécuter le nettoyage
runCleanup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erreur:', error)
    process.exit(1)
  }) 