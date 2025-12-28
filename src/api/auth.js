import { axiosInstance } from './axiosInstance';

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });
  
  // Store token and user data
  if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Get current user from token
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async () => {
  const response = await axiosInstance.post('/auth/refresh');
  
  if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
  }
  
  return response.data;
};

/**
 * Change password
 * PATCH /api/v1/auth/me/password
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.patch('/auth/me/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Forgot password
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', {
    email,
  });
  return response.data;
};

/**
 * Reset password
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async (token, newPassword) => {
  const response = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return response.data;
};
