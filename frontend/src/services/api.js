import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/authSlice';

// API origin (frontend runtime/build-time) - Vite requires VITE_ prefix
const API_ORIGIN = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
const apiBase = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

const api = axios.create({
  baseURL: apiBase,
});

// Helper to build full upload/static URLs that live on the backend
export const getUploadUrl = (uploadPath) => {
  if (!uploadPath) return '';
  if (/^https?:\/\//i.test(uploadPath)) return uploadPath;
  // ensure leading slash
  const path = uploadPath.startsWith('/') ? uploadPath : `/${uploadPath}`;
  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
};

// attach token if available
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle errors globally (e.g., logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;

export { API_ORIGIN };