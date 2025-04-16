'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  useEffect(() => {
    // Nếu đã đăng nhập, chuyển hướng về trang được yêu cầu hoặc trang chủ
    if (isAuthenticated) {
      const decodedReturnUrl = returnUrl ? decodeURIComponent(returnUrl) : '/';
      router.push(decodedReturnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  // Nếu đã đăng nhập, không hiển thị form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  );
}