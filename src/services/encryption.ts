import crypto from 'crypto';
import { config } from '../../config/index.js';

const ALGORITHM_GCM = 'aes-256-gcm';
const ALGORITHM_CBC = 'aes-256-cbc'; // Legacy support
const IV_LENGTH = 16; // 16 bytes for AES
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM auth tag
const VERSION_GCM = 'v1';
const VERSION_CBC = 'v0'; // Legacy version

/**
 * Encrypts data using AES-256-GCM (AEAD - Authenticated Encryption with Associated Data)
 * @param text - Plain text to encrypt
 * @returns Base64 encoded string: version:IV:encrypted:authTag
 */
export const encrypt = (text: string): string => {
  const key = Buffer.from(config.encryption.key, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM_GCM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Get authentication tag (GCM provides integrity verification)
  const authTag = cipher.getAuthTag();

  // Format: version:IV:encrypted:authTag
  return `${VERSION_GCM}:${iv.toString('base64')}:${encrypted}:${authTag.toString('base64')}`;
};

/**
 * Decrypts data using AES-256-GCM (with integrity verification) or legacy AES-256-CBC
 * @param encryptedData - Base64 encoded string: version:IV:encrypted:authTag (GCM) or IV:encrypted (CBC legacy)
 * @returns Decrypted plain text
 */
export const decrypt = (encryptedData: string): string => {
  const key = Buffer.from(config.encryption.key, 'hex');
  const parts = encryptedData.split(':');

  // Legacy CBC format (no version prefix): IV:encrypted
  if (parts.length === 2) {
    return decryptLegacyCBC(parts[0], parts[1], key);
  }

  // GCM format: version:IV:encrypted:authTag
  if (parts.length === 4) {
    const [version, ivBase64, encrypted, authTagBase64] = parts;

    if (version === VERSION_GCM) {
      return decryptGCM(ivBase64, encrypted, authTagBase64, key);
    } else if (version === VERSION_CBC) {
      // Legacy v0 format (same as old CBC)
      return decryptLegacyCBC(ivBase64, encrypted, key);
    }
  }

  throw new Error('Invalid encrypted data format');
};

/**
 * Decrypt using AES-256-GCM with authentication tag verification
 */
function decryptGCM(ivBase64: string, encrypted: string, authTagBase64: string, key: Buffer): string {
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error('Invalid authentication tag length');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM_GCM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Legacy CBC decryption (for backwards compatibility)
 */
function decryptLegacyCBC(ivBase64: string, encrypted: string, key: Buffer): string {
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM_CBC, key, iv);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}




