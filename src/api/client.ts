import { Client } from './vito-transverse-identity-api';
import { env } from '../config/env';
import { getToken } from '../utils/auth';

// Custom fetch wrapper that adds authentication headers
const createAuthenticatedFetch = () => {
  return async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const token = getToken();
    const headers = new Headers(init?.headers);
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return fetch(url, {
      ...init,
      headers,
    });
  };
};

export const createApiClient = (): Client => {
  const client = new Client(env.API_BASE_URL);
  return client;
};

export const createAuthenticatedApiClient = (): Client => {
  const authenticatedFetch = createAuthenticatedFetch();
  const client = new Client(env.API_BASE_URL, { fetch: authenticatedFetch });
  return client;
};

