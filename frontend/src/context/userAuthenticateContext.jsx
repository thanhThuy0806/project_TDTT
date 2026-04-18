import { Users } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

const AuthenticateContext = createContext();

export function AuthenticateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthenticateContext
      value={{
        user,
        login,
        logout,
        isAuthenticated: user === null ? false : true,
        loading,
      }}
    >
      {children}
    </AuthenticateContext>
  );
}

export const useAuth = () => useContext(AuthenticateContext);
