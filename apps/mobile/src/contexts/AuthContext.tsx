import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { User, AuthState, AuthTokens } from '@cypilot/shared';
import { authService } from '../services/auth';
import { MICROSOFT_CONFIG } from '@cypilot/shared';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    tokens: null,
    isLoading: true
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      const storedTokens = await SecureStore.getItemAsync('tokens');

      if (storedUser && storedTokens) {
        const user = JSON.parse(storedUser);
        const tokens = JSON.parse(storedTokens);

        // Check if tokens are still valid
        if (tokens.expiresAt > Date.now()) {
          setAuthState({
            isAuthenticated: true,
            user,
            tokens,
            isLoading: false
          });
        } else {
          // Try to refresh tokens
          try {
            await refreshTokens();
          } catch (error) {
            console.error('Failed to refresh tokens:', error);
            await logout();
          }
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const config = {
        issuer: `https://login.microsoftonline.com/${MICROSOFT_CONFIG.tenantId}/v2.0`,
        clientId: MICROSOFT_CONFIG.clientId,
        redirectUrl: 'cypilot://auth',
        scopes: MICROSOFT_CONFIG.scopes,
        additionalParameters: {},
        customHeaders: {},
      };

      const result = await authorize(config);

      if (result.authorizationCode) {
        // Exchange authorization code for tokens
        const authResult = await authService.exchangeCodeForTokens(result.authorizationCode);
        
        if (authResult.success && authResult.data) {
          const { user, tokens } = authResult.data;
          
          // Store tokens and user data securely
          await SecureStore.setItemAsync('user', JSON.stringify(user));
          await SecureStore.setItemAsync('tokens', JSON.stringify(tokens));

          setAuthState({
            isAuthenticated: true,
            user,
            tokens,
            isLoading: false
          });
        } else {
          throw new Error('Failed to exchange code for tokens');
        }
      } else {
        throw new Error('No authorization code received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        isAuthenticated: false,
        user: null,
        tokens: null
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('tokens');

      // Revoke tokens if available
      if (authState.tokens?.refreshToken) {
        try {
          await authService.revokeTokens(authState.tokens.refreshToken);
        } catch (error) {
          console.error('Error revoking tokens:', error);
        }
      }

      setAuthState({
        isAuthenticated: false,
        user: null,
        tokens: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshTokens = async () => {
    try {
      if (!authState.tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await authService.refreshTokens(authState.tokens.refreshToken);
      
      if (result.success && result.data) {
        const { tokens } = result.data;
        
        await SecureStore.setItemAsync('tokens', JSON.stringify(tokens));
        
        setAuthState(prev => ({
          ...prev,
          tokens
        }));
      } else {
        throw new Error('Failed to refresh tokens');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshTokens
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
