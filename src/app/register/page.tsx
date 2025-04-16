'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã đăng nhập, chuyển hướng về trang chủ
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Nếu đã đăng nhập, không hiển thị form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RegisterForm />
    </div>
  );
}