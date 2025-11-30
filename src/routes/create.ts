import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { encrypt } from '../services/encryption.js';
import { createSecret, logEvent } from '../services/database.js';
import { generateSecretId, generateToken } from '../utils/token.js';
import { validateSecretText, validatePIN } from '../utils/validation.js';
import { hashIP, hashUserAgent } from '../utils/anonymize.js';
import { createSecretRateLimit } from '../middleware/rateLimit.js';

const router = Router();

const PIN_SALT_ROUNDS = 12;

/**
 * Calculate expiration date from string (1h, 24h, 7d)
 */
const calculateExpiration = (expiresStr: string): Date => {
  const now = new Date();
  const match = expiresStr.match(/^(\d+)([hd])$/);

  if (!match) {
    // Default to 24 hours
    now.setHours(now.getHours() + 24);
    return now;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  if (unit === 'h') {
    now.setHours(now.getHours() + value);
  } else if (unit === 'd') {
    now.setDate(now.getDate() + value);
  }

  return now;
};

/**
 * POST /create - Create a new secret
 */
router.post('/create', createSecretRateLimit, async (req: Request, res: Response) => {
  try {
    // Validate input
    const { secret, pin, expires = '24h' } = req.body;

    const textValidation = validateSecretText(secret);
    if (!textValidation.valid) {
      return res.status(400).json({ error: textValidation.error });
    }

    let pinHash: string | null = null;
    if (pin) {
      const pinValidation = validatePIN(pin);
      if (!pinValidation.valid) {
        return res.status(400).json({ error: pinValidation.error });
      }
      pinHash = await bcrypt.hash(pin, PIN_SALT_ROUNDS);
    }

    // Generate secret ID and encrypt data
    const secretId = generateSecretId();
    const encryptedData = encrypt(secret);
    const expiresAt = calculateExpiration(expires);

    // Get IP and user agent for logging
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    // Save to database
    await createSecret(
      secretId,
      encryptedData,
      pinHash,
      1, // views_left
      expiresAt,
      ip
    );

    // Log event
    await logEvent(
      'created',
      secretId,
      hashIP(ip),
      hashUserAgent(userAgent)
    );

    // Generate token for link
    const token = generateToken(secretId);
    const viewUrl = `/view/${secretId}?token=${token}`;

    // Redirect to success page
    res.redirect(`/success?id=${secretId}&token=${token}`);
  } catch (error) {
    console.error('Error creating secret:', error);
    res.status(500).json({ error: 'Failed to create secret' });
  }
});

export default router;

