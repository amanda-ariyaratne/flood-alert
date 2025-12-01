import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load translation resources (small initial set).
const resources = {
  en: { translation: require('./locales/en.json') },
  si: { translation: require('./locales/si.json') },
  ta: { translation: require('./locales/ta.json') },
  // keep other locales available if present
  es: { translation: require('./locales/es.json') },
};

const STORAGE_KEY = 'user-language';

async function getInitialLanguage() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  } catch (e) {
    // ignore
  }
  // `expo-localization`'s typings may not expose `locale` directly in all versions,
  // so read it defensively to satisfy TypeScript and handle different runtime shapes.
  const rawLocale =
    // preferred direct prop
    (Localization as any).locale ||
    // fallback to getLocales() if available
    (typeof (Localization as any).getLocales === 'function'
      ? (Localization as any).getLocales()[0]?.languageTag
      : undefined) ||
    'en';
  return String(rawLocale).split('-')[0];
}

// Initialize i18n asynchronously but export the instance immediately.
// Consumers can call `i18n.changeLanguage` or use `useTranslation`.
getInitialLanguage().then((lng) => {
  i18n
    // react binding
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
    .catch(() => {});
});

export async function setAppLanguage(lang: string) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // ignore
  }
  return i18n.changeLanguage(lang);
}

export default i18n;
