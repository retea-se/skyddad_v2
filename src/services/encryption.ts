import crypto from 'crypto';
import { config } from '../../config/index.js';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // 16 bytes for AES

/**
 * Encrypts data using AES-256-CBC
 * @param text - Plain text to encrypt
 * @returns Base64 encoded string: IV + encrypted data
 */
export const encrypt = (text: string): string => {
  const key = Buffer.from(config.encryption.key, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Prepend IV to encrypted data
  return iv.toString('base64') + ':' + encrypted;
};

/**
 * Decrypts data using AES-256-CBC
 * @param encryptedData - Base64 encoded string: IV + encrypted data
 * @returns Decrypted plain text
 */
export const decrypt = (encryptedData: string): string => {
  const key = Buffer.from(config.encryption.key, 'hex');
  const parts = encryptedData.split(':');

  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(parts[0], 'base64');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};




