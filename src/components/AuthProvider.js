import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from './ApiService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthInitialized, setAuthInitialized] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await ApiService.refreshToken();
        if (response.data?.data) {
          handleNewAccessToken(response.data.data);
        }
      } catch {
        console.log("No refresh token or refresh failed");
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
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      setUsername(decodedToken.sub);
      setUserId(decodedToken.id || decodedToken.userId || null);
    } catch {
      setUsername(null);
    }
  };

  const login = async (usernameInput, password) => {
    try {
      const response = await ApiService.login(usernameInput, password);
      if (response.data?.data) {
        console.log(response.data);
        handleNewAccessToken(response.data.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  };

  const logout = async () => {
    try {
        await ApiService.logout();
        } catch (err) {
        console.error('Logout failed', err);
        } finally {
        setAccessTokenState(null);
        setUsername(null);
        ApiService.setAccessToken(null);
        navigate('/');
        }
    };

  return (
    <AuthContext.Provider value={{ accessToken, username, userId, login, logout, isAuthInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);