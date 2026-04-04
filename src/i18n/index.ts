import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';
import ja from './locales/ja.json';

const LOCALE_STORAGE_KEY = 'oddyssey:locale';

function detectLocale(): string {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && ['en', 'vi', 'ja'].includes(stored)) {
      return stored;
    }

    const browserLang = navigator.language.split('-')[0];
    if (['en', 'vi', 'ja'].includes(browserLang)) {
      return browserLang;
    }
  }
  return 'en';
}

export function persistLocale(locale: string): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

export const supportedLocales = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ja', label: '日本語' },
];

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, vi, ja },
});

export default i18n;
