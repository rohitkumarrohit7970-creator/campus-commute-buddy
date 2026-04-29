import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAppData } from "@/contexts/AppDataContext";
import { APP_SESSION_STORAGE_KEY, createId } from "@/lib/transport";
import type { User, UserRole } from "@/types/bus";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, collegeId?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { saveUser, users } = useAppData();
  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(APP_SESSION_STORAGE_KEY);
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userMap = useMemo(() => new Map(users.map((candidate) => [candidate.id, candidate])), [users]);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    setUser(userMap.get(userId) ?? null);
  }, [userId, userMap]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!userId) {
      window.localStorage.removeItem(APP_SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(APP_SESSION_STORAGE_KEY, userId);
  }, [userId]);

  const login = async (
    email: string,
    _password: string,
    role: UserRole,
    collegeId?: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = users.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.role === role,
    );

    const nextUser =
      existingUser ??
      saveUser({
        id: createId(role),
        name: normalizedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        email: normalizedEmail,
        role,
        collegeId: role === "student" ? collegeId || `GEU${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      });

    setUser(nextUser);
    setUserId(nextUser.id);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
  };

  useEffect(() => {
    if (userId && !userMap.has(userId)) {
      setUser(null);
      setUserId(null);
    }
  }, [userId, userMap]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
