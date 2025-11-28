import { env } from '../config/env';

export const getCultureId = (): string => {
  return localStorage.getItem(env.CULTURE_STORAGE_KEY) || env.DEFAULT_CULTURE;
};

export const getCultureName = (): string => {
  const cultureId = getCultureId();
  try {
    // Use Intl.DisplayNames to get the language name from the culture ID
    const displayNames = new Intl.DisplayNames([cultureId], { type: 'language' });
    const languageCode = cultureId.split('-')[0]; // Extract language code (e.g., "en" from "en-US")
    return displayNames.of(languageCode) || cultureId;
  } catch (error) {
    // Fallback to culture ID if Intl.DisplayNames is not available or fails
    return cultureId;
  }
};

export const setCulture = (culture: string): void => {
  localStorage.setItem(env.CULTURE_STORAGE_KEY, culture);
};

