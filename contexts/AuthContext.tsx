'use client';

import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  AuthError
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface UserData {
  uid: string;
  email: string | null;
  username: string;
}

interface UserProfile {
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, username: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleAuthStateChange = async (user: User | null) => {
    setUser(user);
    
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({
            uid: user.uid,
            email: user.email,
            username: userDoc.data().username
          });

          // Get callback URL if exists
          const callbackUrl = searchParams?.get('callbackUrl');
          if (callbackUrl && callbackUrl.startsWith('/')) {
            router.replace(callbackUrl);
          } else if (pathname === '/login' || pathname === '/register') {
            router.replace('/dashboard');
          }
        }
      } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata:', error);
      }
    } else {
      setUserData(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return () => unsubscribe();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile({
            username: data.username,
            email: data.email,
            createdAt: data.createdAt
          });
        }
      });
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      // Callback URL'i kontrol et ve yönlendirme yap
      const callbackUrl = searchParams?.get('callbackUrl');
      const redirectUrl = callbackUrl?.startsWith('/') ? callbackUrl : '/dashboard';
      
      // Tam URL'yi oluştur ve window.location ile yönlendir
      const baseUrl = window.location.origin;
      window.location.href = `${baseUrl}${redirectUrl}`;
      
      return result;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error as AuthError;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      setUserData({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username
      });

      return userCredential;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      throw error as AuthError;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      // Session cookie'sini temizle
      await fetch('/api/auth', {
        method: 'DELETE',
      });
      router.push('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      userProfile,
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 