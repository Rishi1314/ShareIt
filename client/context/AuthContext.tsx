import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
        const token = localStorage.getItem('token');
        alert(token);
      if (token) {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext)!;