"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_URL } from "@/app/consts";

import { signin } from "@/services/auth/auth.service";

interface IAuthenticatedUser {
  [key: string]: any;
}

interface AuthContextType {
  authenticatedUser: IAuthenticatedUser | null;
  accessToken?: string | null;
  getAccessToken: () => string | null;
  loading: boolean;
  login: (user: IAuthenticatedUser) => void;
  refreshSession: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticatedUser, setAuthenticatedUser] =
    useState<IAuthenticatedUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentPathname = usePathname();

  const setLocalStorageItems = ({
    items,
    values,
  }: {
    items: string[];
    values: { [key: string]: any };
  }) => {
    items.forEach((item) => {
      // if value is not a string return
      if (typeof values[item] !== "string") {
        return;
      }
      localStorage.setItem(item, values[item]);
    });
  };
  const removeLocalStorageItems = ({ items }: { items: string[] }) => {
    items.forEach((item) => {
      localStorage.removeItem(item);
    });
  };

  const login = async (user: IAuthenticatedUser) => {
    const { email, password } = user;

    const signinResults = await signin({ email, password });

    const { access_token, message } = signinResults;

    console.debug("/login response:", signinResults);

    if (!access_token) {
      // Show an error message to the user
      alert(message || "access_token is missing");
      throw new Error(message || "access_token is missing");
    }

    setAccessToken(access_token);
    setLocalStorageItems({
      items: ["access_token", "refresh_token", "expires_in"],
      values: signinResults,
    });

    refreshSession();
  };

  const refreshSession = async () => {
    try {
      const localStorageAccessToken = localStorage.getItem("access_token");
      if (!localStorageAccessToken) {
        console.debug("refreshSession: No access token found in localStorage");
        if (["/signup"].includes(currentPathname)) {
          return;
        }
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/userDetails`, {
        headers: {
          Authorization: `Bearer ${localStorageAccessToken}`,
        },
      });
      const userDetails: IAuthenticatedUser = await response.json();
      const { email } = userDetails;

      if (!email) {
        router.push("/login");
        // throw new Error("Email not found in user details");
        console.debug("refreshSession: No email found in user details");
        return;
      }

      if (!response.ok) {
        throw new Error(userDetails.message || "Failed to fetch user details");
      }

      setAccessToken(localStorageAccessToken);
      setAuthenticatedUser(userDetails);

      if (!["/login", "/signup"].includes(currentPathname)) {
        router.push(currentPathname);
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const logout = () => {
    removeLocalStorageItems({
      items: ["access_token", "refresh_token", "expires_in"],
    });
    setAuthenticatedUser(null);
    refreshSession();
  };

  const getAccessToken = (): string | null => {
    return accessToken || localStorage.getItem("access_token") || null;
  };

  const value = {
    authenticatedUser,
    loading,
    login,
    refreshSession,
    logout,
    accessToken,
    getAccessToken,
  };

  useEffect(() => {
    setLoading(false);
  }, [authenticatedUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
