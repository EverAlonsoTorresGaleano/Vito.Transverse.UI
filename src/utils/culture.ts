import { env } from '../config/env';

export const getCulture = (): string => {
  return localStorage.getItem(env.CULTURE_STORAGE_KEY) || env.DEFAULT_CULTURE;
};

export const setCulture = (culture: string): void => {
  localStorage.setItem(env.CULTURE_STORAGE_KEY, culture);
};

