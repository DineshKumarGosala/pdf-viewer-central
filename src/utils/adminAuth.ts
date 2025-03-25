
import { AdminCredentials } from './types';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'pass';
const AUTH_TOKEN_KEY = 'dbms-admin-auth';

export const loginAdmin = (credentials: AdminCredentials): boolean => {
  if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_TOKEN_KEY, 'authenticated');
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_TOKEN_KEY) === 'authenticated';
};
