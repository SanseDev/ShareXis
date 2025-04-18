import crypto from 'crypto'

// Fonction pour générer une clé de chiffrement unique pour chaque partage
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Fonction pour chiffrer les données
export function encrypt(data: Buffer, key: string): Buffer {
  if (!key || key.length !== 64) { // 32 bytes en hex = 64 caractères
    throw new Error('Clé de chiffrement invalide')
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv)
  
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  const tag = cipher.getAuthTag()
  
  // Combine IV, tag et données chiffrées
  return Buffer.concat([iv, tag, encrypted])
}

// Fonction pour déchiffrer les données
export function decrypt(encryptedData: Buffer, key: string | null | undefined): Buffer {
  // Vérifier si la clé est définie
  if (!key) {
    console.error('Clé de chiffrement manquante')
    throw new Error('Clé de chiffrement manquante')
  }

  // Vérifier si la clé est au format hexadécimal (64 caractères)
  let keyBuffer: Buffer
  if (key.length === 64) {
    // Format hexadécimal attendu
    keyBuffer = Buffer.from(key, 'hex')
  } else {
    // Autre format, essayer de le convertir
    console.log('Format de clé non standard détecté, tentative de conversion...')
    
    // Si la clé est en base64
    if (key.match(/^[A-Za-z0-9+/=]+$/)) {
      try {
        keyBuffer = Buffer.from(key, 'base64')
        console.log('Clé convertie depuis base64')
      } catch (e) {
        console.error('Erreur de conversion depuis base64:', e)
        throw new Error('Format de clé non supporté')
      }
    } else {
      // Sinon, utiliser la clé telle quelle
      keyBuffer = Buffer.from(key)
      console.log('Utilisation de la clé au format brut')
    }
    
    // Vérifier que la clé a la bonne taille (32 bytes)
    if (keyBuffer.length !== 32) {
      console.error('Taille de clé incorrecte après conversion:', keyBuffer.length)
      throw new Error(`Taille de clé incorrecte: ${keyBuffer.length} bytes (attendu: 32)`)
    }
  }

  if (encryptedData.length < 32) { // IV (16) + tag (16)
    throw new Error('Données chiffrées invalides')
  }

  try {
    const iv = encryptedData.subarray(0, 16)
    const tag = encryptedData.subarray(16, 32)
    const encrypted = encryptedData.subarray(32)
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv)
    decipher.setAuthTag(tag)
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()])
  } catch (error) {
    console.error('Erreur de déchiffrement:', error)
    throw new Error('Échec du déchiffrement: ' + (error as Error).message)
  }
}

// Fonction pour hacher l'ID du destinataire (pour la vérification)
export function hashRecipientId(recipientId: string): string {
  return crypto
    .createHash('sha256')
    .update(recipientId)
    .digest('hex')
} 