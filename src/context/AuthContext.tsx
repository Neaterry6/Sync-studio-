import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const shouldUseRedirectLogin = () => {
  if (typeof window === 'undefined') return false;

  const mobileUA = /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent);
  const inStandaloneDisplayMode =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  return mobileUA || inStandaloneDisplayMode;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const consumeRedirectResult = async () => {
      try {
        await getRedirectResult(auth);
      } catch (error) {
        console.error('Firebase redirect sign-in failed:', error);
      }
    };

    consumeRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      if (shouldUseRedirectLogin()) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const authError = error as { code?: string };
      const shouldFallbackToRedirect = [
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
        'auth/operation-not-supported-in-this-environment',
      ].includes(authError.code ?? '');

      if (shouldFallbackToRedirect) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      console.error('Firebase Google login failed:', error);
      alert('Google sign-in failed. Please try again and confirm Firebase Auth is enabled for Google provider.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
