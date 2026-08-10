import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  // Check if user is authenticated using token from localStorage only
  // Cookie check is handled in the API service for requests
  const token = localStorage.getItem('adminToken');
  const isAuthenticated = !!token;
  const location = useLocation();
  
  // Check for auth expiration flag
  useEffect(() => {
    const authExpired = sessionStorage.getItem('authExpired');
    if (authExpired) {
      sessionStorage.removeItem('authExpired');
      // This will trigger a re-render due to state change in parent or redirect
    }
  }, []);
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;