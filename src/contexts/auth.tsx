import React, { createContext, useEffect, useState } from 'react';

export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}
const tokenKey = import.meta.env.VITE_SUPABASE_TOKEN_KEY
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('sb-agicdzhhufcedtbsniuz-auth-token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(tokenKey, newToken);
    } else {
      localStorage.removeItem(tokenKey);
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken: updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};


