import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { decrypt } from '../services/encryption.js';
import { getSecret, decrementViews, incrementPinAttempts } from '../services/database.js';
import { validateToken } from '../utils/token.js';
import { validatePIN } from '../utils/validation.js';
import { hashIP, hashUserAgent } from '../utils/anonymize.js';
import { viewSecretRateLimit } from '../middleware/rateLimit.js';
import { getLocale, t } from '../services/i18n.js';

const router: Router = Router();

const MAX_PIN_ATTEMPTS = 5;

/**
 * GET /view/:id - View a secret (with token validation)
 */
router.get('/view/:id', viewSecretRateLimit, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.query;
    const locale = getLocale(req);

    // Validate token
    if (!token || typeof token !== 'string' || !validateToken(id, token)) {
      return res.status(403).render('error', {
        title: t(locale, 'error.invalidLink'),
        message: t(locale, 'error.invalidLinkMessage'),
        locale: locale,
      });
    }

    // Get secret from database
    const secret = await getSecret(id);

    if (!secret) {
      return res.status(404).render('error', {
        title: t(locale, 'error.notFound'),
        message: t(locale, 'error.notFoundMessage'),
        locale: locale,
      });
    }

    // Check if PIN is required
    if (secret.pin_hash) {
      // Check if PIN was submitted
      const submittedPIN = req.query.pin as string | undefined;

      if (!submittedPIN) {
        // Show PIN form
        return res.render('view-pin', {
          title: t(locale, 'viewPin.title'),
          secretId: id,
          token: token,
          attempts: secret.pin_attempts,
          locale: locale,
        });
      }

      // Validate PIN
      const pinValidation = validatePIN(submittedPIN);
      if (!pinValidation.valid) {
        return res.status(400).render('view-pin', {
          title: t(locale, 'viewPin.title'),
          secretId: id,
          token: token,
          attempts: secret.pin_attempts,
          error: pinValidation.error,
          locale: locale,
        });
      }

      // Check PIN attempts
      if (secret.pin_attempts >= MAX_PIN_ATTEMPTS) {
        return res.status(403).render('error', {
          title: t(locale, 'error.tooManyAttempts'),
          message: t(locale, 'error.tooManyAttemptsMessage'),
          locale: locale,
        });
      }

      // Verify PIN
      const pinValid = await bcrypt.compare(submittedPIN, secret.pin_hash);

      if (!pinValid) {
        // Increment attempts
        const newAttempts = await incrementPinAttempts(id);

        if (newAttempts >= MAX_PIN_ATTEMPTS) {
          return res.status(403).render('error', {
            title: t(locale, 'error.tooManyAttempts'),
            message: t(locale, 'error.tooManyAttemptsMessage'),
            locale: locale,
          });
        }

        return res.render('view-pin', {
          title: t(locale, 'viewPin.title'),
          secretId: id,
          token: token,
          attempts: newAttempts,
          error: t(locale, 'viewPin.error'),
          locale: locale,
        });
      }
    }

    // Decrypt and display secret
    try {
      const decryptedText = decrypt(secret.encrypted_data);

      // Decrement views and delete if 0
      await decrementViews(id);

      // Log event
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent') || 'unknown';
      const { logEvent } = await import('../services/database.js');
      await logEvent(
        'viewed',
        id,
        hashIP(ip),
        hashUserAgent(userAgent)
      );

      res.render('view', {
        title: t(locale, 'view.title'),
        secret: decryptedText,
        locale: locale,
      });
    } catch (error) {
      console.error('Error decrypting secret:', error);
      res.status(500).render('error', {
        title: t(locale, 'error.decryptError'),
        message: t(locale, 'error.decryptErrorMessage'),
        locale: locale,
      });
    }
  } catch (error) {
    console.error('Error viewing secret:', error);
    const locale = getLocale(req);
    res.status(500).render('error', {
      title: t(locale, 'error.viewError'),
      message: t(locale, 'error.viewErrorMessage'),
      locale: locale,
    });
  }
});

export default router;
