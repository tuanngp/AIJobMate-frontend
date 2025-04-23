import Cookies from 'js-cookie';
import { getTokenExpirationTime } from './jwt';
import { getDeviceFingerprint } from './fingerprint';

const TOKEN_CONFIG = {
  secure: process.env.NODE_ENV === 'production', // Only use secure in production
  sameSite: 'lax' as const, // Changed from 'strict' to 'lax' to allow cross-site navigation
  path: '/',
  domain: undefined, // Let the browser set the domain automatically
};

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

class TokenManager {
  private static instance: TokenManager;
  private deviceFingerprint: string | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async initialize(): Promise<void> {
    this.deviceFingerprint = await getDeviceFingerprint();
  }

  getAccessToken(): string | undefined {
    return Cookies.get('access_token');
  }

  getRefreshToken(): string | undefined {
    return Cookies.get('refresh_token');
  }

  async setTokens(tokens: TokenResponse, rememberMe = false): Promise<void> {
    const accessExpiration = getTokenExpirationTime(tokens.access_token);
    if (!accessExpiration) {
      throw new Error('Invalid access token');
    }

    // Lưu device fingerprint cùng với tokens
    const fingerprint = await getDeviceFingerprint();
    
    const options = {
      ...TOKEN_CONFIG,
      expires: rememberMe ? 30 : undefined, // 30 days if remember me
    };

    // Log token information for debugging
    console.log('Setting access token with expiration:', new Date(accessExpiration * 1000));

    // Lưu tokens với device fingerprint
    Cookies.set('access_token', tokens.access_token, {
      ...options,
      expires: new Date(accessExpiration * 1000),
    });

    if (tokens.refresh_token) {
      Cookies.set('refresh_token', tokens.refresh_token, options);
      // Lưu fingerprint để validate session
      Cookies.set('device_fingerprint', fingerprint, options);
    }
    
    // Check if cookies were set properly
    setTimeout(() => {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      console.log('Tokens set check - Access Token exists:', !!accessToken);
      console.log('Tokens set check - Refresh Token exists:', !!refreshToken);
    }, 100);
  }

  clearTokens(): void {
    Cookies.remove('access_token', TOKEN_CONFIG);
    Cookies.remove('refresh_token', TOKEN_CONFIG);
    Cookies.remove('device_fingerprint', TOKEN_CONFIG);
  }

  async validateSession(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const storedFingerprint = Cookies.get('device_fingerprint');
    
    console.log('Session validation - tokens exist:', !!accessToken, !!refreshToken);
    
    if (!accessToken || !refreshToken || !storedFingerprint) {
      console.log('Session validation failed: missing tokens or fingerprint');
      return false;
    }

    const currentFingerprint = await getDeviceFingerprint();
    return storedFingerprint === currentFingerprint;
  }

  async shouldRefreshToken(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    // Kiểm tra session hợp lệ
    const isValidSession = await this.validateSession();
    if (!isValidSession) {
      this.clearTokens();
      return false;
    }

    // Refresh token trước khi hết hạn 1 phút
    const tokenExp = getTokenExpirationTime(accessToken);
    if (!tokenExp) return true;

    const shouldRefresh = tokenExp - Date.now() / 1000 < 60;
    return shouldRefresh;
  }
}

export const tokenManager = TokenManager.getInstance();