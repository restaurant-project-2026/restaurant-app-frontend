import { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS } from '../auth/demoUsers';

const STORAGE_KEY = 'restaurant_auth_user';

const AuthContext = createContext(null);

// fournit l'utilisateur connecté, login et logout à toute l'app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // recharge la session depuis le localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  // vérifie email/mot de passe dans la liste de démo
  const login = (email, password) => {
    const match = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!match) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const sessionUser = {
      email: match.email,
      name: match.name,
      role: match.role,
      customerEmail: match.customerEmail || null,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    return { ok: true, user: sessionUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
