'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log('useRequireAuth: Kullanıcı oturumu yok, login\'e yönlendiriliyor');
      router.push('/login');
    }
  }, [user, loading, router]);

  return { user, loading };
} 