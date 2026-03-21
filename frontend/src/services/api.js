import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/authSlice';

// Hardcoded backend origin (per request) — no envs used in frontend
const API_ORIGIN = 'https://mouser-mern-clone.onrender.com';
const BASE_URL = `${API_ORIGIN}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Helper to build full upload/static URLs that live on the backend
export const getUploadUrl = (uploadPath) => {
  if (!uploadPath) return '';
  if (/^https?:\/\//i.test(uploadPath)) return uploadPath;
  const path = uploadPath.startsWith('/') ? uploadPath : `/${uploadPath}`;
  return `${API_ORIGIN}${path}`;
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
if (typeof window !== 'undefined') {
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