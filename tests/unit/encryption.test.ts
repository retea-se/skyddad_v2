import { encrypt, decrypt } from '../../src/services/encryption.js';

describe('Encryption Service', () => {
  const testText = 'This is a test secret message';

  test('should encrypt and decrypt text correctly', () => {
    const encrypted = encrypt(testText);
    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toBe(testText);
    expect(encrypted).toContain(':'); // IV separator

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(testText);
  });

  test('should produce different encrypted output for same input', () => {
    const encrypted1 = encrypt(testText);
    const encrypted2 = encrypt(testText);
    expect(encrypted1).not.toBe(encrypted2); // Different IVs
  });

  test('should handle empty string', () => {
    const encrypted = encrypt('');
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe('');
  });

  test('should handle special characters', () => {
    const specialText = 'Test with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    const encrypted = encrypt(specialText);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(specialText);
  });

  test('should throw error on invalid encrypted data', () => {
    expect(() => {
      decrypt('invalid-format');
    }).toThrow();
  });
});

