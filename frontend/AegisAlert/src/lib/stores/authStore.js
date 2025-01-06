import { writable } from 'svelte/store';
import axios from 'axios';
import Cookies from 'js-cookie';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageItem = (key, value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageItem = (key) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Load user from local storage if available
const storedUser = getLocalStorageItem('user');
export const user = writable(storedUser ? JSON.parse(storedUser) : null);

// Subscribe to user store to save changes to local storage
user.subscribe((value) => {
  if (value) {
    setLocalStorageItem('user', JSON.stringify(value));
  } else {
    removeLocalStorageItem('user');
  }
});

// Fetch CSRF token on app initialization
export const fetchCSRFToken = async () => {
  try {
    await axios.get('http://localhost:8000/users/csrf/');
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

// Login function
export const login = async (username, password) => {
  try {
    console.log('[Login] Step 1: Fetching CSRF token...');
    await fetchCSRFToken();

    console.log('[Login] Step 2: Extracting CSRF token from cookies...');
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      console.error('[Login] Error: CSRF token not found in cookies');
      throw new Error('CSRF token not found in cookies');
    }
    console.log('[Login] CSRF token found:', csrfToken);

    console.log('[Login] Step 3: Making login request to server...');
    const response = await axios.post(
      'http://localhost:8000/users/login/',
      { username, password },
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      }
    );

    console.log('[Login] Step 4: Login request completed. Server response:', response.data);

    if (response.data.message === 'Login successful') {
      console.log('[Login] Step 5: Login successful. Updating user store...');
      user.set({ username });
      console.log('[Login] User store updated. Current user:', getStoreValue(user));

      console.log('[Login] Step 6: Fetching user profile...');
      await fetchUserProfile();
      console.log('[Login] User profile fetched. Current user:', getStoreValue(user));
    } else {
      console.error('[Login] Error: Unexpected response from server:', response.data);
      throw new Error('Unexpected response from server');
    }
  } catch (error) {
    console.error('[Login] Error during login:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await fetchCSRFToken();
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      throw new Error('CSRF token not found in cookies');
    }

    await axios.post(
      'http://localhost:8000/users/logout/',
      {},
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      }
    );

    user.set(null);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    await fetchCSRFToken();
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      throw new Error('CSRF token not found in cookies');
    }

    const response = await axios.get('http://localhost:8000/users/profile/', {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });

    user.set(response.data);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};

// Register function
export const register = async (userData) => {
  try {
    await fetchCSRFToken();
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      throw new Error('CSRF token not found in cookies');
    }

    const response = await axios.post(
      'http://localhost:8000/users/register/',
      userData,
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      }
    );

    if (response.data.message === 'Registration successful') {
      await login(userData.username, userData.password);
    }
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// Helper function to get the current value of a store
function getStoreValue(store) {
  let value;
  store.subscribe((val) => (value = val))();
  return value;
}