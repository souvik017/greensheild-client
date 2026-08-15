import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('greenshield_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response && error.response.status;
    const url = error.config && error.config.url ? error.config.url : '';

    // A hard 401 from any protected call ends the local session. The
    // AuthContext listens for this event so the admin state is cleared and
    // the AdminRoute will redirect to the login page automatically.
    const isProtectedCall =
      status === 401 &&
      !url.includes('/admin/auth/login') &&
      !url.includes('/admin/auth/logout');

    if (isProtectedCall) {
      localStorage.removeItem('greenshield_token');
      localStorage.removeItem('greenshield_admin');
      window.dispatchEvent(new CustomEvent('greenshield:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default instance;