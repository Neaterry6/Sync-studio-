import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const consumeRedirectResult = async () => {
      try {
        await getRedirectResult(auth);
      } catch (e) {
        console.error('Redirect Login Error:', e);
      }
    };

    consumeRedirectResult();
  }, []);


  const login = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      const authError = e as { code?: string };
      const shouldFallbackToRedirect = authError.code === 'auth/popup-blocked' || authError.code === 'auth/cancelled-popup-request';

      if (shouldFallbackToRedirect) {
        await signInWithRedirect(auth, provider);
        return;
      }

      console.error("Login Error:", e);
      alert("Login failed. Check console for details.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout Error:", e);
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
