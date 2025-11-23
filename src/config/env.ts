export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY,
  CULTURE_STORAGE_KEY: import.meta.env.VITE_CULTURE_STORAGE_KEY,
  APPLICATION_ID: import.meta.env.VITE_APPLICATION_ID,
  APPLICATION_SECRET: import.meta.env.VITE_APPLICATION_SECRET,
  DEFAULT_CULTURE: import.meta.env.VITE_DEFAULT_CULTURE,
  AUTO_LOGOFF_TIME: parseInt(import.meta.env.VITE_AUTO_LOGOFF_TIME, 10),
  GRID_PAGE_SIZES_LIST: import.meta.env.VITE_GRID_PAGE_SIZES_LIST?.split(',').map(Number),
  GRID_DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_GRID_DEFAULT_PAGE_SIZE, 10),
} as const;

