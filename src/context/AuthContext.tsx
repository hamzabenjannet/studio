"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    user: User,
    token: { expires_in: string; access_token: string; refresh_token: string },
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      // In a real app, you'd validate the token with your API
      // For now, we'll just use a placeholder user
      setUser({
        email: "demo@example.com",
        name: "Max",
        family_name: "Robinson",
      });
    }
    setLoading(false);
  }, []);

  const login = (
    user: User,
    token: { expires_in: string; access_token: string; refresh_token: string },
  ) => {
    localStorage.setItem("access_token", token.access_token);
    localStorage.setItem("refresh_token", token.refresh_token);
    localStorage.setItem("expires_in", token.expires_in);

    setUser(user);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    setUser(null);
    router.push("/login");
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
