import * as React from "react";
import { login as loginRequest } from "@/api/auth";
import { http } from "@/api/http";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    branchId: number
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const login = React.useCallback(
    async (email: string, password: string, branchId: number) => {
      await loginRequest({
        username: email,
        password,
        branch_id: branchId,
      });

      setIsAuthenticated(true);
    },
    []
  );

  const logout = React.useCallback(async () => {
    await http.post("/auth/logout");
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
