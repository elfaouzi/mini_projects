import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomeRedirect = () => {
  const navigate = useNavigate();
  interface RootState {
    user: {
      userInfo: {
        role: string;
      } | null;
    };
  }

  const user = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect based on role
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'coach':
        navigate('/coach');
        break;
      case 'member':
        navigate('/member');
        break;
      default:
        navigate('/not-allowed');
    }
  }, [user, navigate]);

  return null; // Can also show a loading spinner if you want
};

export default HomeRedirect;
