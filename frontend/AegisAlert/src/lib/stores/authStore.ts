import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Types
interface User {
  username: string;
  email?: string;
  // Add other properties as needed
}

interface ApiResponse {
  message: string;
  [key: string]: any; // Allow additional properties
}

// Constants from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CSRF_TOKEN_NAME = import.meta.env.VITE_CSRF_TOKEN_NAME;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = CSRF_TOKEN_NAME;

// Helper functions
const getLocalStorageItem = (key: string): string | null => {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
};

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
};

const removeLocalStorageItem = (key: string): void => {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
};

const getStoreValue = <T>(store: Writable<T>): T => {
  let value: T = {} as T;
  store.subscribe((val) => (value = val))();
  return value;
};

// User store
const storedUser = getLocalStorageItem('user');
export const user: Writable<User | null> = writable(storedUser ? JSON.parse(storedUser) : null);

user.subscribe((value) => {
  if (value) setLocalStorageItem('user', JSON.stringify(value));
  else removeLocalStorageItem('user');
});

// API functions
const fetchCSRFToken = async (): Promise<void> => {
  try {
    await axios.get(`${API_BASE_URL}/users/csrf/`);
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

const getCSRFToken = (): string | undefined => {
  return Cookies.get(CSRF_TOKEN_NAME);
};

const handleApiError = (error: AxiosError): void => {
  console.error('API Error:', {
    message: error.message,
    response: error.response?.data,
    stack: error.stack,
  });
  throw error;
};

// Auth functions
export const login = async (username: string, password: string): Promise<void> => {
  try {
    await fetchCSRFToken();
    const csrfToken = getCSRFToken();
    if (!csrfToken) throw new Error('CSRF token not found in cookies');

    const response: AxiosResponse<ApiResponse> = await axios.post(
      `${API_BASE_URL}/users/login/`,
      { username, password },
      { headers: { 'X-CSRFToken': csrfToken } }
    );

    if (response.data.message === 'Login successful') {
      user.set({ username });
      await fetchUserProfile();
    } else {
      throw new Error('Unexpected response from server');
    }
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await fetchCSRFToken();
    const csrfToken = getCSRFToken();
    if (!csrfToken) throw new Error('CSRF token not found in cookies');

    await axios.post(
      `${API_BASE_URL}/users/logout/`,
      {},
      { headers: { 'X-CSRFToken': csrfToken } }
    );

    user.set(null);
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

export const fetchUserProfile = async (): Promise<void> => {
  try {
    await fetchCSRFToken();
    const csrfToken = getCSRFToken();
    if (!csrfToken) throw new Error('CSRF token not found in cookies');

    const response: AxiosResponse<User> = await axios.get(`${API_BASE_URL}/users/profile/`, {
      headers: { 'X-CSRFToken': csrfToken },
    });

    user.set(response.data);
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

export const register = async (userData: { username: string; password: string; email?: string }): Promise<void> => {
  try {
    await fetchCSRFToken();
    const csrfToken = getCSRFToken();
    if (!csrfToken) throw new Error('CSRF token not found in cookies');

    const response: AxiosResponse<ApiResponse> = await axios.post(
      `${API_BASE_URL}/users/register/`,
      userData,
      { headers: { 'X-CSRFToken': csrfToken } }
    );

    if (response.data.message === 'Registration successful') {
      await login(userData.username, userData.password);
    }
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};