import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// Get encryption key from env - MUST be set separately from AUTH_SECRET
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('❌ FATAL: ENCRYPTION_KEY environment variable is required. Set it in .env.local');
  }
  // Use SHA-256 hash of secret to ensure 32-byte key
  const { createHash } = require('crypto');
  return createHash('sha256').update(secret).digest();
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * Returns base64 encoded string: iv:authTag:encryptedData
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext) return '';

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag().toString('base64');

  // Return format: iv:authTag:encryptedData
  return `${iv.toString('base64')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
export function decryptSecret(encryptedData: string): string {
  if (!encryptedData) return '';

  try {
    const [ivB64, authTagB64, encrypted] = encryptedData.split(':');
    if (!ivB64 || !authTagB64 || !encrypted) {
      console.warn('Invalid encrypted data format');
      return '';
    }

    const key = getEncryptionKey();
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

/**
 * Mask secret key for display (e.g., sk_live_...*******)
 */
export function maskSecret(secret: string, visibleChars: number = 8): string {
  if (!secret || secret.length <= visibleChars) return secret;
  return secret.slice(0, visibleChars) + '••••••••';
}
