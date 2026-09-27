import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const user = useSelector((state: any) => state.user);
  console.log(user);

  if (!user.userInfo || !user.token) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.userInfo.role)) {
    return <Navigate to="/not-allowed" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
