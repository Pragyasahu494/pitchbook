import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cedarbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error';
    return Promise.reject({ ...error, message });
  }
);

export function setToken(token) {
  if (token) localStorage.setItem('cedarbridge_token', token);
  else localStorage.removeItem('cedarbridge_token');
}

export function getToken() {
  return localStorage.getItem('cedarbridge_token');
}

export default api;
