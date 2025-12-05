import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = () => {
  const { accessToken, isAuthInitialized } = useAuth();

  if (!isAuthInitialized) {
    return <div>Loading...</div>; 
  }

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;