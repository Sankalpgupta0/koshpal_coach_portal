import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { axiosInstance } from '../api/axiosInstance.mjs';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userStr = localStorage.getItem('user');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!userStr) {
          setIsAuthenticated(false);
          return;
        }

        const user = JSON.parse(userStr);

        if (user.role !== 'COACH') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          return;
        }

        await axiosInstance.get('/auth/me');
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        if (error.response?.status === 403) {
          try {
            await logout();
          } catch (logoutError) {
            console.log('Logout failed, but continuing with redirect');
          }
        }
        
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [userStr]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
