/**
 * Sanitize and validate secret text
 */
export const validateSecretText = (text: string): { valid: boolean; error?: string } => {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Secret text is required' };
  }

  if (text.length === 0) {
    return { valid: false, error: 'Secret text cannot be empty' };
  }

  if (text.length > 10000) {
    return { valid: false, error: 'Secret text cannot exceed 10000 characters' };
  }

  return { valid: true };
};

/**
 * Validate PIN format (4-20 alphanumeric characters)
 */
export const validatePIN = (pin: string): { valid: boolean; error?: string } => {
  if (!pin || typeof pin !== 'string') {
    return { valid: false, error: 'PIN is required' };
  }

  if (pin.length < 4 || pin.length > 20) {
    return { valid: false, error: 'PIN must be between 4 and 20 characters' };
  }

  if (!/^[a-zA-Z0-9]+$/.test(pin)) {
    return { valid: false, error: 'PIN can only contain letters and numbers' };
  }

  return { valid: true };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

