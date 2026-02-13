import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loginAdmin, checkAdminAuth } from "../api/authApi";
import { type LoginRequest } from "../types/authTypes";

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (data: LoginRequest): Promise<void> => {
    const res = await loginAdmin(data);

    localStorage.setItem("adminToken", res.data.token);
    setToken(res.data.token);
    setUserEmail(res.data.user.email);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setUserEmail(null);
  };

  const verifyAuth = async (): Promise<void> => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await checkAdminAuth();
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, userEmail, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}; 