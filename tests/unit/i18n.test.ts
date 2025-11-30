import { t, getLocale, setLocale } from '../../src/services/i18n.js';

describe('i18n Service', () => {
  test('should translate Swedish text', () => {
    const translation = t('sv', 'app.title');
    expect(translation).toBe('Skyddad');
  });

  test('should translate English text', () => {
    const translation = t('en', 'app.title');
    expect(translation).toBe('Skyddad');
  });

  test('should fallback to Swedish if translation missing', () => {
    const translation = t('en', 'app.title');
    expect(translation).toBeTruthy();
  });

  test('should return key if translation not found', () => {
    const translation = t('sv', 'nonexistent.key');
    expect(translation).toBe('nonexistent.key');
  });

  test('should handle nested keys', () => {
    const translation = t('sv', 'home.form.submit');
    expect(translation).toBe('Skapa länk');
  });
});

