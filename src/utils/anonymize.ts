import crypto from 'crypto';

/**
 * Hash IP address with SHA-256 (GDPR compliant)
 */
export const hashIP = (ip: string): string => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};

/**
 * Partially anonymize user agent (only browser type, not version/OS)
 */
export const hashUserAgent = (userAgent: string): string => {
  // Extract browser type (simplified)
  const browserType = userAgent.includes('Chrome') ? 'Chrome' :
                     userAgent.includes('Firefox') ? 'Firefox' :
                     userAgent.includes('Safari') ? 'Safari' :
                     userAgent.includes('Edge') ? 'Edge' :
                     'Other';

  return crypto.createHash('sha256').update(browserType).digest('hex');
};

