"use client";
import { createContext, useContext } from "react";
import { useAuth } from "@/utils/useAuth";
import { loginWithGoogle, logout } from "@/utils/firebase"; // ✅ bring these in

const AuthContext = createContext<ReturnType<typeof useAuth> & {
  loginWithGoogle: () => void;
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={{ ...auth, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return context;
};