import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp: number;
  sub: string;
  jti: string;
  [key: string]: any;
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Thêm buffer 30 giây để tránh edge case
  const currentTime = Math.floor(Date.now() / 1000) + 30;
  return decoded.exp < currentTime;
};

export const getTokenExpirationTime = (token: string): number | null => {
  const decoded = decodeToken(token);
  return decoded ? decoded.exp : null;
};
