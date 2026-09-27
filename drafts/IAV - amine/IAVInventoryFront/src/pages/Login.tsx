import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../app/store/userSlice';
import type { RootState } from '../app/store/store';
import LoginForm, { type LoginFormData } from '../components/forms/LoginForm';
import authService from '../services/authService';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, token } = useSelector((state: RootState) => state.user);

  // Check if user is already authenticated
  useEffect(() => {
    if (token && userInfo && authService.isAuthenticated()) {
      const redirectPath = getRoleBasedRedirect(userInfo.role);
      navigate(redirectPath, { replace: true });
    }
  }, [token, userInfo, navigate]);

  const handleLogin = async (formData: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(formData);
      
      // Update Redux store
      dispatch(setUserInfo({ 
        user: {
          ...response.user,
          id: response.user.id.toString(),
          _id: response.user.id.toString(),
          role: response.user.role || 'employee'
        }, 
        token: response.token 
      }));

      // Redirect based on role
      const redirectPath = getRoleBasedRedirect(response.user.role || 'employee');
      alert(redirectPath)
      
      // Check if there's a return URL
      const from = (location.state as any)?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm 
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  );
};

// Helper function to get role-based redirect path
const getRoleBasedRedirect = (role?: string): string => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'manager':
      return '/dashboard/manager';
    case 'employee':
      return '/dashboard/employee';
    default:
      return '/dashboard/employee';
  }
};

export default Login;
