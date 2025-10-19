export interface User {
  id: string;
  email: string;
  name: string;
  universityId: string;
  profilePicture?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
}

export interface LoginRequest {
  code: string;
  state: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
