import axios from 'axios';
import { getToken } from './get-token';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Change request data/error here
http.interceptors.request.use(
  (config) => {
    const base = process.env.NEXT_PUBLIC_REST_API_ENDPOINT || '';
    const sanitizedBase = base.endsWith('/api')
      ? base.slice(0, -4)
      : base;

    // If hitting demo JSON (Next.js public /api/*.json), bypass backend baseURL
    if (
      typeof config.url === 'string' &&
      config.url.startsWith('/api/') &&
      config.url.endsWith('.json')
    ) {
      // Demo JSON files from Next.js public API
      config.baseURL = '';
    } else {
      // Laravel backend
      config.baseURL = sanitizedBase;
    }

    const token = getToken();
    config.headers.Authorization = `Bearer ${token ? token : ''}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default http;
