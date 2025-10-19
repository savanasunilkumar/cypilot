import axios from 'axios';
import { API_BASE_URL, LoginResponse, User, AuthTokens } from '@cypilot/shared';

class AuthService {
  private baseUrl = API_BASE_URL;

  async exchangeCodeForTokens(authorizationCode: string): Promise<{ success: boolean; data?: LoginResponse }> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/callback`, {
        code: authorizationCode,
        state: 'default'
      });

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return { success: false };
    }
  }

  async refreshTokens(refreshToken: string): Promise<{ success: boolean; data?: { tokens: AuthTokens } }> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/refresh`, {
        refreshToken
      });

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return { success: false };
    }
  }

  async revokeTokens(refreshToken: string): Promise<{ success: boolean }> {
    try {
      await axios.post(`${this.baseUrl}/auth/logout`, {
        refreshToken
      });

      return { success: true };
    } catch (error) {
      console.error('Error revoking tokens:', error);
      return { success: false };
    }
  }

  async getCurrentUser(accessToken: string): Promise<{ success: boolean; data?: { user: User } }> {
    try {
      const response = await axios.get(`${this.baseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return { success: false };
    }
  }
}

export const authService = new AuthService();
