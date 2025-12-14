import crypto from 'crypto';
import { config } from '../../config/index.js';

/**
 * Generate HMAC token for secret link
 */
export const generateToken = (secretId: string): string => {
  const hmac = crypto.createHmac('sha256', config.csrf.secret);
  hmac.update(secretId);
  return hmac.digest('hex');
};

/**
 * Validate HMAC token
 */
export const validateToken = (secretId: string, token: string): boolean => {
  const expectedToken = generateToken(secretId);
  // Check length first to avoid timing attack on length
  if (token.length !== expectedToken.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expectedToken)
  );
};

/**
 * Generate unique secret ID (32 bytes hex = 64 characters)
 */
export const generateSecretId = (): string => {
  return crypto.randomBytes(32).toString('hex');
};




