// context/AuthContext.tsx
import React, { createContext, useState, useContext, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, client: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (token: string, client: string) => {
    setLoading(true);
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("client", client);
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("client");
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("client");
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
