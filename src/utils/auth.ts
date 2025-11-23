import { env } from '../config/env';

export const getToken = (): string | null => {
  return localStorage.getItem(env.TOKEN_STORAGE_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(env.TOKEN_STORAGE_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(env.TOKEN_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

