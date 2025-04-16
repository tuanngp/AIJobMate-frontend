export interface RegisterResponse {
  email: string;
  username: string;
  full_name: string;
  id: number;
  disabled: boolean;
  created_at: string;
  updated_at: string;
  roles: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}
