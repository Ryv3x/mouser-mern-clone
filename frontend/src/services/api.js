import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/authSlice';

// Build-time API origin (Vite requires VITE_ prefix)
const BUILT_API_ORIGIN = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '';

// Runtime host -> backend mapping (force fix for deployed frontend)
const RUNTIME_FALLBACKS = {
  'mouser-mern-clone.vercel.app': 'https://mouser-mern-clone.onrender.com',
};

const runtimeHost = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '';

// Final API origin: prefer build-time, else runtime fallback for known hostnames
const API_ORIGIN = BUILT_API_ORIGIN || RUNTIME_FALLBACKS[runtimeHost] || '';
const BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Helper to build full upload/static URLs that live on the backend
export const getUploadUrl = (uploadPath) => {
  if (!uploadPath) return '';
  if (/^https?:\/\//i.test(uploadPath)) return uploadPath;
  const path = uploadPath.startsWith('/') ? uploadPath : `/${uploadPath}`;
  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
};

// attach token if available
api.interceptors.request.use((config) => {
  try {
    const state = store.getState();
    const token = state?.auth?.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

// handle errors globally (e.g., logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error?.response?.status === 401) {
        store.dispatch(logout());
      }
    } catch (e) {}
    return Promise.reject(error);
  }
);

// Runtime fetch interceptor: rewrite requests starting with '/api' to the forced backend origin
if (typeof window !== 'undefined' && API_ORIGIN) {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      let url = typeof input === 'string' ? input : input?.url;
      if (url && url.startsWith('/api')) {
        url = `${API_ORIGIN}${url}`;
        if (typeof input === 'string') {
          input = url;
        } else if (input && typeof input === 'object') {
          input = new Request(url, input);
        }
      }
    } catch (e) {
      // swallow
    }
    return originalFetch.call(this, input, init);
  };
}

export default api;
export { API_ORIGIN, BASE_URL };