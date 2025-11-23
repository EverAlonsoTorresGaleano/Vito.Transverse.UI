/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TOKEN_STORAGE_KEY: string;
  readonly VITE_CULTURE_STORAGE_KEY: string;
  readonly VITE_APPLICATION_ID: string;
  readonly VITE_APPLICATION_SECRET: string;
  readonly VITE_DEFAULT_CULTURE: string;
  readonly VITE_AUTO_LOGOFF_TIME: string;
  readonly VITE_GRID_PAGE_SIZES_LIST: string;
  readonly VITE_GRID_DEFAULT_PAGE_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

