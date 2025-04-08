import crypto from 'crypto'

// Fonction pour générer une clé de chiffrement unique pour chaque partage
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Fonction pour chiffrer les données
export function encrypt(data: Buffer, key: string): Buffer {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv)
  
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  const tag = cipher.getAuthTag()
  
  // Combine IV, tag et données chiffrées
  return Buffer.concat([iv, tag, encrypted])
}

// Fonction pour déchiffrer les données
export function decrypt(encryptedData: Buffer, key: string): Buffer {
  const iv = encryptedData.subarray(0, 16)
  const tag = encryptedData.subarray(16, 32)
  const encrypted = encryptedData.subarray(32)
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv)
  decipher.setAuthTag(tag)
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}

// Fonction pour hacher l'ID du destinataire (pour la vérification)
export function hashRecipientId(recipientId: string): string {
  return crypto
    .createHash('sha256')
    .update(recipientId)
    .digest('hex')
} 