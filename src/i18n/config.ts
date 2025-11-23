import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { env } from '../config/env';
import { getCulture } from '../utils/culture';
import { createApiClient } from '../api/client';
import type { CultureTranslationDTO } from '../api/vito-transverse-identity-api';

const loadTranslations = async (cultureId: string): Promise<Record<string, string>> => {
  try {
    const { createApiClient, createAuthenticatedApiClient } = await import('../api/client');
    const { isAuthenticated } = await import('../utils/auth');
    
    // Use authenticated client if available, otherwise use regular client
    const client = isAuthenticated() ? createAuthenticatedApiClient() : createApiClient();
    const translations = await client.getApiLocalizationsV1ByCulture(cultureId);
    
    const resources: Record<string, string> = {};
    translations.forEach((translation: CultureTranslationDTO) => {
      if (translation.translationKey && translation.translationValue) {
        resources[translation.translationKey] = translation.translationValue;
      }
    });
    
    return resources;
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
};

const initI18n = async () => {
  const culture = getCulture();
  const translations = await loadTranslations(culture);

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        [culture]: {
          translation: translations,
        },
      },
      lng: culture,
      fallbackLng: env.DEFAULT_CULTURE,
      interpolation: {
        escapeValue: false,
      },
    });
};

export const changeLanguage = async (cultureId: string): Promise<void> => {
  const translations = await loadTranslations(cultureId);
  
  i18n.addResourceBundle(cultureId, 'translation', translations, true, true);
  await i18n.changeLanguage(cultureId);
};

export default initI18n;

