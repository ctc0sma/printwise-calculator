import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import filTranslation from './locales/fil/translation.json';
import deTranslation from './locales/de/translation.json';
import frTranslation from './locales/fr/translation.json';
import itTranslation from './locales/it/translation.json';
import ptTranslation from './locales/pt/translation.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      fil: {
        translation: filTranslation,
      },
      de: {
        translation: deTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      it: {
        translation: itTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation is missing
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;