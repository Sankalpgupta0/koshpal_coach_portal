import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../api/auth';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // First check localStorage for immediate response
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser && storedUser.id && storedUser.role === 'COACH') {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      // If no localStorage data, check with API
      try {
        const user = await getCurrentUser();
        // Check if user has COACH role
        if (user.user && user.user.role === 'COACH') {
          // Store user data in localStorage for future checks
          localStorage.setItem('user', JSON.stringify(user.user));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // If API call fails (401/403), user is not authenticated
        // Clear any stale data
        localStorage.removeItem('user');
        
        // If it's a 403 (Forbidden), also clear server-side cookies
        if (error.response?.status === 403) {
          try {
            await logout(); // This will clear httpOnly cookies
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
  }, []);

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
