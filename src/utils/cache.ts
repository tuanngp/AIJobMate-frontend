import { User } from '@/services/auth/types';

const USER_CACHE_KEY = 'cached_user';
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export const cacheUser = (user: User): void => {
  const cache: CachedData<User> = {
    data: user,
    timestamp: Date.now(),
  };
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cache));
};

export const getCachedUser = (): User | null => {
  const cached = localStorage.getItem(USER_CACHE_KEY);
  if (!cached) return null;

  try {
    const { data, timestamp }: CachedData<User> = JSON.parse(cached);
    // Kiểm tra xem cache có còn hiệu lực không
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(USER_CACHE_KEY);
    return null;
  }
};

export const clearUserCache = (): void => {
  localStorage.removeItem(USER_CACHE_KEY);
};