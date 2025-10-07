import api from './api';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    setAuthToken(token);
    return { user, token };
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    setAuthToken(token);
    return { user, token };
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common['Authorization'];
  window.location.href = "/login";
};

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common['Authorization'];
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Get current user's token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get current user data
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    logout();
    throw error.response?.data?.message || 'Failed to get user data';
  }
};

// Initialize auth state
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    setAuthToken(token);
  }
};
