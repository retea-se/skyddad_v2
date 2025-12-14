import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type Locale = 'sv' | 'en';

interface LocaleData {
  [key: string]: string | LocaleData;
}

let locales: Record<Locale, LocaleData> = {
  sv: {},
  en: {},
};

/**
 * Load locale files
 */
export const loadLocales = (): void => {
  try {
    const svPath = join(__dirname, '..', '..', 'locales', 'sv.json');
    const enPath = join(__dirname, '..', '..', 'locales', 'en.json');

    locales.sv = JSON.parse(readFileSync(svPath, 'utf-8'));
    locales.en = JSON.parse(readFileSync(enPath, 'utf-8'));
  } catch (error) {
    console.error('Error loading locales:', error);
  }
};

/**
 * Get translation by key path (e.g., 'app.title' or 'home.welcome')
 */
export const t = (locale: Locale, key: string, fallback?: string): string => {
  const keys = key.split('.');
  let value: any = locales[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Try fallback to Swedish if not found
      if (locale !== 'sv') {
        return t('sv', key, fallback);
      }
      return fallback || key;
    }
  }

  if (typeof value === 'string') {
    return value;
  }

  return fallback || key;
};

/**
 * Get locale from request (cookie, query param, or default)
 */
export const getLocale = (req: any): Locale => {
  // Check query parameter
  if (req.query?.lang === 'en' || req.query?.lang === 'sv') {
    return req.query.lang;
  }

  // Check cookie
  if (req.cookies?.locale === 'en' || req.cookies?.locale === 'sv') {
    return req.cookies.locale;
  }

  // Default to Swedish
  return 'sv';
};

/**
 * Set locale cookie
 */
export const setLocale = (res: any, locale: Locale): void => {
  res.cookie('locale', locale, {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

// Load locales on module import
loadLocales();




