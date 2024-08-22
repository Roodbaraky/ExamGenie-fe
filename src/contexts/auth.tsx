import { Session } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user_role: string | undefined;
  session: Session | null;
}
interface UserMetadata {
  email?: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
}
interface CustomPayload {
  user_role?: string;
  role?: string;
  user_metadata?: UserMetadata;
}
const tokenKey = import.meta.env.VITE_SUPABASE_TOKEN_KEY;
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<null | Session>(null);
  const [token, setToken] = useState<string | null>(null);
  const jwtPayload = token ? jwtDecode(token) : undefined;
  const user_role = (jwtPayload as CustomPayload)?.user_role;
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [token]);

 

  useEffect(() => {
    const storedToken = localStorage.getItem(
      "sb-agicdzhhufcedtbsniuz-auth-token"
    );
    if (storedToken) {
      setToken(storedToken);
    }
  }, [session]);

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(tokenKey, newToken);
    } else {
      localStorage.removeItem(tokenKey);
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken: updateToken, user_role, session }}
    >
      {children}
    </AuthContext.Provider>
  );
};
