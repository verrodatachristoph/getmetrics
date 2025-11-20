// Simple encryption utility using built-in crypto
// In production, consider using Supabase Vault for enhanced security

const ALGORITHM = 'aes-256-gcm'
const ENCODING = 'base64'

// Get encryption key from environment
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_SECRET
  if (!key) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set')
  }
  return key
}

// Generate a proper 32-byte key from the secret
function deriveKey(secret: string): Buffer {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(secret).digest()
}

export function encrypt(text: string): string {
  const crypto = require('crypto')
  const secret = getEncryptionKey()
  const key = deriveKey(secret)

  // Generate a random initialization vector
  const iv = crypto.randomBytes(16)

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', ENCODING)
  encrypted += cipher.final(ENCODING)

  // Get the authentication tag
  const authTag = cipher.getAuthTag()

  // Combine iv, authTag, and encrypted data
  const result = {
    iv: iv.toString(ENCODING),
    authTag: authTag.toString(ENCODING),
    encrypted: encrypted
  }

  return Buffer.from(JSON.stringify(result)).toString(ENCODING)
}

export function decrypt(encryptedData: string): string {
  const crypto = require('crypto')
  const secret = getEncryptionKey()
  const key = deriveKey(secret)

  // Parse the encrypted data
  const data = JSON.parse(Buffer.from(encryptedData, ENCODING).toString('utf8'))
  const iv = Buffer.from(data.iv, ENCODING)
  const authTag = Buffer.from(data.authTag, ENCODING)
  const encrypted = data.encrypted

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  // Decrypt the text
  let decrypted = decipher.update(encrypted, ENCODING, 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

// Helper to safely handle encryption errors
export function safeEncrypt(text: string | null | undefined): string | null {
  if (!text) return null
  try {
    return encrypt(text)
  } catch (error) {
    console.error('Encryption error:', error)
    return null
  }
}

// Helper to safely handle decryption errors
export function safeDecrypt(encryptedData: string | null | undefined): string | null {
  if (!encryptedData) return null
  try {
    return decrypt(encryptedData)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}
