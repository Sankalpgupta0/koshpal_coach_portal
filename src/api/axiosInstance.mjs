import axios from 'axios';

// Helper function to get CSRF token from cookie
const getCsrfToken = () => {
  const name = 'XSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return null;
};

// Rate limiting configuration
let requestQueue = [];
let isRefreshing = false;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - adds CSRF token to all non-GET requests
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[Coach Portal API] ${config.method?.toUpperCase()} ${config.url}`);
    // Add CSRF token for state-changing requests
    if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    console.error('[Coach Portal API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Coach Portal API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    console.error(`[Coach Portal API] Response error for ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.status, error.response?.data || error.message);
    
    const originalRequest = error.config;

    // Log error details for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Unauthorized - attempt token refresh before logout
      originalRequest._retry = true;

      try {
        // Attempt to refresh token using httpOnly cookie
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data.message === 'Token refreshed successfully') {
          // Token refreshed successfully, retry original request
          // Cookies are automatically sent with withCredentials: true
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, proceed to logout
      }

      // Token refresh failed - clear storage and redirect
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 429) {
      // Rate limiting - implement exponential backoff
      const retryCount = originalRequest._retryCount || 0;
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        console.warn(`Rate limit encountered. Retrying in ${delay}ms...`);

        originalRequest._retryCount = retryCount + 1;
        return new Promise(resolve => {
          setTimeout(() => resolve(axiosInstance(originalRequest)), delay);
        });
      } else {
        console.error('Rate limit exceeded after maximum retries');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
