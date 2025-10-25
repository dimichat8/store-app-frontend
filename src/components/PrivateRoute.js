import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = () => {
  const { accessToken, isAuthInitialized } = useAuth();

  if (!isAuthInitialized) {
    return null; 
  }

  return accessToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;