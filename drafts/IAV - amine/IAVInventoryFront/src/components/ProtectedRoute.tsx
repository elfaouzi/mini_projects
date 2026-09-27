import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store/store';
import authService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'employee' | 'manager')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const location = useLocation();
  const { userInfo, token } = useSelector((state: RootState) => state.user);
  
  // Check if user is authenticated
  const isAuthenticated = !!token && !!userInfo && authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate 
      to="/login" 
      state={{ from: location }} 
      replace 
    />;
  }
  
  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && userInfo.role) {
    const hasPermission = allowedRoles.includes(userInfo.role as 'admin' | 'employee' | 'manager');
    
    if (!hasPermission) {
      // Redirect to appropriate dashboard based on role
      const redirectPath = getRoleBasedRedirect(userInfo.role);
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  return <>{children}</>;
};

// Helper function to get role-based redirect path
const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'manager':
      return '/dashboard/manager';
    case 'employee':
      return '/dashboard/employee';
    default:
      return '/dashboard';
  }
};

export default ProtectedRoute;
