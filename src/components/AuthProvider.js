import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from './ApiService';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await ApiService.refreshToken();
        if (response.data?.data) {
          handleNewAccessToken(response.data.data);
          console.log("✅ Token refreshed");
        } else {
          console.log("❌ No valid refresh token");
          navigate('/login');
        }
      } catch (error) {
        console.warn("❌ Refresh token failed:", error);
        navigate('/login');
      } finally {
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const handleNewAccessToken = (token) => {
    setAccessTokenState(token);
    ApiService.setAccessToken(token);

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.sub);
      setUserId(decoded.id || decoded.userId || null);
    } catch (e) {
      console.error("Invalid token:", e);
      setUsername(null);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await ApiService.login(username, password);
      if (response.data?.data) {
        handleNewAccessToken(response.data.data);
        navigate('/home');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setAccessTokenState(null);
      setUsername(null);
      setUserId(null);
      ApiService.setAccessToken(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, username, userId, login, logout, isAuthInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);